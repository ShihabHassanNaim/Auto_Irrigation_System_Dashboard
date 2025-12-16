import React, { useState, useEffect, useCallback } from 'react'
import SensorDisplay from './components/SensorDisplay'
import PumpControl from './components/PumpControl'
import { fetchLatestSensor, fetchPumpStatus, setPumpControl } from './api'

export default function App() {
  // Sensor state
  const [moisture, setMoisture] = useState(null)
  const [timestamp, setTimestamp] = useState(null)
  const [sensorLoading, setSensorLoading] = useState(false)
  const [sensorError, setSensorError] = useState(null)

  // Pump state
  const [pumpStatus, setPumpStatus] = useState(false)
  const [overrideRemaining, setOverrideRemaining] = useState(0)
  const [pumpLoading, setPumpLoading] = useState(false)
  const [pumpError, setPumpError] = useState(null)

  // Fetch latest sensor data
  const fetchSensorData = useCallback(async () => {
    setSensorLoading(true)
    setSensorError(null)
    try {
      const data = await fetchLatestSensor()
      setMoisture(data.moisture)
      setTimestamp(data.timestamp)
    } catch (error) {
      setSensorError('Failed to fetch sensor data')
      console.error(error)
    } finally {
      setSensorLoading(false)
    }
  }, [])

  // Fetch pump status
  const fetchPumpData = useCallback(async () => {
    setPumpLoading(true)
    setPumpError(null)
    try {
      const data = await fetchPumpStatus()
      setPumpStatus(data.pump_status)
      setOverrideRemaining(data.override_remaining)
    } catch (error) {
      setPumpError('Failed to fetch pump status')
      console.error(error)
    } finally {
      setPumpLoading(false)
    }
  }, [])

  // Handle pump toggle
  const handlePumpToggle = useCallback(async (newStatus) => {
    setPumpLoading(true)
    setPumpError(null)
    try {
      const data = await setPumpControl(newStatus)
      setPumpStatus(data.data.pump_status)
      setOverrideRemaining(data.data.override_remaining)
    } catch (error) {
      setPumpError('Failed to update pump control')
      console.error(error)
    } finally {
      setPumpLoading(false)
    }
  }, [])

  // Handle pump override
  const handleSetOverride = useCallback(async (newStatus, overrideSeconds) => {
    setPumpLoading(true)
    setPumpError(null)
    try {
      const data = await setPumpControl(newStatus, overrideSeconds)
      setPumpStatus(data.data.pump_status)
      setOverrideRemaining(data.data.override_remaining)
    } catch (error) {
      setPumpError('Failed to set override')
      console.error(error)
    } finally {
      setPumpLoading(false)
    }
  }, [])

  // Initial fetch on component mount
  useEffect(() => {
    fetchSensorData()
    fetchPumpData()
  }, [fetchSensorData, fetchPumpData])

  // Poll sensor data every 2 seconds
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      fetchSensorData()
    }, 2000)

    return () => clearInterval(sensorInterval)
  }, [fetchSensorData])

  // Poll pump status every 1 second (to track override countdown)
  useEffect(() => {
    const pumpInterval = setInterval(() => {
      fetchPumpData()
    }, 1000)

    return () => clearInterval(pumpInterval)
  }, [fetchPumpData])

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>🌱 Smart Irrigation Dashboard</h1>
          <p className="subtitle">Real-time soil moisture and pump control</p>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          <SensorDisplay
            moisture={moisture}
            timestamp={timestamp}
            isLoading={sensorLoading}
            error={sensorError}
          />

          <PumpControl
            pumpStatus={pumpStatus}
            overrideRemaining={overrideRemaining}
            isLoading={pumpLoading}
            error={pumpError}
            onToggle={handlePumpToggle}
            onSetOverride={handleSetOverride}
          />
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>API Connected: {sensorError || pumpError ? '❌' : '✅'}</p>
        </footer>
      </div>

      <style>{`
        .app {
          width: 100%;
          min-height: 100vh;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 50px;
        }

        .header h1 {
          font-size: 42px;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          font-weight: 700;
          letter-spacing: 1px;
        }

        .subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 300;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .header h1 {
            font-size: 32px;
          }

          .container {
            padding: 20px 15px;
          }
        }

        .footer {
          text-align: center;
          color: white;
          font-size: 14px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}
