import { useState } from 'react'
import BranchSelect from './BranchSelect'
import CollegeSelect from './CollegeSelect'

export default function RegistrationDetailsModal({ activity, user, initialDetails, onClose, onContinue }) {
  const [form, setForm] = useState({
    collegeName: initialDetails?.collegeName || user.collegeName || '',
    usn: initialDetails?.usn || user.usn || '',
    branch: initialDetails?.branch || user.branch || '',
  })
  const [errors, setErrors] = useState({})

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: name === 'usn' ? value.replace(/\s+/g, '').toUpperCase() : value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.collegeName.trim()) nextErrors.collegeName = 'Enter your college name.'
    if (!/^[A-Z0-9][A-Z0-9/-]{3,19}$/.test(form.usn)) nextErrors.usn = 'Enter a valid USN using 4-20 letters, numbers, /, or -.'
    if (!form.branch) nextErrors.branch = 'Choose your branch.'
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) onContinue({ ...form, collegeName: form.collegeName.trim() })
  }

  return (
    <div className="modal-backdrop auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="registration-details-title">
      <div className="modal-card registration-details-card">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close registration details">×</button>
        <span className="eyebrow">Complete your registration</span>
        <h3 id="registration-details-title">Academic details</h3>
        <p className="registration-details-subtitle">Please provide your academic details to register for {activity.title}.</p>
        <form className="auth-form" onSubmit={submit}>
          <label><span>College Name *</span><CollegeSelect value={form.collegeName} onChange={(value) => { setForm((current) => ({ ...current, collegeName: value })); setErrors((current) => ({ ...current, collegeName: '' })) }} hasError={Boolean(errors.collegeName)} /></label>
          {errors.collegeName && <p className="auth-error">{errors.collegeName}</p>}
          <label><span>University Seat Number (USN) *</span><input name="usn" value={form.usn} onChange={update} placeholder="Enter your USN" autoComplete="off" /></label>
          {errors.usn && <p className="auth-error">{errors.usn}</p>}
          <label><span>Branch *</span><BranchSelect value={form.branch} onChange={(value) => { setForm((current) => ({ ...current, branch: value })); setErrors((current) => ({ ...current, branch: '' })) }} hasError={Boolean(errors.branch)} /></label>
          {errors.branch && <p className="auth-error">{errors.branch}</p>}
          <div className="form-actions modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Back</button>
            <button type="submit" className="primary-button">Review Registration</button>
          </div>
        </form>
      </div>
    </div>
  )
}
