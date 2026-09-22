from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction


class Command(BaseCommand):
    help = 'Create a new admin superuser for the Dr. Vivek Shetty appointment system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='admin',
            help='Username for the admin user (default: admin)'
        )
        parser.add_argument(
            '--email',
            type=str,
            default='admin@techy.zapto.org',
            help='Email for the admin user (default: admin@techy.zapto.org)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin123',
            help='Password for the admin user (default: admin123)'
        )
        parser.add_argument(
            '--first-name',
            type=str,
            default='Admin',
            help='First name for the admin user (default: Admin)'
        )
        parser.add_argument(
            '--last-name',
            type=str,
            default='User',
            help='Last name for the admin user (default: User)'
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']

        try:
            with transaction.atomic():
                # Check if user already exists
                if User.objects.filter(username=username).exists():
                    self.stdout.write(
                        self.style.WARNING(f'User with username "{username}" already exists.')
                    )
                    return

                # Create the superuser
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    is_staff=True,
                    is_superuser=True,
                    is_active=True
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully created admin user:\n'
                        f'  Username: {username}\n'
                        f'  Email: {email}\n'
                        f'  Password: {password}\n'
                        f'  Name: {first_name} {last_name}\n'
                        f'  Is Staff: {user.is_staff}\n'
                        f'  Is Superuser: {user.is_superuser}\n'
                        f'  Is Active: {user.is_active}'
                    )
                )

                self.stdout.write(
                    self.style.WARNING(
                        '\n⚠️  IMPORTANT SECURITY NOTES:\n'
                        '1. Change the default password immediately after first login\n'
                        '2. Use a strong, unique password for production\n'
                        '3. Consider using environment variables for sensitive data\n'
                        '4. Regularly rotate admin credentials'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating admin user: {str(e)}')
            )
            raise
