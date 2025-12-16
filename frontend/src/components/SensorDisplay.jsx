import React from 'react'

export default function SensorDisplay({ moisture, timestamp, isLoading, error }) {
  const getMoistureColor = (moisture) => {
    if (moisture < 30) return '#ff6b6b' // Red - too dry
    if (moisture < 50) return '#ffd43b' // Yellow - moderate
    if (moisture < 70) return '#51cf66' // Green - optimal
    return '#0099ff' // Blue - wet
  }

  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return 'Very Dry'
    if (moisture < 50) return 'Moderate'
    if (moisture < 70) return 'Optimal'
    return 'Wet'
  }

  return (
    <div className="sensor-card">
      <h3>Soil Moisture</h3>
      
      {error ? (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      ) : isLoading || moisture === null ? (
        <div className="loading">
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <div className="moisture-gauge">
            <svg width="150" height="150" viewBox="0 0 150 150">
              {/* Background circle */}
              <circle
                cx="75"
                cy="75"
                r="70"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="75"
                cy="75"
                r="70"
                fill="none"
                stroke={getMoistureColor(moisture)}
                strokeWidth="8"
                strokeDasharray={`${(moisture / 100) * 439} 439`}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '75px 75px' }}
              />
              {/* Text */}
              <text
                x="75"
                y="75"
                textAnchor="middle"
                dy="0.3em"
                fontSize="32"
                fontWeight="bold"
                fill={getMoistureColor(moisture)}
              >
                {moisture.toFixed(1)}%
              </text>
            </svg>
          </div>

          <div className="status-text">
            <p className="status-label">{getMoistureStatus(moisture)}</p>
            {timestamp && (
              <p className="timestamp">
                Updated: {new Date(timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </>
      )}

      <style>{`
        .sensor-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        .sensor-card h3 {
          color: #333;
          margin-bottom: 25px;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .moisture-gauge {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .error-message {
          background: #ffe0e0;
          color: #d32f2f;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: 500;
        }

        .loading {
          padding: 40px 20px;
          color: #999;
          font-size: 16px;
        }

        .status-text {
          margin-top: 15px;
        }

        .status-label {
          font-size: 16px;
          color: #666;
          margin-bottom: 8px;
        }

        .timestamp {
          font-size: 12px;
          color: #999;
        }
      `}</style>
    </div>
  )
}
