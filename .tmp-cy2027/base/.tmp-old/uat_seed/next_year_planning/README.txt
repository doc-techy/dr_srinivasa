CY2027 Next-Year Planning UAT Seed
==================================

Purpose
-------
This is a safe companion to the shared ``amns_uat_seed`` package. It does
NOT truncate public tables. First load the shared UAT base seed, then run this
package to add the calendar-year 2027 ABP and master-data renewals needed for
Next Year Planning.

What it loads
-------------
* Daily CY2027 ABP demand: 1,460 rows (4 demand assets x 365 days)
* Solver demand and terminal crosswalks
* CY2027 pipeline constraints:
  GAIL 8,000; GAIL Demo 6,000; PIL 7,000; PIL Demo 7,000;
  GSPL HPLP 8,500; GSPL HPLP Demo 8,500; GSPL HP 9,000;
  KG Basin (GAIL) 5,500 MMBtu/day
* A CY2027 capacity-tranche booking cloned from a mapped active UAT CT
* A three-seller planning portfolio: Shell from the shared base seed, plus
  High Sea Demo LNG Seller and Nomination Demo LNG Seller.  Each added seller
  has an active MSPA/CN relationship and CY2027's two fiscal-year quantity
  terms, so the solver produces real multi-seller cargo results.
* At least 8 annual berth slots on each terminal agreement used by an approved
  solver mapping, preventing the demo portfolio from failing purely because
  the base seed has too few berth slots.
* A READY solver-input snapshot verification (optional, enabled by default)

It does not generate recommendations or lock the ABP. Generate from the
Planning UI after a successful seed so the complete user workflow can be
tested there.

Prerequisites
-------------
1. Unzip and run the shared ``amns_uat_seed`` package first.
2. From this package, copy the supplied ``backend`` folder into the repository
   root, merging the two management-command paths. This installs the refreshed
   multi-seller seed logic without replacing any other application files.
3. Copy ``uat_seed/next_year_planning`` into the repository (or run it from
   the extracted package) and copy ``config.env.example`` to ``config.env``.
4. Set ``PROJECT_ROOT`` to the repository containing ``backend/manage.py``.
5. Set ``DB_USER`` and ``DB_PASSWORD``. Host, port, and database defaults are
   provided for the shared UAT database.
6. Ensure the backend virtual environment exists at ``backend/venv``.

Run
---
Double-click ``run.bat``. It runs the following safe, idempotent command:

    python manage.py seed_next_year_planning_uat --year 2027 --replace --verify

Only the prior ABP version whose remark is ``CY2027 next-year planning UAT
seed`` is replaced. No other year, user-uploaded ABP, or public table is
deleted.

UI test after seeding
---------------------
1. Open Planning and select 2027.
2. Confirm the UAT-CY2027 version is current and READY.
3. Review monthly, weekly, and daily demand.
4. Click Generate 53-Week Plan.
5. Confirm the Calendar-Year Visibility table contains Shell, High Sea Demo
   LNG Seller, and Nomination Demo LNG Seller.
6. Check Ideal Cargo Schedule, CT Suggestions, Validation, Cost
   Reconciliation, and domestic buy/sell/swap suggestions.
