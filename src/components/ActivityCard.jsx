import { getActivityStatus } from '../utils/storage'
import CapacityMeter from './CapacityMeter'

export default function ActivityCard({ activity, registeredCount, onViewDetails, onToggleInterest, onRegister, isInterested, isRegistered }) {
  const currentRegisteredCount = registeredCount ?? activity.registeredCount
  const status = getActivityStatus({ ...activity, registeredCount: currentRegisteredCount })

  const handleTilt = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 12
    const rotateX = (0.5 - y) * 12
    event.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
  }

  const resetTilt = (event) => {
    event.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <article
      className="activity-card"
      aria-label={activity.title}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
    >
      <div className="card-visual" style={{ '--card-from': activity.image.from, '--card-to': activity.image.to }}>
        <img src={activity.image.src} alt="" loading="lazy" />
        <span>{activity.title}</span>
      </div>
      <div className="card-body">
        <div className="card-topline">
          <span className="badge category-badge">{activity.category}</span>
          <span className={`badge status-badge ${status.toLowerCase().replace(/\s+/g, '-')}`}>
            {status}
          </span>
        </div>
        <h3>{activity.title}</h3>
        <div className="meta-row">
          <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>{activity.time}</span>
        </div>
        <div className="meta-row">
          <span>{activity.location}</span>
        </div>
        <p>{activity.shortDescription}</p>
        <CapacityMeter capacity={activity.capacity} registeredCount={registeredCount} />
        <div className="card-footer">
          <div className="card-actions">
            <button type="button" className="text-button" onClick={() => onToggleInterest(activity.id)}>
              {isInterested ? 'Interested ✓' : 'Interested'}
            </button>
            {activity.isHackathon && <button type="button" className="secondary-button small" onClick={() => onRegister(activity)}>{isRegistered ? 'Registered Team' : 'Register Team'}</button>}
            <button type="button" className="primary-button small" onClick={() => onViewDetails(activity)}>
              {isRegistered ? 'View Details' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
