from rest_framework.permissions import BasePermission

ADMIN_GROUP = 'srinivasa_admin'


def is_srinivasa_admin(user) -> bool:
    if not (user and user.is_authenticated and user.is_active):
        return False
    return user.is_superuser or user.groups.filter(name=ADMIN_GROUP).exists()


class IsSrinivasaAdmin(BasePermission):
    message = 'Dr. Srinivasa admin access required.'

    def has_permission(self, request, view):
        return is_srinivasa_admin(request.user)
