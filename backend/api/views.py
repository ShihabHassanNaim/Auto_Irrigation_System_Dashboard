from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import SensorData, PumpControl
from .serializers import SensorDataSerializer, PumpControlSerializer


@api_view(['POST'])
def upload_sensor_data(request):
    """
    POST /api/upload/
    
    ESP32 IoT device endpoint to upload soil moisture and pump status data.
    
    Request body:
    {
        "moisture": 45.5,
        "pump": true
    }
    
    Returns the created sensor reading.
    """
    serializer = SensorDataSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                'message': 'Sensor data uploaded successfully',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(
        {
            'message': 'Invalid data',
            'errors': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_latest_sensor(request):
    """
    GET /api/latest/
    
    Retrieve the latest soil moisture reading and pump state.
    
    Returns:
    {
        "id": 1,
        "moisture": 45.5,
        "pump": true,
        "timestamp": "2025-12-16T10:30:00Z"
    }
    """
    latest_data = SensorData.objects.order_by('-timestamp').first()
    
    if latest_data:
        serializer = SensorDataSerializer(latest_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(
        {'message': 'No sensor data available'},
        status=status.HTTP_404_NOT_FOUND
    )


@api_view(['GET', 'POST'])
def pump_control(request):
    """
    GET /api/pump/
    Retrieve current pump status and override information.
    
    Returns:
    {
        "id": 1,
        "pump_status": true,
        "override": false,
        "override_remaining": 0
    }
    
    POST /api/pump/
    Set manual pump control with automatic override expiration.
    
    Request body:
    {
        "pump_status": true,
        "override_seconds": 300
    }
    
    Parameters:
    - pump_status (bool): Set pump to ON (true) or OFF (false)
    - override_seconds (int): Duration in seconds for this override (optional)
                              If omitted, override is indefinite
    
    Returns the updated pump control state.
    """
    # Ensure pump control instance exists
    pump_control_obj, created = PumpControl.objects.get_or_create(pk=1)
    
    if request.method == 'GET':
        # Return current pump status with remaining override time
        serializer = PumpControlSerializer(pump_control_obj)
        response_data = serializer.data
        response_data['override_remaining'] = pump_control_obj.override_remaining()
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Update pump control with manual override
        pump_status = request.data.get('pump_status')
        override_seconds = request.data.get('override_seconds')
        
        # Validate pump_status
        if pump_status is None:
            return Response(
                {'message': 'pump_status is required', 'errors': {'pump_status': 'This field is required.'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not isinstance(pump_status, bool):
            return Response(
                {'message': 'Invalid pump_status', 'errors': {'pump_status': 'Must be a boolean (true/false).'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set pump status
        pump_control_obj.pump_status = pump_status
        pump_control_obj.override = True
        
        # Set override expiration time
        if override_seconds is not None:
            try:
                override_seconds = int(override_seconds)
                if override_seconds < 0:
                    raise ValueError
                pump_control_obj.override_until = timezone.now() + timedelta(seconds=override_seconds)
            except (ValueError, TypeError):
                return Response(
                    {'message': 'Invalid override_seconds', 'errors': {'override_seconds': 'Must be a positive integer.'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Indefinite override
            pump_control_obj.override_until = None
        
        pump_control_obj.save()
        
        # Return updated state
        serializer = PumpControlSerializer(pump_control_obj)
        response_data = serializer.data
        response_data['override_remaining'] = pump_control_obj.override_remaining()
        
        return Response(
            {
                'message': 'Pump control updated successfully',
                'data': response_data
            },
            status=status.HTTP_200_OK
        )
