from django.contrib import admin
from .models import ExhibitModel, ExhibitRemarksModel, ExhibitCollectionModel

admin.site.register(ExhibitModel)
admin.site.register(ExhibitRemarksModel)
admin.site.register(ExhibitCollectionModel)
