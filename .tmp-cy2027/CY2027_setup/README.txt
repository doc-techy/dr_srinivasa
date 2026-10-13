CY2027 one-click setup
======================

Before running
--------------
The backend and frontend files from 02_cy2027_planning_overlay must already be
copied into the project (backend into backend, frontend into frontend).

Run
---
1. Copy this whole CY2027_setup folder into the project folder, the folder
   that contains backend and frontend:

       <project folder>\backend
       <project folder>\frontend
       <project folder>\CY2027_setup      <- this folder

2. Open CY2027_setup\config\db_config.env in Notepad, fill in DB_USER and
   DB_PASSWORD (no quotes, no spaces around "="), and save. On a server whose
   Python is not backend\venv, also set PYTHON_PATH (e.g. /u01/env/bin/python).

   CY2027_setup\base_seed\amns_uat_seed.zip must be present. If the database
   is missing transporter routes (error "Expected active route ... was not
   found"), the script re-creates only those routes from it after asking Y.
   It does not reset or delete anything.

3. Open a command prompt in <project folder>\CY2027_setup and run:

       python setup_cy2027.py

4. The script tests the database login first. If it says the user or
   password is wrong, fix db_config.env and run it again.
5. Check the database it shows, then type Y.

The script does the rest: puts uat_seed\next_year_planning in the project,
creates config.env, runs migrate, repairs transport mappings, checks for 8
routes, and loads the CY2027 planning data. It stops at the first problem.
It never runs the destructive base seed.

After it says SETUP COMPLETE
----------------------------
1. Build and deploy the frontend the usual way, then restart the backend service.
2. Open Planning -> CY 2027. Check 75 TBTU and snapshot READY.
3. Click Generate 53-Week Plan. Expect 22 cargo schedules.

If it stops, send the setup_log_*.txt file from the CY2027_setup folder.
