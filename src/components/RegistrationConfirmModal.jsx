import { useMemo, useState } from 'react'

export default function RegistrationConfirmModal({ activity, user, registrationDetails, registeredCount, alreadyRegistered, onClose, onConfirm, onViewActivities }) {
  const [error, setError] = useState(alreadyRegistered ? 'You are already registered for this event.' : '')
  const available = useMemo(() => Math.max(activity.capacity - registeredCount, 0), [activity.capacity, registeredCount])
  const full = available === 0

  const confirm = () => {
    if (alreadyRegistered) {
      setError('You are already registered for this event.')
      return
    }
    if (full) {
      setError('This event is currently full.')
      return
    }
    onConfirm()
  }

  return (
    <div className="modal-backdrop auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-registration-title">
      <div className="modal-card registration-confirm-card">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close registration confirmation">×</button>
        <span className="eyebrow">Registration checkpoint</span>
        <h3 id="confirm-registration-title">{full ? 'Event at capacity' : 'Confirm your spot'}</h3>
        <div className="confirm-event-summary">
          <strong>{activity.title}</strong>
          <span>{new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>{activity.time} · {activity.location}</span>
        </div>
        <div className="confirm-capacity"><span>Available spots</span><strong>{available} / {activity.capacity}</strong></div>
        {user && <div className="registered-as"><span>Registering as</span><strong>{user.name}</strong><small>{user.email}</small></div>}
        {registrationDetails && <div className="registered-as"><span>Academic details</span><strong>{registrationDetails.collegeName}</strong><small>{registrationDetails.usn} · {registrationDetails.branch}</small></div>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <div className="form-actions modal-actions">
          {alreadyRegistered ? <button type="button" className="secondary-button" onClick={onViewActivities}>View My Activities</button> : <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>}
          {!alreadyRegistered && <button type="button" className="primary-button" onClick={confirm} disabled={full}>{full ? 'Join Waitlist' : 'Confirm Registration'}</button>}
        </div>
      </div>
    </div>
  )
}
