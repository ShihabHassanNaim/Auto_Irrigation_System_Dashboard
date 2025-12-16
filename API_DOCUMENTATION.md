"""
IoT Smart Irrigation System - Backend API Documentation

BASE URL: http://localhost:8000/api/

ENDPOINTS:

1. SENSOR DATA ENDPOINTS:
   - GET    /api/sensors/                  - List all sensor readings (paginated)
   - POST   /api/sensors/                  - Create a new sensor reading
   - GET    /api/sensors/{id}/             - Get specific sensor reading
   - GET    /api/sensors/latest/           - Get the latest sensor reading
   - GET    /api/sensors/recent/?limit=50  - Get recent readings (specify limit)

2. PUMP CONTROL ENDPOINTS:
   - GET    /api/pump-control/             - List pump control configurations
   - POST   /api/pump-control/             - Create pump control
   - GET    /api/pump-control/current/     - Get current pump status
   - POST   /api/pump-control/toggle/      - Toggle pump on/off
   - POST   /api/pump-control/set_override/ - Set pump override

EXAMPLE REQUESTS:

POST /api/sensors/
{
    "moisture": 45.5,
    "pump": true
}

Response:
{
    "id": 1,
    "moisture": 45.5,
    "pump": true,
    "timestamp": "2025-12-16T10:30:00Z"
}

GET /api/sensors/latest/

Response:
{
    "id": 1,
    "moisture": 45.5,
    "pump": true,
    "timestamp": "2025-12-16T10:30:00Z"
}

GET /api/pump-control/current/

Response:
{
    "id": 1,
    "pump_status": true,
    "override": false,
    "override_until": null
}

POST /api/pump-control/toggle/

Response:
{
    "id": 1,
    "pump_status": false,
    "override": false,
    "override_until": null
}

POST /api/pump-control/set_override/
{
    "override": true,
    "override_until": "2025-12-16T11:30:00Z"
}

Response:
{
    "id": 1,
    "pump_status": true,
    "override": true,
    "override_until": "2025-12-16T11:30:00Z"
}
"""

# Setup Instructions:

# 1. Activate virtual environment:
#    Windows: ienv\Scripts\activate
#    Mac/Linux: source ienv/bin/activate

# 2. Install dependencies (if not already installed):
#    pip install -r requirements.txt

# 3. Run migrations:
#    python manage.py makemigrations
#    python manage.py migrate

# 4. Create superuser (for admin panel):
#    python manage.py createsuperuser

# 5. Run development server:
#    python manage.py runserver

# 6. Access the API:
#    API Browser: http://localhost:8000/api/
#    Admin Panel: http://localhost:8000/admin/
