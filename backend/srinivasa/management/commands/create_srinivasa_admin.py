import secrets

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from srinivasa.permissions import ADMIN_GROUP


class Command(BaseCommand):
    help = 'Create or reset a login for the Dr. Srinivasa website admin dashboard.'

    def add_arguments(self, parser):
        parser.add_argument('username')
        parser.add_argument('--email', default='')
        parser.add_argument('--password', help='Defaults to a random password that is printed once.')

    def handle(self, *args, username, email, password, **options):
        password = password or secrets.token_urlsafe(12)
        user, created = get_user_model().objects.get_or_create(username=username, defaults={'email': email})
        if email:
            user.email = email
        user.is_active = True
        user.set_password(password)
        user.save()
        user.groups.add(Group.objects.get_or_create(name=ADMIN_GROUP)[0])

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} Srinivasa admin "{username}" with password: {password}'))
