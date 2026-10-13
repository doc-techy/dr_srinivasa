"""Create an idempotent CY2027 next-year-planning UAT dataset.

This command is intentionally an add-on to ``amns_uat_seed``.  The shared
seed restores the common master data; this command adds only the ABP and the
calendar-year transport renewals required to exercise the next-year workflow.
It never truncates public tables and it does not run/lock the solver plan.
"""

from datetime import date, timedelta
from decimal import Decimal

from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from demand.models import ABPPlan, ABPUploadLog, ABPVersion
from seller_contract.contract_years import contract_years_between
from seller_contract.models import (
    CN,
    CNQuantity,
    Contract,
    ContractPartyMap,
    MSPA,
    Party,
    RoleType,
    Seller,
)
from solver_input.models import SolverInputScenario, TerminalOperatorMapping
from solver_input.services.generator import generate_solver_inputs


SEED_REMARK = "CY2027 next-year planning UAT seed"
DEMAND_PROFILE = {
    "HAZIRA_PROCESS": Decimal("2000.00"),
    "HAZIRA_POWER": Decimal("600.00"),
    "KHOPOLI_PROCESS": Decimal("1200.00"),
    "KHOPOLI_POWER": Decimal("800.00"),
}
VALID_STATUSES = {"DRAFT", "IN_REVIEW", "READY"}

# Shell is supplied by the shared UAT base seed.  These two commercial chains
# complete the three-seller planning view that is used for the UI and solver
# walkthrough.  Values are deliberately in MMBtu so they exercise the input
# unit conversion used by real uploaded seller terms.
MULTI_SELLER_DEMO = (
    {
        "seller_name": "High Sea Demo LNG Seller",
        "mspa_number": "HIGH-SEA-DEMO-MSPA",
        "cn_number": "HIGH-SEA-DEMO-CN",
    },
    {
        "seller_name": "Nomination Demo LNG Seller",
        "mspa_number": "NOM-DEMO-MSPA",
        "cn_number": "NOM-DEMO-CN",
    },
)
DEMO_TERM = {
    "annual_contract_qty": Decimal("1000000"),
    "annual_contract_qty_uom": "MMBtu",
    "upward_qty_tolerance": Decimal("100000"),
    "upward_qty_tolerance_uom": "MMBtu",
    "downward_qty_tolerance": Decimal("100000"),
    "downward_qty_tolerance_uom": "MMBtu",
    "cargo_qty_min": Decimal("900000"),
    "cargo_qty_min_uom": "MMBtu",
    "cargo_qty_max": Decimal("1100000"),
    "cargo_qty_max_uom": "MMBtu",
    "cargo_count": 1,
    "uqt_exercise_timeline": "CY2027 UAT demo",
    "dqt_exercise_timeline": "CY2027 UAT demo",
}
MINIMUM_DEMO_TERMINAL_SLOTS = 8


class Command(BaseCommand):
    help = (
        "Seed CY2027 ABP and solver prerequisites after the shared UAT base seed. "
        "Does not truncate public tables or generate/lock the plan."
    )

    def add_arguments(self, parser):
        parser.add_argument("--year", type=int, default=2027)
        parser.add_argument(
            "--status",
            default="READY",
            choices=sorted(VALID_STATUSES),
            help="Initial ABP workflow status (default: READY).",
        )
        parser.add_argument(
            "--replace",
            action="store_true",
            help="Replace only a prior ABP created by this UAT seed for the selected year.",
        )
        parser.add_argument(
            "--verify",
            action="store_true",
            help="Generate a prepared solver snapshot and fail if it is not READY.",
        )

    def handle(self, *args, **options):
        year = options["year"]
        start, end = date(year, 1, 1), date(year, 12, 31)
        self._assert_commercial_prerequisites(start, end)

        with transaction.atomic():
            seeded_versions = ABPVersion.objects.filter(
                year=year, remarks=SEED_REMARK
            )
            if seeded_versions.exists():
                if not options["replace"]:
                    raise CommandError(
                        f"A CY{year} UAT ABP already exists. Re-run with --replace "
                        "to replace only this seed's version."
                    )
                # SolverInputScenario protects its uploaded ABP version. A
                # verification snapshot is disposable seed data, so remove it
                # explicitly before replacing this command's prior version.
                SolverInputScenario.objects.filter(
                    abp_version__in=seeded_versions
                ).delete()
                seeded_versions.delete()

            ABPVersion.objects.filter(year=year, is_current=True).update(
                is_current=False
            )
            version = ABPVersion.objects.create(
                version_name=f"UAT-CY{year}",
                version_type="YEARLY",
                year=year,
                uploaded_by="uat-seed",
                is_current=True,
                status=options["status"],
                remarks=SEED_REMARK,
            )
            plans = []
            plan_date = start
            while plan_date <= end:
                plans.extend(
                    ABPPlan(
                        version=version,
                        date=plan_date,
                        asset_code=asset_code,
                        quantity=quantity,
                    )
                    for asset_code, quantity in DEMAND_PROFILE.items()
                )
                plan_date += timedelta(days=1)
            ABPPlan.objects.bulk_create(plans, batch_size=1000)
            ABPUploadLog.objects.create(
                version=version,
                file_name=f"CY{year}_Next_Year_Planning_UAT_Seed.csv",
                file_size=0,
                total_records=len(plans),
                failed_records=0,
            )

        # These commands resolve business names at runtime, rather than
        # embedding environment-specific UUIDs from the UAT dump.
        call_command(
            "seed_solver_input_config",
            effective_from=start,
        )
        seller_count, cn_count, term_count, ra_count = self._seed_multi_seller_demo(
            start, end
        )
        call_command("seed_calendar_year_2027_demo", year=year)

        self.stdout.write(
            self.style.SUCCESS(
                f"CY{year} UAT ABP created: {len(DEMAND_PROFILE)} assets x "
                f"{(end - start).days + 1} days = {len(plans)} rows; "
                f"status={version.status}."
            )
        )
        self.stdout.write(
            "Transport limits, CT booking, demand/terminal crosswalks, and "
            "commercial CN prerequisites are ready. Use Planning UI to Generate."
        )
        self.stdout.write(
            self.style.SUCCESS(
                "Multi-seller UAT data ready: "
                f"{seller_count} seller(s), {cn_count} CN(s), {term_count} CY terms, "
                f"and {ra_count} terminal agreement(s) raised to at least "
                f"{MINIMUM_DEMO_TERMINAL_SLOTS} annual slots."
            )
        )

        if options["verify"]:
            snapshot = generate_solver_inputs(
                self._create_scenario_and_get_id(version, start, end),
                generated_by="uat-seed-verify",
            )
            if snapshot.status != snapshot.READY:
                issues = "; ".join(
                    snapshot.validation_issues.filter(level="ERROR")
                    .values_list("message", flat=True)
                )
                raise CommandError(f"Prepared solver snapshot is not READY: {issues}")
            self.stdout.write(self.style.SUCCESS(
                f"Prepared solver snapshot {snapshot.id} is READY (revision {snapshot.revision})."
            ))

    def _create_scenario_and_get_id(self, version, start, end):
        scenario = SolverInputScenario.objects.create(
            name=f"uat-cy{version.year}-next-{str(version.id)[:8]}",
            planning_year=version.year,
            mode="NEXT_YEAR",
            horizon_start=start,
            horizon_end=end,
            abp_version=version,
            minimum_inventory_cover_days=0,
            active=True,
        )
        return scenario.id

    def _assert_commercial_prerequisites(self, start, end):
        years = contract_years_between(start, end)
        candidates = CN.objects.filter(
            status="ACTIVE", start_date__lte=end, end_date__gte=start
        )
        for cn in candidates:
            if CNQuantity.objects.filter(cn=cn, contract_year__in=years).count() == len(years):
                return
        raise CommandError(
            "The UAT base data has no active CN with quantity terms covering "
            f"calendar year {start.year} ({', '.join(years)}). Load the shared "
            "AMNS UAT base seed before running the next-year seed."
        )

    def _seed_multi_seller_demo(self, start, end):
        """Add the two demo sellers missing from the shared UAT base seed.

        The next-year solver reads seller/CN terms, not visual-only seller
        records.  Maintaining this full contract chain makes the generated
        timeline, cargo schedule, and recommendations genuinely multi-seller.
        Only records identified by the two demo contract numbers are updated.
        """
        years = contract_years_between(start, end)
        commercial_start = date(start.year - 1, 4, 1)
        commercial_end = date(end.year + 1, 3, 31)
        with transaction.atomic():
            for spec in MULTI_SELLER_DEMO:
                party = Party.objects.filter(
                    party_name=spec["seller_name"], party_type="SELLER"
                ).first()
                if party is None:
                    party = Party.objects.create(
                        party_name=spec["seller_name"], party_type="SELLER"
                    )
                seller, _ = Seller.objects.get_or_create(
                    party=party,
                    defaults={"seller_name": spec["seller_name"], "status": "ACTIVE"},
                )
                if seller.seller_name != spec["seller_name"] or seller.status != "ACTIVE":
                    seller.seller_name = spec["seller_name"]
                    seller.status = "ACTIVE"
                    seller.save(update_fields=["seller_name", "status"])

                mspa_contract = self._demo_contract(
                    spec["mspa_number"], "MSPA", commercial_start, commercial_end
                )
                mspa, _ = MSPA.objects.update_or_create(
                    contract=mspa_contract,
                    defaults={
                        "agreement_date": commercial_start,
                        "expiry_date": commercial_end,
                        "status": "ACTIVE",
                    },
                )
                # A CN must resolve to exactly one seller.  Clean up only
                # accidental seller mappings on these named demo contracts.
                ContractPartyMap.objects.filter(
                    contract=mspa_contract, role_type=RoleType.SELLER
                ).exclude(party=party).delete()
                ContractPartyMap.objects.get_or_create(
                    contract=mspa_contract, party=party, role_type=RoleType.SELLER
                )

                cn_contract = self._demo_contract(
                    spec["cn_number"], "CN", commercial_start, commercial_end
                )
                cn, _ = CN.objects.update_or_create(
                    contract=cn_contract,
                    defaults={
                        "mspa": mspa,
                        "cn_date": commercial_start,
                        "start_date": commercial_start,
                        "end_date": commercial_end,
                        "status": "ACTIVE",
                    },
                )
                for contract_year in years:
                    CNQuantity.objects.update_or_create(
                        cn=cn,
                        contract_year=contract_year,
                        defaults=DEMO_TERM,
                    )

            ra_count = self._ensure_demo_terminal_slots()

        return len(MULTI_SELLER_DEMO), len(MULTI_SELLER_DEMO), len(MULTI_SELLER_DEMO) * len(years), ra_count

    @staticmethod
    def _demo_contract(number, contract_type, valid_from, valid_to):
        contract = Contract.objects.filter(contract_number=number).order_by("created_at").first()
        if contract is None:
            return Contract.objects.create(
                contract_number=number,
                contract_type=contract_type,
                valid_from=valid_from,
                valid_to=valid_to,
                status="ACTIVE",
            )
        changed = (
            contract.contract_type != contract_type
            or contract.valid_from != valid_from
            or contract.valid_to != valid_to
            or contract.status != "ACTIVE"
        )
        if changed:
            contract.contract_type = contract_type
            contract.valid_from = valid_from
            contract.valid_to = valid_to
            contract.status = "ACTIVE"
            contract.save(
                update_fields=["contract_type", "valid_from", "valid_to", "status", "updated_at"]
            )
        return contract

    @staticmethod
    def _ensure_demo_terminal_slots():
        """Ensure the demo's minimum cargoes do not exhaust all berth slots."""
        agreements = {}
        mappings = TerminalOperatorMapping.objects.filter(approved=True).select_related(
            "terminal_operator__ra"
        )
        for mapping in mappings:
            agreement = mapping.terminal_operator.ra
            agreements[str(agreement.pk)] = agreement
        updated = 0
        for agreement in agreements.values():
            if (agreement.annual_berthing_slots or 0) < MINIMUM_DEMO_TERMINAL_SLOTS:
                agreement.annual_berthing_slots = MINIMUM_DEMO_TERMINAL_SLOTS
                agreement.save(update_fields=["annual_berthing_slots"])
                updated += 1
        return updated
