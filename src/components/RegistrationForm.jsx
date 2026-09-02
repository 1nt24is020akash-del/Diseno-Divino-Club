import { useState } from 'react'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  year: '',
  message: '',
}

const validators = {
  fullName: (value) => value.trim().length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,}$/.test(value.trim()),
  year: (value) => value.trim().length > 0,
}

export default function RegistrationForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    Object.entries(validators).forEach(([field, validator]) => {
      if (!validator(form[field])) {
        nextErrors[field] = {
          fullName: 'Please enter your full name.',
          email: 'Please enter a valid college email address.',
          phone: 'Please enter a valid phone number.',
          year: 'Please select your year or semester.',
        }[field]
      }
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          <span>Full Name</span>
          <input name="fullName" value={form.fullName} onChange={handleChange} className={errors.fullName ? 'has-error' : ''} />
          {errors.fullName && <small>{errors.fullName}</small>}
        </label>

        <label>
          <span>College Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} className={errors.email ? 'has-error' : ''} />
          {errors.email && <small>{errors.email}</small>}
        </label>

        <label>
          <span>Phone Number</span>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={errors.phone ? 'has-error' : ''} />
          {errors.phone && <small>{errors.phone}</small>}
        </label>

        <label>
          <span>Year / Semester</span>
          <select name="year" value={form.year} onChange={handleChange} className={errors.year ? 'has-error' : ''}>
            <option value="">Select</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
          </select>
          {errors.year && <small>{errors.year}</small>}
        </label>
      </div>

      <label>
        <span>Message / Why do you want to join?</span>
        <textarea name="message" rows="4" value={form.message} onChange={handleChange} placeholder="I’m excited to join because..." />
      </label>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-button">Register</button>
      </div>
    </form>
  )
}
