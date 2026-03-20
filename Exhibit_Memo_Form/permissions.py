from rest_framework.permissions import BasePermission

class IsOwnerOrSuperuser(BasePermission):

    def has_object_permission(self, request, view, obj):
        
        # SUPERUSER CAN ACCESS ALL EXHIBIT FORMS
        if request.user.is_superuser:
            return True
        
        # EXAMINER CAN ACCESS EXHIBIT RELATED TO HIM OR HER
        return obj.examiner == request.user
    
# ONLY SUPERUSER TO PERFORM DELETING THE EXHIBIT
class IsSuperUserOnly(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser