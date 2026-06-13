import React, { useState, useEffect } from 'react'
import './DigitalClock.css'

function DigitalClock() {
  const [times, setTimes] = useState({})

  const timezones = [
    { name: 'Islamabad', zone: 'Asia/Karachi' },
    { name: 'New York', zone: 'America/New_York' },
    { name: 'London', zone: 'Europe/London' },
    { name: 'Tokyo', zone: 'Asia/Tokyo' },
    { name: 'Dubai', zone: 'Asia/Dubai' },
    { name: 'Sydney', zone: 'Australia/Sydney' },
  ]

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {}
      timezones.forEach((tz) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: tz.zone,
        })
        newTimes[tz.name] = formatter.format(new Date())
      })
      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="digital-clock-container">
      <h2>Current Time - Multiple Timezones</h2>
      <div className="clocks-grid">
        {timezones.map((tz) => (
          <div key={tz.name} className="clock-card">
            <h3>{tz.name}</h3>
            <div className="clock-display">{times[tz.name] || '--:--:--'}</div>
            <p className="timezone-info">{tz.zone}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DigitalClock
