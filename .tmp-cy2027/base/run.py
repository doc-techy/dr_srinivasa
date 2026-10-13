"""Load the AMNS app dump into an already-migrated UAT database.

Does not disable FK checks (no session_replication_role). Truncates
with CASCADE, then inserts parents before children.
Requires the target schema to already match the dump (migrations applied).
"""

from __future__ import annotations

import os
import sys
from collections import defaultdict, deque
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load_env(path: Path) -> None:
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def split_sql(text: str) -> list[str]:
    """Split SQL on semicolons that are outside single-quoted strings."""
    stmts: list[str] = []
    buf: list[str] = []
    in_str = False
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if in_str:
            buf.append(ch)
            if ch == "'" and i + 1 < n and text[i + 1] == "'":
                buf.append("'")
                i += 2
                continue
            if ch == "'":
                in_str = False
            i += 1
            continue
        if ch == "'":
            in_str = True
            buf.append(ch)
            i += 1
            continue
        if ch == "-" and i + 1 < n and text[i + 1] == "-":
            while i < n and text[i] != "\n":
                i += 1
            continue
        if ch == ";":
            stmt = "".join(buf).strip()
            if stmt:
                stmts.append(stmt)
            buf = []
            i += 1
            continue
        buf.append(ch)
        i += 1
    stmt = "".join(buf).strip()
    if stmt:
        stmts.append(stmt)
    return stmts


def table_from_insert(stmt: str) -> str | None:
    upper = stmt.lstrip().upper()
    if not upper.startswith("INSERT INTO"):
        return None
    rest = stmt.lstrip()[11:].lstrip()
    if rest.startswith('"'):
        end = rest.find('"', 1)
        return rest[1:end] if end > 1 else None
    return rest.split("(")[0].strip().split()[0].strip()


def skip_stmt(stmt: str) -> bool:
    upper = stmt.upper()
    return (
        "SESSION_REPLICATION_ROLE" in upper
        or upper.startswith("SET CONSTRAINTS")
    )


def split_csv_depth(text: str) -> list[str]:
    parts: list[str] = []
    buf: list[str] = []
    in_str = False
    depth = 0
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if in_str:
            buf.append(ch)
            if ch == "'" and i + 1 < n and text[i + 1] == "'":
                buf.append("'")
                i += 2
                continue
            if ch == "'":
                in_str = False
            i += 1
            continue
        if ch == "'":
            in_str = True
            buf.append(ch)
            i += 1
            continue
        if ch in "([":
            depth += 1
            buf.append(ch)
            i += 1
            continue
        if ch in ")]":
            depth = max(0, depth - 1)
            buf.append(ch)
            i += 1
            continue
        if ch == "," and depth == 0:
            parts.append("".join(buf).strip())
            buf = []
            i += 1
            continue
        buf.append(ch)
        i += 1
    tail = "".join(buf).strip()
    if tail:
        parts.append(tail)
    return parts


def parse_insert(stmt: str) -> tuple[str, list[str], list[list[str]]] | None:
    table = table_from_insert(stmt)
    if not table:
        return None
    upper = stmt.upper()
    values_at = upper.find(" VALUES ")
    if values_at < 0:
        values_at = upper.find(")VALUES")
        if values_at < 0:
            return None
        col_end = values_at + 1
        val_start = values_at + 7
    else:
        col_end = values_at
        val_start = values_at + 8
    head = stmt[:col_end]
    open_paren = head.find("(")
    close_paren = head.rfind(")")
    if open_paren < 0 or close_paren < 0:
        return None
    raw_cols = split_csv_depth(head[open_paren + 1 : close_paren])
    cols = [c.strip().strip('"') for c in raw_cols]
    raw_vals = stmt[val_start:].strip()
    tuples: list[list[str]] = []
    for chunk in split_csv_depth(raw_vals):
        chunk = chunk.strip()
        if chunk.startswith("(") and chunk.endswith(")"):
            chunk = chunk[1:-1]
        tuples.append(split_csv_depth(chunk))
    return table, cols, tuples


def table_columns(cur, cache: dict[str, set[str]], table: str) -> set[str]:
    if table not in cache:
        cur.execute(
            """
            select column_name
            from information_schema.columns
            where table_schema = 'public' and table_name = %s
            """,
            (table,),
        )
        cache[table] = {row[0] for row in cur.fetchall()}
    return cache[table]


def rewrite_insert(stmt: str, keep: set[str]) -> str | None:
    parsed = parse_insert(stmt)
    if not parsed:
        return stmt
    table, cols, tuples = parsed
    indexes = [i for i, col in enumerate(cols) if col in keep]
    if not indexes:
        return None
    if len(indexes) == len(cols):
        return stmt
    new_cols = ", ".join(f'"{cols[i]}"' for i in indexes)
    row_sql = []
    for values in tuples:
        if len(values) != len(cols):
            return stmt
        row_sql.append("(" + ", ".join(values[i] for i in indexes) + ")")
    return f'INSERT INTO "{table}" ({new_cols}) VALUES {", ".join(row_sql)}'


def public_tables(cur) -> list[str]:
    cur.execute(
        """
        select tablename
        from pg_tables
        where schemaname = 'public'
        order by tablename
        """
    )
    return [row[0] for row in cur.fetchall()]


def fk_load_order(cur, tables: list[str]) -> list[str]:
    """Parents before children. Ignores self-FKs."""
    known = set(tables)
    children: dict[str, set[str]] = defaultdict(set)
    indegree = {name: 0 for name in tables}
    cur.execute(
        """
        select child.relname, parent.relname
        from pg_constraint con
        join pg_class child on child.oid = con.conrelid
        join pg_class parent on parent.oid = con.confrelid
        join pg_namespace n on n.oid = child.relnamespace
        where con.contype = 'f'
          and n.nspname = 'public'
          and child.relname <> parent.relname
        """
    )
    for child, parent in cur.fetchall():
        if child not in known or parent not in known:
            continue
        if child in children[parent]:
            continue
        children[parent].add(child)
        indegree[child] += 1
    ready = deque(name for name in tables if indegree[name] == 0)
    ordered: list[str] = []
    while ready:
        name = ready.popleft()
        ordered.append(name)
        for child in sorted(children[name]):
            indegree[child] -= 1
            if indegree[child] == 0:
                ready.append(child)
    leftover = [name for name in tables if name not in ordered]
    return ordered + leftover


def truncate_all(cur, tables: list[str]) -> None:
    if not tables:
        return
    names = ", ".join(f'public."{name}"' for name in tables)
    cur.execute(f"truncate table {names} restart identity cascade")


def reset_sequences(cur) -> None:
    cur.execute(
        """
        do $$
        declare r record;
        begin
          for r in
            select
              n.nspname as nsp,
              c.relname as rel,
              a.attname as col,
              pg_get_serial_sequence(
                format('%I.%I', n.nspname, c.relname),
                a.attname
              ) as seq
            from pg_class c
            join pg_namespace n on n.oid = c.relnamespace
            join pg_attribute a on a.attrelid = c.oid
            where n.nspname = 'public'
              and c.relkind = 'r'
              and a.attnum > 0
              and not a.attisdropped
              and pg_get_serial_sequence(
                format('%I.%I', n.nspname, c.relname),
                a.attname
              ) is not null
          loop
            execute format(
              'select setval(%L, coalesce((select max(%I) from %I.%I), 1))',
              r.seq, r.col, r.nsp, r.rel
            );
          end loop;
        end $$;
        """
    )


def load_dump_fk_order(cur, path: Path, order: list[str]) -> int:
    by_table: dict[str, list[str]] = defaultdict(list)
    for stmt in split_sql(path.read_text(encoding="utf-8")):
        if skip_stmt(stmt):
            continue
        table = table_from_insert(stmt)
        if not table:
            continue
        by_table[table].append(stmt)
    existing = set(order)
    col_cache: dict[str, set[str]] = {}
    dropped: dict[str, set[str]] = defaultdict(set)
    executed = 0
    for table in order:
        keep = table_columns(cur, col_cache, table)
        for stmt in by_table.get(table, []):
            parsed = parse_insert(stmt)
            if parsed:
                extra = [col for col in parsed[1] if col not in keep]
                if extra:
                    dropped[table].update(extra)
            rewritten = rewrite_insert(stmt, keep)
            if not rewritten:
                continue
            try:
                cur.execute(rewritten)
                executed += 1
            except Exception as exc:
                print(
                    "  skip",
                    table,
                    type(exc).__name__,
                    str(exc).split("\n")[0][:160],
                )
    skipped = [name for name in by_table if name not in existing]
    if skipped:
        print("  skipped missing tables", ", ".join(sorted(skipped)))
    if dropped:
        for table, cols in sorted(dropped.items()):
            print(f"  skipped extra columns on {table}: {', '.join(sorted(cols))}")
    return executed


def main() -> None:
    env_file = HERE / "config.env"
    app_dump = HERE / "amns_app_data.sql"
    if not env_file.is_file():
        sys.exit("Missing config.env.")
    if not app_dump.is_file():
        sys.exit("Missing amns_app_data.sql (AMNS app dump).")
    load_env(env_file)
    try:
        import psycopg2
    except ImportError:
        sys.exit("Missing psycopg2-binary. Run: pip install psycopg2-binary")

    print("Connecting...")
    conn = psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        connect_timeout=12,
        sslmode=os.environ.get("DB_SSLMODE", "prefer"),
    )
    conn.autocommit = False
    cur = conn.cursor()
    tables = public_tables(cur)
    order = fk_load_order(cur, tables)
    print("Truncating public tables...")
    truncate_all(cur, tables)
    conn.commit()
    conn.autocommit = True
    print("Loading AMNS tables in FK order from amns_app_data.sql ...")
    n_app = load_dump_fk_order(cur, app_dump, order)
    print("  statements", n_app)
    print("Resetting identity sequences...")
    reset_sequences(cur)

    cur.execute(
        """
        select count(*) from information_schema.tables
        where table_schema='public' and table_type='BASE TABLE'
        """
    )
    print("public tables", cur.fetchone()[0])
    cur.execute(
        """
        select c.relname
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public' and c.relkind = 'r'
        order by 1
        """
    )
    empty = []
    filled = 0
    for (name,) in cur.fetchall():
        cur.execute(f'select count(*) from "{name}"')
        if cur.fetchone()[0]:
            filled += 1
        else:
            empty.append(name)
    print("tables with rows", filled)
    print("tables still empty", empty or "none")
    cur.execute("select count(*) from terminal_contract_terminal")
    print("terminals", cur.fetchone()[0])
    cur.execute("select count(*) from terminal_contract_regas_agreement")
    print("regas agreements", cur.fetchone()[0])
    cur.close()
    conn.close()
    print("Done.")


if __name__ == "__main__":
    main()
