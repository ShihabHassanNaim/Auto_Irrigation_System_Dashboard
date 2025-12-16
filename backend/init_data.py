import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import SensorData, PumpControl

# Create initial sensor data
SensorData.objects.all().delete()
SensorData.objects.create(moisture=55.5, pump=False)
print("✓ Initial sensor data created")

# Create pump control
PumpControl.objects.all().delete()
PumpControl.objects.create(pump_status=False, override=False)
print("✓ Pump control initialized")
