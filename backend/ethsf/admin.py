from django.contrib import admin

from .models import Puzzle


@admin.register(Puzzle)
class BackendAdmin(admin.ModelAdmin):
    pass
    # list_display = [field.name for field in
    #                 Puzzle._meta.get_fields()]