# Smart Irrigation Dashboard - React Frontend

A modern, responsive React dashboard for monitoring and controlling an IoT Smart Irrigation System.

## Features

- 📊 **Real-time Soil Moisture Display** - Updates every 2 seconds
- 💧 **Pump Status Indicator** - Visual ON/OFF status with animated indicator
- 🎛️ **Manual Pump Control** - Easy toggle buttons to turn pump ON/OFF
- ⏱️ **Override Duration Control** - Set temporary overrides with custom durations
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean, intuitive interface with gradient background

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The dashboard will open automatically at `http://localhost:3000`

## Building for Production

Build the optimized production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Endpoints

The dashboard expects the Django backend to be running at `http://localhost:8000/api`

### Available Endpoints

- `GET /api/latest/` - Get latest soil moisture reading
- `GET /api/pump/` - Get current pump status
- `POST /api/pump/` - Update pump control and set override

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SensorDisplay.jsx   # Moisture gauge component
│   │   └── PumpControl.jsx     # Pump control component
│   ├── api.js                  # API integration with axios
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json
└── vite.config.js              # Vite configuration
```

## API Integration

The `src/api.js` file contains all API calls:

- `fetchLatestSensor()` - Get latest sensor data
- `fetchPumpStatus()` - Get current pump status
- `setPumpControl(pumpStatus, overrideSeconds)` - Update pump control

## Usage Examples

### Fetching Sensor Data
```javascript
const data = await fetchLatestSensor()
// Returns: { id, moisture, pump, timestamp }
```

### Fetching Pump Status
```javascript
const status = await fetchPumpStatus()
// Returns: { id, pump_status, override, override_remaining }
```

### Setting Pump Override
```javascript
// Turn pump ON for 300 seconds
await setPumpControl(true, 300)

// Turn pump ON indefinitely
await setPumpControl(true)
```

## Styling

The dashboard uses inline styles for simplicity and easy customization. Main features:

- **Color Scheme**: Purple gradient background
- **Moisture Colors**:
  - Red (#ff6b6b) - Very Dry (< 30%)
  - Yellow (#ffd43b) - Moderate (30-50%)
  - Green (#51cf66) - Optimal (50-70%)
  - Blue (#0099ff) - Wet (> 70%)

## Troubleshooting

### "Failed to fetch sensor data"
- Ensure Django backend is running at `http://localhost:8000`
- Check that CORS is enabled in Django settings
- Verify the API endpoints are correct

### Port Already in Use
Change the port in `vite.config.js`:
```javascript
server: {
  port: 3001, // or any available port
}
```

## License

MIT
