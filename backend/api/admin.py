from django.contrib import admin
from .models import SensorData, PumpControl


@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'moisture', 'pump', 'timestamp')
    list_filter = ('pump', 'timestamp')
    search_fields = ('id',)
    ordering = ('-timestamp',)
    readonly_fields = ('timestamp',)


@admin.register(PumpControl)
class PumpControlAdmin(admin.ModelAdmin):
    list_display = ('id', 'pump_status', 'override', 'override_until')
    list_filter = ('pump_status', 'override')
    readonly_fields = ('id',)
