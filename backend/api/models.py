from django.db import models
from django.utils import timezone


class SensorData(models.Model):
    """
    Stores soil moisture sensor readings from IoT devices.
    
    This model records real-time sensor data captured by moisture sensors
    connected to the irrigation system. Each reading includes moisture level,
    pump state at the time of reading, and a timestamp for time-series analysis.
    """
    
    # Soil moisture level (percentage: 0-100%)
    moisture = models.FloatField(
        help_text="Soil moisture level in percentage (0-100%)"
    )
    
    # Pump operational state at time of reading
    pump = models.BooleanField(
        default=False,
        help_text="Whether pump was running when this reading was taken"
    )
    
    # Automatic timestamp for sensor reading
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="Time when sensor reading was recorded"
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Sensor Data"
        indexes = [
            models.Index(fields=['-timestamp']),
        ]

    def __str__(self):
        return f"Moisture: {self.moisture}% at {self.timestamp}"


class PumpControl(models.Model):
    """
    Manages the pump control logic and status for the irrigation system.
    
    This model handles pump automation decisions including normal operation,
    manual overrides, and temporary override windows. Typically only one
    instance exists to represent the system's current pump control state.
    """
    
    # Current pump operational state
    pump_status = models.BooleanField(
        default=False,
        help_text="Whether the pump is currently ON (True) or OFF (False)"
    )
    
    # Manual override flag
    override = models.BooleanField(
        default=False,
        help_text="If True, pump is manually controlled until override_until time"
    )
    
    # Timestamp when override expires (nullable for indefinite override)
    override_until = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Override expires at this time. Null means indefinite override"
    )

    class Meta:
        verbose_name_plural = "Pump Control"

    def __str__(self):
        status = "ON" if self.pump_status else "OFF"
        return f"Pump {status} (Override: {self.override})"

    def override_remaining(self):
        """
        Calculate remaining seconds until override expires.
        
        Returns:
            int: Seconds remaining until override expires
            0: If override has expired or is not active
            -1: If override is active with no expiration time (indefinite)
        
        Example:
            >>> control = PumpControl.objects.first()
            >>> remaining = control.override_remaining()
            >>> if remaining > 0:
            ...     print(f"Override expires in {remaining} seconds")
            >>> elif remaining == -1:
            ...     print("Override is indefinite")
            >>> else:
            ...     print("Override has expired or is not active")
        """
        # If override is not active, return 0
        if not self.override:
            return 0
        
        # If override is active but has no expiration time, return -1 (indefinite)
        if self.override_until is None:
            return -1
        
        # Calculate remaining time
        now = timezone.now()
        
        # If expiration time is in the past, override has expired
        if self.override_until <= now:
            return 0
        
        # Return remaining seconds as integer
        remaining_delta = self.override_until - now
        return int(remaining_delta.total_seconds())

