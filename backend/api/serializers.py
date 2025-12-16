from rest_framework import serializers
from .models import SensorData, PumpControl


class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['id', 'moisture', 'pump', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class PumpControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpControl
        fields = ['id', 'pump_status', 'override', 'override_until']
        read_only_fields = ['id']
