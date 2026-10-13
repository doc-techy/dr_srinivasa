"""Run the CY2027 Next Year Planning UAT companion seed.

The shared AMNS UAT seed is destructive and owns the full public schema. This
wrapper intentionally performs no SQL truncate; it invokes the project's
idempotent Django management command against that already-seeded database.
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


HERE = Path(__file__).resolve().parent


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def is_true(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "y"}


def main() -> None:
    env_file = HERE / "config.env"
    if not env_file.is_file():
        sys.exit("Missing config.env. Copy config.env.example and set its values.")
    values = load_env(env_file)
    required = ("PROJECT_ROOT", "DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD")
    missing = [key for key in required if not values.get(key)]
    if missing:
        sys.exit("Missing config.env values: " + ", ".join(missing))

    project_root = Path(values["PROJECT_ROOT"]).expanduser().resolve()
    backend = project_root / "backend"
    manage = backend / "manage.py"
    python = backend / "venv" / "Scripts" / "python.exe"
    if not manage.is_file():
        sys.exit(f"backend/manage.py was not found under PROJECT_ROOT: {project_root}")
    if not python.is_file():
        sys.exit(f"Backend virtual environment was not found: {python}")

    child_env = os.environ.copy()
    child_env.update(values)
    child_env["APP_ENV"] = values.get("APP_ENV", "local")
    year = values.get("PLAN_YEAR", "2027")
    status = values.get("ABP_STATUS", "READY").upper()
    command = [
        str(python), str(manage), "seed_next_year_planning_uat",
        "--year", year, "--status", status, "--replace",
    ]
    if is_true(values.get("VERIFY", "true")):
        command.append("--verify")

    print("Seeding CY%s next-year planning data..." % year)
    completed = subprocess.run(command, cwd=backend, env=child_env, check=False)
    sys.exit(completed.returncode)


if __name__ == "__main__":
    main()
