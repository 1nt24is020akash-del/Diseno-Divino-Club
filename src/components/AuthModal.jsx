import { useState } from 'react'
import { createEmailAccount, signInWithEmail } from '../utils/authService'

export default function AuthModal({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (mode === 'signup' && form.password !== form.confirmPassword) {
      setError('Your passwords do not match.')
      return
    }
    if (mode === 'signup' && form.password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    setLoading(true)
    try {
      const user = mode === 'signin'
        ? await signInWithEmail(form.email, form.password)
        : await createEmailAccount(form)
      onAuthenticated(user)
    } catch (authError) {
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="modal-card auth-card">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close authentication">×</button>
        <div className="auth-intro">
          <div className="auth-emblem" aria-hidden="true">✦</div>
          <span className="eyebrow">Secure student access</span>
          <h3 id="auth-title">Join the event</h3>
          <p>Sign in or create an account to register for this event.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && <label><span>Full Name</span><input name="fullName" value={form.fullName} onChange={update} required autoComplete="name" /></label>}
          <label><span>Email Address</span><input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" /></label>
          <label><span>Password</span><div className="password-field"><input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={update} required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
          {mode === 'signup' && <label><span>Confirm Password</span><input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={update} required autoComplete="new-password" /></label>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button auth-submit" disabled={loading}>{loading ? 'Connecting...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
        </form>
        {mode === 'signin' && <button type="button" className="auth-link" onClick={() => setError('Password reset needs a configured auth backend. Create a new account or contact the club team.')}>Forgot Password?</button>}
        <p className="auth-switch">{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}>{mode === 'signin' ? 'Create Account' : 'Sign In'}</button></p>
      </div>
    </div>
  )
}
