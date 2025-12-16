import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Sensor Data API
export const fetchLatestSensor = async () => {
  try {
    const response = await apiClient.get('/latest/')
    return response.data
  } catch (error) {
    console.error('Error fetching latest sensor data:', error)
    throw error
  }
}

// Pump Control API
export const fetchPumpStatus = async () => {
  try {
    const response = await apiClient.get('/pump/')
    return response.data
  } catch (error) {
    console.error('Error fetching pump status:', error)
    throw error
  }
}

export const setPumpControl = async (pumpStatus, overrideSeconds = null) => {
  try {
    const payload = {
      pump_status: pumpStatus,
    }
    
    if (overrideSeconds !== null && overrideSeconds > 0) {
      payload.override_seconds = overrideSeconds
    }
    
    const response = await apiClient.post('/pump/', payload)
    return response.data
  } catch (error) {
    console.error('Error setting pump control:', error)
    throw error
  }
}
