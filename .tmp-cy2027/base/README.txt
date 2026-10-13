Edit config.env (user / password), then run run.bat (Windows) or python3 run.py (Linux).

This wipes public tables and loads app rows in foreign-key order (parents first). It does not disable FK checks. Django auth/session tables stay empty. Do not run on production.
