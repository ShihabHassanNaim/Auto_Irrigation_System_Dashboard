import React, { useState } from 'react'

export default function PumpControl({
  pumpStatus,
  overrideRemaining,
  isLoading,
  error,
  onToggle,
  onSetOverride,
}) {
  const [overrideDuration, setOverrideDuration] = useState('')
  const [isSettingOverride, setIsSettingOverride] = useState(false)

  const handleTogglePump = async () => {
    try {
      await onToggle(!pumpStatus)
    } catch (error) {
      console.error('Failed to toggle pump:', error)
    }
  }

  const handleSetOverride = async () => {
    const duration = parseInt(overrideDuration)
    
    if (isNaN(duration) || duration <= 0) {
      alert('Please enter a valid duration in seconds')
      return
    }

    try {
      setIsSettingOverride(true)
      await onSetOverride(!pumpStatus, duration)
      setOverrideDuration('')
    } catch (error) {
      console.error('Failed to set override:', error)
    } finally {
      setIsSettingOverride(false)
    }
  }

  const formatOverrideRemaining = (seconds) => {
    if (seconds <= 0) return 'No override'
    if (seconds === -1) return 'Indefinite override'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  return (
    <div className="pump-card">
      <h3>Pump Control</h3>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Pump Status Display */}
      <div className="pump-status">
        <div className={`status-indicator ${pumpStatus ? 'on' : 'off'}`}>
          <span className="pulse"></span>
        </div>
        <div className="status-text">
          <p className="status-value">{pumpStatus ? 'ON' : 'OFF'}</p>
          <p className="status-label">Current Status</p>
        </div>
      </div>

      {/* Override Information */}
      {overrideRemaining > 0 && (
        <div className="override-info">
          <span>⏱️ Override: {formatOverrideRemaining(overrideRemaining)}</span>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className={`pump-button ${pumpStatus ? 'turn-off' : 'turn-on'}`}
        onClick={handleTogglePump}
        disabled={isLoading || isSettingOverride}
      >
        {isLoading ? 'Updating...' : pumpStatus ? 'Turn OFF' : 'Turn ON'}
      </button>

      {/* Override Duration Input */}
      <div className="override-section">
        <label htmlFor="override-duration">Override Duration (seconds):</label>
        <input
          id="override-duration"
          type="number"
          min="1"
          max="3600"
          value={overrideDuration}
          onChange={(e) => setOverrideDuration(e.target.value)}
          placeholder="e.g., 300"
          disabled={isSettingOverride}
        />
        <button
          className="override-button"
          onClick={handleSetOverride}
          disabled={isSettingOverride || !overrideDuration}
        >
          {isSettingOverride ? 'Setting...' : 'Set Override'}
        </button>
      </div>

      <style>{`
        .pump-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .pump-card h3 {
          color: #333;
          margin-bottom: 25px;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pump-status {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 10px;
        }

        .status-indicator {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .status-indicator.on {
          background: #51cf66;
        }

        .status-indicator.off {
          background: #ff6b6b;
        }

        .pulse {
          width: 30px;
          height: 30px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        .status-text {
          flex: 1;
        }

        .status-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .status-label {
          font-size: 12px;
          color: #999;
        }

        .override-info {
          background: #fff3cd;
          color: #856404;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .pump-button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .pump-button.turn-on {
          background: #51cf66;
          color: white;
        }

        .pump-button.turn-on:hover {
          background: #37b24d;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(81, 207, 102, 0.4);
        }

        .pump-button.turn-off {
          background: #ff6b6b;
          color: white;
        }

        .pump-button.turn-off:hover {
          background: #fa5252;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .pump-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .override-section {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .override-section label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .override-section input {
          width: 100%;
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 10px;
          transition: border-color 0.3s ease;
        }

        .override-section input:focus {
          outline: none;
          border-color: #667eea;
        }

        .override-section input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .override-button {
          width: 100%;
          padding: 10px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .override-button:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .override-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #ffe0e0;
          color: #d32f2f;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}
