CY2027 Client-Backed Next-Year Planning UAT Seed
=================================================

Purpose
-------
This is a safe companion to the shared ``amns_uat_seed`` package. It does NOT
truncate public tables. First load the shared UAT base seed, then run this
package to load the supplied calendar-year 2027 ABP and the approved
next-year-planning validation prerequisites.

What it loads
-------------
* ``FY27_ABP_2027_Contract_Aligned_75_00_TBTU.xlsx``: 3,285 daily rows
  (9 demand assets x 365 days), covering 01-Jan-2027 to 31-Dec-2027 and
  totaling exactly 75,000,000 MMBtu / 75.00 TBTU.
* ``FY27_ABP_2027_UI_Test.xlsx``: the unchanged 1.68 TBTU client source
  profile used to derive the contract-aligned workbook.
* Solver demand and terminal crosswalks
* A CY2027 UAT shared-pipeline constraint of 240,000 MMBtu/day on every
  mapped shared pipeline leg, as approved for this test. The matching
  CY2027 capacity-tranche (CT) MDQ is also 240,000 MMBtu/day.
* Two approved physical LNG entries: Dahej (200,000 MMBtu/day, 10 annual
  cargo slots) and Hazira (240,000 MMBtu/day, 12 annual cargo slots).
  Mundra remains in master data but is intentionally excluded from this
  scenario because the imported network has no approved Mundra entry point
  or physical route. It is never substituted with Dahej.
* A three-seller validation portfolio using the supplied Equinor, Mitsui and
  PetroChina MSPA/CN identifiers, seller identities, ACQ, tolerance, parcel
  ranges, and cargo counts. Its CN end dates are extended through 31-Dec-2027
  in UAT only.
* It excludes the earlier local walkthrough-only Shell, High Sea Demo, and
  Nomination Demo CNs so their cargo commitments cannot distort this client
  portfolio.
* A READY solver-input snapshot verification (optional, enabled by default)
* A documented UAT-only domestic-buy contingency of 3.00 TBTU, used only
  when the solver identifies the 2.445 TBTU net gap between the 75.00 TBTU
  ABP and the supplied contracted LNG portfolio after terminal loss. It
  creates planning recommendations only; it is not a signed commercial offer.

It does not generate recommendations or lock the ABP. Generate from the
Planning UI after a successful seed so the complete user workflow can be
tested there.

Client data retained and validation assumptions
-----------------------------------------------
The unchanged FY27 ABP totals 1.68 TBTU. The supplied contract portfolio totals
76.30 TBTU (with a 72.86 TBTU minimum after PetroChina's DQT). The package
therefore preserves the daily/asset shape of that ABP and scales its quantities
to 75.00 TBTU. It is in the contractual band while allowing a modest loss
allowance. The derivation is reproducible with
``build_contract_aligned_abp.py``; it never changes the original workbook.

For UAT only, the seed extends the supplied CN date range through 31-Dec-2027
and writes its supplied terms to both calendar-overlapping financial years:

Seller       Annual ACQ (TBTU)  DQT/UQT  Parcel range (TBTU)
Equinor      36.00              0.00     3.00 - 3.50
Mitsui       18.60              0.00/0.05* 3.10 - 3.60
PetroChina   21.70              3.44     3.30 - 3.70

The CN date extension is labelled ``CY2027 UAT date extension`` in the
database. It must be replaced with signed 2027 CN amendments before business
use.

*Mitsui has a 0.05 TBTU UAT upward tolerance solely to preserve its supplied
six 3.10 TBTU cargos when CY2027 is apportioned across the 2028 leap-year
financial contract term. Its ACQ and parcel range remain unchanged.
The supplied terminal workbook is retained as a reference only: it has no
terminal IDs/names, has end dates of 31-Dec-1930, and mixes unspecified units.
The existing approved UAT terminal, route, CT, tariff and inventory data is
therefore used as the operational network. This is intentional and visible,
not an implicit conversion. The seed performs a physical-network preflight
for every approved terminal-route combination. A terminal with no physical
entry or route is excluded with a warning; it is never mapped to a different
terminal.

Prerequisites
-------------
1. Unzip and run the shared ``amns_uat_seed`` package first.
2. Copy the supplied ``backend`` folder into the repository root, merging the
   management-command paths and ``solver_input/services/execution.py``.
3. Copy ``uat_seed/next_year_planning`` into the repository (or run it from
   the extracted package) and copy ``config.env.example`` to ``config.env``.
4. Set ``PROJECT_ROOT`` to the repository containing ``backend/manage.py``.
5. Set ``DB_USER`` and ``DB_PASSWORD``. Host, port, and database defaults are
   provided for the shared UAT database.
6. Ensure the backend virtual environment exists at ``backend/venv``.

Run
---
First run this read-only check. It must report eight usable physical routes;
the expected Mundra exclusion is not a failure:

    python manage.py seed_cy2027_physical_transport --year 2027 --check

Double-click ``run.bat`` after the check succeeds. It runs the following safe,
idempotent command:

    python manage.py seed_client_next_year_planning_uat --year 2027 --replace --verify

Only the prior unlocked ABP version whose remark is ``CY2027 client ABP
next-year planning validation seed`` is replaced. No other year,
user-uploaded ABP, or public table is deleted. If a user has locked or edited
the seeded ABP, the command stops rather than overwriting it.

UI test after seeding
---------------------
1. Open Planning and select 2027. Confirm the physical-transport revision is current and
   READY, with 9 assets and 365 days.
2. Review daily/monthly totals. The annual demand must be 75,000,000 MMBtu
   (75.00 TBTU); 1 TBTU = 1,000,000 MMBtu.
3. Click **Generate 53-Week Plan** only after the snapshot reports READY.
   The supplied CY2027 UAT configuration has been exercised through the real
   solver and produced a ``FEASIBLE_STAGED_HEURISTIC`` result with 22 cargo
   schedules. Record the actual solver status for each new run.
4. Check that every cargo has a 2027 arrival date, a client seller name,
   a 3.00-3.70 TBTU parcel volume, a terminal, and a feasible route/CT record.
5. Check the solver result status and all validation messages. ERROR messages
   block acceptance; WARNING messages must have a documented business decision.
6. In Ideal Cargo Schedule, compare total net receipts plus opening inventory
   against the 75.00 TBTU demand and review daily inventory, berth slots, CT
   capacity and seller commitment/tolerance variance.
7. To prove change propagation, upload a new ABP version or create a revision
   after the generated version locks. Then generate again and compare the new
   snapshot/run demand and quantity results. For contract changes, amend the
   active CN through Contracts, then generate again and compare cargo count,
   parcel quantity and seller variance. Restore the signed CN dates before
   business use.

Solver runtime note
-------------------
The supplied execution service starts the annual search from a 30-day cargo
candidate grid, then refines selected cargo dates at daily grain. It gives
the refinement phase its budget to find a feasible integer schedule before
running its downstream CT/logistics checks. The default solver time budget is
600 seconds; set ``NEXT_YEAR_SOLVER_TIME_LIMIT_SECONDS`` and
``NEXT_YEAR_SOLVER_CANDIDATE_DAY_STEP`` in Django settings to tune it.
