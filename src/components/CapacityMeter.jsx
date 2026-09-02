import { useEffect, useRef, useState } from 'react'

export default function CapacityMeter({ capacity, registeredCount }) {
  const meterRef = useRef(null)
  const [hasEntered, setHasEntered] = useState(false)
  const safeCapacity = Math.max(capacity || 0, 1)
  const filled = Math.min(Math.max(registeredCount || 0, 0), safeCapacity)
  const available = Math.max(safeCapacity - filled, 0)
  const percentage = Math.round((filled / safeCapacity) * 100)

  useEffect(() => {
    const element = meterRef.current
    if (!element || hasEntered) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setHasEntered(true)
      observer.disconnect()
    }, { threshold: 0.25 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasEntered])

  return (
    <div className="capacity-meter" ref={meterRef} aria-label={`${filled} of ${safeCapacity} spots filled, ${available} spots remaining`}>
      <div className="capacity-heading">
        <span className="capacity-live"><i aria-hidden="true" /> Live capacity</span>
        <span>{filled} / {safeCapacity} filled</span>
      </div>
      <div className="capacity-track" role="progressbar" aria-valuemin="0" aria-valuemax={safeCapacity} aria-valuenow={filled}>
        <span className="capacity-fill" style={{ width: hasEntered ? `${percentage}%` : '0%' }} />
      </div>
      <div className="capacity-summary">
        <span>{available === 0 ? 'Full' : `${available} spots remaining`}</span>
        <span>{percentage}% occupied</span>
      </div>
    </div>
  )
}
