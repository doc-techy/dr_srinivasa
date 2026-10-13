"""Prepare repeatable local master data for the CY 2027 planning demo.

The command renews the supplied pipeline capacities for the calendar-year
horizon and copies the existing local GAIL planning CT and its approved
route-step mappings.  It intentionally does not alter commercial CN terms.
"""
from datetime import date

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from transporter_contract.models import (
    CTRouteSegmentMap,
    CapacityTranche,
    Pipeline,
    PipelineConstraint,
)


PIPELINE_CAPACITIES = {
    "GAIL": 8000,
    "GAIL Demo Pipeline": 6000,
    # Existing local routes use these production-named pipelines, while the
    # supplied demo values use the corresponding demo labels.
    "PIL": 7000,
    "PIL Demo Pipeline": 7000,
    "GSPL HPLP": 8500,
    "GSPL HPLP Demo Pipeline": 8500,
    "GSPL HP": 9000,
    "KG Basin (GAIL)": 5500,
}
CT_TEMPLATE_NUMBER = "CT-GAIL-001-NY-SEED"


class Command(BaseCommand):
    help = "Seed local CY 2027 pipeline and CT demo data for next-year planning."

    def add_arguments(self, parser):
        parser.add_argument("--year", type=int, default=2027)
        parser.add_argument(
            "--ct-template",
            default=CT_TEMPLATE_NUMBER,
            help=(
                "Preferred CT number to clone. If it is not present, the command "
                "uses the first active CT that has approved route-segment mappings."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        year = options["year"]
        start, end = date(year, 1, 1), date(year, 12, 31)
        pipeline_created = 0

        for pipeline_name, capacity in PIPELINE_CAPACITIES.items():
            pipeline = Pipeline.objects.filter(pipeline_name=pipeline_name).first()
            if not pipeline:
                raise CommandError(f"Pipeline {pipeline_name!r} was not found.")
            _, created = PipelineConstraint.objects.update_or_create(
                pipeline=pipeline,
                route=None,
                start_date=start,
                end_date=end,
                defaults={
                    "max_flow": capacity,
                    "reason": f"CY {year} next-planning demo capacity",
                },
            )
            pipeline_created += int(created)

        template = CapacityTranche.objects.filter(
            ct_number=options["ct_template"]
        ).first()
        if template is None:
            # The shared UAT base dump deliberately has real dated CTs rather
            # than the local NY-SEED fixture.  A mapped active CT is a safe
            # template because this command only clones its commercial and
            # route mapping attributes into the calendar-year test booking.
            candidates = list(
                CapacityTranche.objects.filter(status="ACTIVE").order_by(
                    "ct_number"
                )
            )
            template = next(
                (
                    candidate
                    for candidate in candidates
                    if CTRouteSegmentMap.objects.filter(
                        ct=candidate, is_active=True
                    ).exists()
                ),
                None,
            )
        if not template:
            raise CommandError(
                "No active CT with approved route-segment mappings was found. "
                "Load the transporter base data before running this command."
            )

        ct_number = f"CT-GAIL-001-CY{year}-DEMO"
        ct, ct_created = CapacityTranche.objects.update_or_create(
            ct_number=ct_number,
            defaults={
                "contract": template.contract,
                "transporter": template.transporter,
                "ct_source": "AUTO",
                "ct_type": template.ct_type,
                "from_date": start,
                "to_date": end,
                "booking_date": template.booking_date,
                "mdq": template.mdq,
                "existing_imbalance": template.existing_imbalance,
                "contract_qty": template.contract_qty,
                "transporter_rule": template.transporter_rule,
                "mdr": template.mdr,
                "mor": template.mor,
                "status": "ACTIVE",
            },
        )

        mapping_created = 0
        for template_mapping in CTRouteSegmentMap.objects.filter(
            ct=template
        ).select_related("route", "step"):
            _, created = CTRouteSegmentMap.objects.update_or_create(
                ct=ct,
                route=template_mapping.route,
                step=template_mapping.step,
                effective_from=start,
                defaults={
                    "mapping_type": template_mapping.mapping_type,
                    "capacity_consumption_factor": template_mapping.capacity_consumption_factor,
                    "effective_to": end,
                    "is_active": True,
                    "approved_by": "cy-2027-demo-seed",
                    "approved_at": timezone.now(),
                },
            )
            mapping_created += int(created)

        self.stdout.write(
            self.style.SUCCESS(
                f"CY {year} demo data ready: {pipeline_created} pipeline renewal(s), "
                f"CT {ct_number} ({'created' if ct_created else 'updated'}), "
                f"{mapping_created} CT mapping(s) created."
            )
        )
