"""Restore missing 'Party Details/Transporter/row-N' routes from the base UAT seed.

Run through Django (setup_cy2027.py does this):
    RESTORE_SQL_SOURCE=<amns_uat_seed.zip or amns_app_data.sql> RESTORE_MODE=check|apply
    python manage.py shell -c "exec(compile(open(r'<this file>').read(), r'<this file>', 'exec'), {'__name__': '__restore__'})"

Nothing is truncated or deleted. Routes that already exist and are active are
left untouched; inactive ones are re-activated; missing ones are created with
their route steps, re-using locations, transporters and pipelines by name.
"""

import os
import re
import sys
import zipfile

from django.db import transaction

from transporter_contract.models import Location, Party, Pipeline, Route, RouteStep, TariffPath

PREFIX = "Party Details/Transporter/row-"
TABLES = ("location", "party", "pipeline", "route", "routestep")
INSERT_RE = re.compile(r'INSERT INTO "transporter_contract_(%s)" \(([^)]*)\) VALUES ' % "|".join(TABLES))


def read_sql(source):
    if source.lower().endswith(".zip"):
        with zipfile.ZipFile(source) as archive:
            member = next((n for n in archive.namelist() if n.endswith("amns_app_data.sql")), None)
            if member is None:
                sys.exit(f"RESTORE ERROR amns_app_data.sql not found inside {source}")
            return archive.read(member).decode("utf-8", errors="replace")
    with open(source, encoding="utf-8", errors="replace") as handle:
        return handle.read()


def parse_rows(text, start):
    """Parse '(v, v, ...),(...);' starting at text[start]; return the list of tuples."""
    rows, row, i, n = [], None, start, len(text)
    while i < n:
        ch = text[i]
        if ch == "(" and row is None:
            row = []
            i += 1
        elif row is not None and ch in "Ee" and text[i + 1:i + 2] == "'":
            i += 1
        elif row is not None and ch == "'":
            i += 1
            buf = []
            while i < n:
                if text[i] == "'":
                    if text[i + 1:i + 2] == "'":
                        buf.append("'")
                        i += 2
                        continue
                    i += 1
                    break
                buf.append(text[i])
                i += 1
            row.append("".join(buf))
            if text.startswith("::", i):
                while i < n and text[i] not in ",)":
                    i += 1
        elif row is not None and ch == ",":
            i += 1
        elif row is not None and ch == ")":
            rows.append(tuple(row))
            row = None
            i += 1
        elif row is None and ch == ";":
            break
        elif ch.isspace() or (row is None and ch == ","):
            i += 1
        else:
            j = i
            while j < n and text[j] not in ",)":
                j += 1
            token = text[i:j].strip()
            row.append({"NULL": None, "true": True, "false": False}.get(token, token))
            i = j
    return rows


def load_base(sql):
    tables = {name: [] for name in TABLES}
    for match in INSERT_RE.finditer(sql):
        columns = [c.strip().strip('"') for c in match.group(2).split(",")]
        tables[match.group(1)].extend(dict(zip(columns, row)) for row in parse_rows(sql, match.end()))
    return {name: {row["id"]: row for row in rows} for name, rows in tables.items()}


def main():
    source = os.environ.get("RESTORE_SQL_SOURCE", "")
    mode = os.environ.get("RESTORE_MODE", "check")
    if not source or not os.path.isfile(source):
        sys.exit(f"RESTORE ERROR base seed file not found: {source!r}")

    base = load_base(read_sql(source))
    base_routes = sorted(
        (r for r in base["route"].values() if (r.get("source_reference") or "").startswith(PREFIX)),
        key=lambda r: int(r["source_reference"][len(PREFIX):]),
    )
    if not base_routes:
        sys.exit("RESTORE ERROR the base seed has no Party Details/Transporter routes")
    steps_by_route = {}
    for step in base["routestep"].values():
        steps_by_route.setdefault(step["route_id"], []).append(step)

    missing, inactive, blockers = [], [], []
    for route in base_routes:
        ref = route["source_reference"]
        existing = Route.objects.filter(source_reference=ref).first()
        if existing is None:
            missing.append(route)
            path = route.get("path_code_id")
            if path and not TariffPath.objects.filter(pk=path).exists():
                blockers.append(f"{ref}: tariff path {path!r} is not in the database")
            if not steps_by_route.get(route["id"]):
                blockers.append(f"{ref}: the base seed has no route steps for it")
        elif not existing.is_active:
            inactive.append(existing)

    print(f"RESTORE base routes={len(base_routes)} missing={len(missing)} inactive={len(inactive)}")
    for route in missing:
        print(f"  missing : {route['source_reference']}")
    for route in inactive:
        print(f"  inactive: {route.source_reference}")
    for blocker in blockers:
        print(f"  BLOCKER : {blocker}")
    if blockers:
        sys.exit("RESTORE ERROR tariff master data is missing too - the base seed was never loaded "
                 "on this database. Load 01_base_amns_uat_seed first.")
    if mode == "apply" and (missing or inactive):
        _apply(base, missing, inactive, steps_by_route)
        print(f"RESTORE APPLIED created={len(missing)} reactivated={len(inactive)}")
    else:
        print("RESTORE NOTHING TO DO" if not (missing or inactive) else "RESTORE CHECK DONE")

    found = Route.objects.filter(
        source_reference="Party Details/Transporter/row-13", is_active=True,
    ).exists()
    print("RESTORE ROW13 OK" if found else "RESTORE ROW13 MISSING")
    if not found:
        sys.exit("RESTORE ERROR row-13 is still not an active route")


def _apply(base, missing, inactive, steps_by_route):
    def location(location_id):
        row = base["location"][location_id]
        obj, _ = Location.objects.get_or_create(name=row["name"], defaults={
            "type": row.get("type") or "hub",
            "source_point": row.get("source_point"),
            "entry_point_id": row.get("entry_point_id"),
        })
        return obj

    def pipeline(pipeline_id):
        row = base["pipeline"][pipeline_id]
        existing = Pipeline.objects.filter(pipeline_name=row["pipeline_name"]).first()
        if existing:
            return existing
        party_row = base["party"][row["transporter_id"]]
        party = Party.objects.filter(party_name=party_row["party_name"], party_type=party_row["party_type"]).first()
        if party is None:
            party = Party.objects.create(party_name=party_row["party_name"], party_type=party_row["party_type"])
        return Pipeline.objects.create(pipeline_name=row["pipeline_name"], transporter=party)

    with transaction.atomic():
        for route in inactive:
            route.is_active = True
            route.save(update_fields=["is_active"])
        for row in missing:
            route = Route.objects.create(
                source_location=location(row["source_location_id"]),
                destination_location=location(row["destination_location_id"]),
                path_code_id=row.get("path_code_id"),
                zone=row.get("zone"),
                source_reference=row["source_reference"],
                is_active=True,
            )
            for step in sorted(steps_by_route[row["id"]], key=lambda s: int(s["sequence_no"])):
                RouteStep.objects.create(
                    route=route,
                    sequence_no=int(step["sequence_no"]),
                    from_location=location(step["from_location_id"]),
                    to_location=location(step["to_location_id"]),
                    pipeline=pipeline(step["pipeline_id"]),
                )


main()
