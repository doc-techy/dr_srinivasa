"""CY2027 one-click UAT setup v4 (overlay only - does NOT reset the database).

Put this folder in the project folder (the folder that contains backend and
frontend), fill in config/db_config.env, then run:  python setup_cy2027.py

Prerequisite: the backend and frontend files from 02_cy2027_planning_overlay
have already been copied into the project.
"""

import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PLAN_YEAR = "2027"
EXPECTED_ROUTES = 8

HERE = Path(__file__).resolve().parent
DB_CONFIG_FILE = HERE / "config" / "db_config.env"
DB_KEYS = ("DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD")
SEED_CANDIDATES = [
    HERE / "uat_seed" / "next_year_planning",
    HERE.parent / "02_cy2027_planning_overlay" / "uat_seed" / "next_year_planning",
]
RESTORE_SCRIPT = HERE / "tools" / "restore_transport_routes.py"
BASE_SEED_CANDIDATES = [
    HERE / "base_seed" / "amns_uat_seed.zip",
    HERE / "base_seed" / "amns_app_data.sql",
    HERE.parent / "01_base_amns_uat_seed" / "amns_uat_seed.zip",
    HERE.parent / "CY2027_Verified_Next_Year_Seed" / "01_base_amns_uat_seed" / "amns_uat_seed.zip",
]
REQUIRED_FILES = [
    "backend/planning/management/commands/seed_client_next_year_planning_uat.py",
    "backend/solver_input/management/commands/seed_cy2027_physical_transport.py",
    "backend/transporter_contract/management/commands/repair_transport_master_mappings.py",
]
LOG_FILE = HERE / f"setup_log_{datetime.now():%Y%m%d_%H%M%S}.txt"
_log = open(LOG_FILE, "w", encoding="utf-8")


def say(text=""):
    print(text, flush=True)
    _log.write(text + "\n")
    _log.flush()


def step(title):
    say()
    say(f"=== {title} ===")


def stop(message):
    say()
    say(f"SETUP STOPPED: {message}")
    say(f"Nothing after this step was run. Log file: {LOG_FILE}")
    finish(1)


def finish(code):
    _log.close()
    if os.name == "nt":
        input("\nPress Enter to close...")
    sys.exit(code)


def ask(prompt):
    value = input(prompt + ": ").strip().strip('"')
    _log.write(f"{prompt}: {value}\n")
    return value


def manage(title, python, backend, env, *arguments):
    """Run one manage.py command, show its output live, and return that output."""
    step(title)
    process = subprocess.Popen(
        [str(python), "manage.py", *arguments],
        cwd=backend, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, encoding="utf-8", errors="replace",
    )
    lines = []
    for line in process.stdout:
        line = line.rstrip()
        lines.append(line)
        say(line)
    if process.wait() != 0:
        if "password authentication failed" in "\n".join(lines):
            stop(f"{title} failed: wrong database user or password. "
                 f"Fix DB_USER / DB_PASSWORD in {DB_CONFIG_FILE} and run again.")
        stop(f"{title} failed (exit code {process.returncode}). See the messages above.")
    return "\n".join(lines)


def load_db_config():
    if not DB_CONFIG_FILE.is_file():
        stop(f"Config file not found: {DB_CONFIG_FILE}")
    values = {}
    # utf-8-sig drops the BOM Notepad adds, which would otherwise corrupt the first key.
    for raw in DB_CONFIG_FILE.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key.strip()] = value
    missing = [key for key in DB_KEYS if not values.get(key)]
    if missing:
        stop(f"Fill in {', '.join(missing)} in {DB_CONFIG_FILE} and run again.")
    return values


def find_project_root(configured=""):
    root = configured
    if not root:
        for folder in (HERE, HERE.parent, HERE.parent.parent):
            if (folder / "backend" / "manage.py").is_file():
                root = str(folder)
                break
    while not root or not (Path(root) / "backend" / "manage.py").is_file():
        if root:
            say(f"backend/manage.py was not found in: {root}")
        root = ask("Paste the project folder path (the folder that contains backend and frontend)")
    return Path(root).resolve()


def restore_transport_routes(db, python, backend, env):
    """Re-create base-seed transporter routes that step 8 needs, if they are missing."""
    configured = db.get("BASE_SEED_FILE", "")
    candidates = [Path(configured)] if configured else BASE_SEED_CANDIDATES
    source = next((c for c in candidates if c.is_file()), None)
    if source is None:
        stop("Base seed not found. Copy 01_base_amns_uat_seed/amns_uat_seed.zip into "
             f"{HERE / 'base_seed'} (or set BASE_SEED_FILE in {DB_CONFIG_FILE}).")
    say(f"Base seed: {source}")
    code = (f"exec(compile(open(r'{RESTORE_SCRIPT}').read(), r'{RESTORE_SCRIPT}', 'exec'), "
            "{'__name__': '__restore__'})")
    restore_env = dict(env, RESTORE_SQL_SOURCE=str(source), RESTORE_MODE="apply", PYTHONUNBUFFERED="1")
    output = manage("8/9 Transporter routes - restore missing ones", python, backend, restore_env,
                    "shell", "-c", code)
    if "RESTORE ROW13 OK" not in output:
        stop("Route 'Party Details/Transporter/row-13' is still missing after the restore. "
             "Send the log file to the package owner.")


def main():
    say("CY2027 setup v4")
    step("1/9 Finding the uat_seed folder")
    seed_source = next((c for c in SEED_CANDIDATES if (c / "source").is_dir()), None)
    if seed_source is None:
        stop(f"uat_seed/next_year_planning not found next to this script ({HERE}). "
             "Extract the whole zip (setup_cy2027.py and the uat_seed folder) into the project folder.")
    say(f"Seed data: {seed_source}")

    step("2/9 Reading database details and finding the project folder")
    db = load_db_config()
    say(f"Config file: {DB_CONFIG_FILE}")
    project = find_project_root(db.get("PROJECT_ROOT", ""))
    backend = project / "backend"
    say(f"Project: {project}")

    step("3/9 Checking the copied backend/frontend files")
    for relative in REQUIRED_FILES:
        if not (project / relative).is_file():
            stop(f"Missing {relative}. Copy the contents of 02_cy2027_planning_overlay/backend "
                 "into the project's backend folder first.")
    generator = backend / "solver_input" / "services" / "generator.py"
    if "_next_year_planning_terminal_mappings" not in generator.read_text(encoding="utf-8", errors="replace"):
        stop("backend/solver_input/services/generator.py is still the old version. "
             "Copy the overlay backend files again and choose 'Replace'.")
    generate_page = project / "frontend" / "src" / "pages" / "ABPPlanning" / "GeneratePlanReview.jsx"
    if not generate_page.is_file() or "horizonWeeks" not in generate_page.read_text(encoding="utf-8", errors="replace"):
        say("WARNING: frontend files look old. Copy 02_cy2027_planning_overlay/frontend "
            "into the project's frontend folder.")
    say("Overlay backend files are in place.")

    python = Path(db.get("PYTHON_PATH") or
                  backend / "venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python"))
    if not python.is_file():
        stop(f"Backend Python not found at {python}. Set PYTHON_PATH in {DB_CONFIG_FILE}.")

    step("4/9 UAT database details (from config/db_config.env)")
    say(f"Host: {db['DB_HOST']}  Port: {db['DB_PORT']}  Database: {db['DB_NAME']}")
    say(f"User: {db['DB_USER']}  Password: {len(db['DB_PASSWORD'])} characters")

    step("5/9 Placing uat_seed/next_year_planning in the project")
    seed_target = project / "uat_seed" / "next_year_planning"
    if seed_source.resolve() != seed_target.resolve():
        shutil.copytree(seed_source, seed_target, dirs_exist_ok=True)
    (seed_target / "config.env").write_text("\n".join([
        f"PROJECT_ROOT={project}",
        *(f"{key}={db[key]}" for key in DB_KEYS),
        f"DB_SSLMODE={db.get('DB_SSLMODE') or 'prefer'}",
        "APP_ENV=local",
        f"PLAN_YEAR={PLAN_YEAR}",
        "ABP_STATUS=READY",
        "VERIFY=true",
    ]) + "\n", encoding="utf-8")
    say(f"Seed folder ready at {seed_target} (config.env created).")

    # Every command below uses these values, the same way run.py does.
    # DATABASE_URL is blanked so a value in backend/.env cannot override DB_*.
    env = os.environ.copy()
    env.update({key: db[key] for key in DB_KEYS}, APP_ENV="local", DATABASE_URL="")

    output = manage(
        "6/9 Checking the database login", python, backend, env,
        "shell", "-c",
        "from django.conf import settings as s; from django.db import connection; "
        "d = s.DATABASES['default']; "
        "print('TARGET', d.get('HOST'), d.get('PORT'), d.get('NAME'), 'as', d.get('USER')); "
        "connection.ensure_connection(); print('LOGIN OK')",
    )
    if "LOGIN OK" not in output:
        stop(f"Could not log in to the database. Check DB_USER and DB_PASSWORD in {DB_CONFIG_FILE}.")
    target = next((line[len("TARGET "):] for line in output.splitlines() if line.startswith("TARGET ")), "unknown")
    say()
    say(f"The next steps will write to: {target}")
    if not ask("Continue? Type Y and press Enter").lower().startswith("y"):
        stop("Cancelled by user.")

    manage("7/9 Applying database migrations", python, backend, env, "migrate", "--noinput")

    restore_transport_routes(db, python, backend, env)

    manage("8/9 Transport repair - preview", python, backend, env,
           "repair_transport_master_mappings", "--check")
    manage("8/9 Transport repair - apply", python, backend, env,
           "repair_transport_master_mappings", "--apply")
    output = manage(f"8/9 Checking CY{PLAN_YEAR} physical routes", python, backend, env,
                    "seed_cy2027_physical_transport", "--year", PLAN_YEAR, "--check")
    match = re.search(r"valid for (\d+) route", output)
    if not match or int(match.group(1)) != EXPECTED_ROUTES:
        stop(f"Expected {EXPECTED_ROUTES} usable routes. Send the log file to the package owner.")
    say(f"{EXPECTED_ROUTES} usable routes found (Mundra being excluded is expected).")

    manage(f"9/9 Loading CY{PLAN_YEAR} planning data", python, backend, env,
           "seed_client_next_year_planning_uat", "--year", PLAN_YEAR,
           "--status", "READY", "--replace", "--verify")

    say()
    say("SETUP COMPLETE")
    say("Next:")
    say("  1. Build and deploy the frontend the usual way, then restart the backend service.")
    say(f"  2. Open Planning -> CY {PLAN_YEAR}. Check 75 TBTU (75,000,000 MMBtu) and snapshot READY.")
    say("  3. Click Generate 53-Week Plan. Expect 22 cargo schedules.")
    say(f"Log file: {LOG_FILE}")
    finish(0)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        stop("Cancelled by user.")
