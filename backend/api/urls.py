from django.urls import path
from .views import upload_sensor_data, get_latest_sensor, pump_control

urlpatterns = [
    # Sensor data endpoints
    path('upload/', upload_sensor_data, name='upload-sensor-data'),
    path('latest/', get_latest_sensor, name='get-latest-sensor'),
    
    # Pump control endpoint
    path('pump/', pump_control, name='pump-control'),
]
