import { useState } from 'react'
import BranchSelect from './BranchSelect'
import CollegeSelect from './CollegeSelect'

const emptyMember = () => ({ name: '', email: '', phone: '', usn: '', collegeName: '', branch: '' })
const initialForm = (user) => ({ teamName: '', leaderName: user?.name || '', leaderEmail: user?.email || '', leaderPhone: '', collegeName: user?.collegeName || '', usn: user?.usn || '', branch: user?.branch || '', members: [] })

function Field({ label, name, value, onChange, type = 'text', required = true }) {
  return <label><span>{label}{required ? ' *' : ''}</span><input name={name} type={type} value={value} onChange={onChange} required={required} /></label>
}

export default function TeamRegistrationModal({ hackathon, user, onClose, onRegistered }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => initialForm(user))
  const [errors, setErrors] = useState([])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const updateMember = (index, field, value) => setForm((current) => ({ ...current, members: current.members.map((member, memberIndex) => memberIndex === index ? { ...member, [field]: value } : member) }))
  const validate = (includeMembers = false) => {
    const required = [form.teamName, form.leaderName, form.leaderEmail, form.leaderPhone, form.collegeName, form.usn, form.branch]
    const next = required.some((value) => !value.trim()) ? ['Complete all team leader fields.'] : []
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.leaderEmail)) next.push('Enter a valid leader email.')
    if (includeMembers && form.members.length < 1) next.push('Add at least one additional member.')
    if (includeMembers) {
      const members = [{ usn: form.usn, email: form.leaderEmail }, ...form.members]
      if (form.members.some((member) => !member.name.trim() || !member.email.trim() || !member.phone.trim() || !member.usn.trim() || !member.collegeName.trim() || !member.branch)) next.push('Complete every team member field.')
      if (form.members.some((member) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email))) next.push('Enter valid email addresses for every member.')
      if (form.members.some((member) => !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,}$/.test(member.phone.trim()))) next.push('Enter valid phone numbers for every member.')
      if (new Set(members.map((member) => member.usn.toUpperCase())).size !== members.length) next.push('Team USN numbers must be unique.')
      if (new Set(members.map((member) => member.email.toLowerCase())).size !== members.length) next.push('Team email addresses must be unique.')
    }
    setErrors(next)
    return !next.length
  }

  const addMember = () => { if (form.members.length < 4) setForm((current) => ({ ...current, members: [...current.members, emptyMember()] })) }
  const removeMember = (index) => setForm((current) => ({ ...current, members: current.members.filter((_, memberIndex) => memberIndex !== index) }))

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="team-registration-title">
      <div className="modal-card team-modal">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close team registration">×</button>
        <span className="eyebrow">Hackathon team registration</span>
        <h3 id="team-registration-title">{hackathon.title}</h3>
        <div className="team-steps"><span className={step >= 1 ? 'active' : ''}>01 Team</span><span className={step >= 2 ? 'active' : ''}>02 Members</span><span className={step >= 3 ? 'active' : ''}>03 Review</span></div>
        {step === 1 && <form className="auth-form" onSubmit={(event) => { event.preventDefault(); if (validate()) setStep(2) }}>
          <Field label="Team Name" name="teamName" value={form.teamName} onChange={update} />
          <Field label="Team Leader Name" name="leaderName" value={form.leaderName} onChange={update} />
          <Field label="Team Leader Email" name="leaderEmail" value={form.leaderEmail} onChange={update} type="email" />
          <Field label="Team Leader Phone" name="leaderPhone" value={form.leaderPhone} onChange={update} type="tel" />
          <label><span>College Name *</span><CollegeSelect value={form.collegeName} onChange={(value) => setForm((current) => ({ ...current, collegeName: value }))} /></label>
          <Field label="USN" name="usn" value={form.usn} onChange={update} />
          <label><span>Branch *</span><BranchSelect value={form.branch} onChange={(value) => setForm((current) => ({ ...current, branch: value }))} /></label>
          {errors.map((error) => <p className="auth-error" key={error}>{error}</p>)}
          <button type="submit" className="primary-button">Continue to Members</button>
        </form>}
        {step === 2 && <div className="team-member-stage"><div className="team-counter">Team Members: {form.members.length + 1} / 5 <span>{'● '.repeat(form.members.length + 1)}{'○ '.repeat(4 - form.members.length)}</span></div>{form.members.map((member, index) => <div className="member-form" key={index}><div className="member-heading"><strong>Member {index + 2}</strong><button type="button" className="text-button" onClick={() => removeMember(index)}>Remove Member</button></div><Field label="Full Name" name="name" value={member.name} onChange={(event) => updateMember(index, 'name', event.target.value)} /><Field label="Email Address" name="email" value={member.email} onChange={(event) => updateMember(index, 'email', event.target.value)} type="email" /><Field label="Phone Number" name="phone" value={member.phone} onChange={(event) => updateMember(index, 'phone', event.target.value)} type="tel" /><Field label="USN" name="usn" value={member.usn} onChange={(event) => updateMember(index, 'usn', event.target.value.toUpperCase())} /><label><span>College Name *</span><CollegeSelect value={member.collegeName} onChange={(value) => updateMember(index, 'collegeName', value)} /></label><label><span>Branch *</span><BranchSelect value={member.branch} onChange={(value) => updateMember(index, 'branch', value)} /></label></div>)}{form.members.length < 4 && <button type="button" className="secondary-button" onClick={addMember}>+ Add Team Member</button>}{form.members.length === 4 && <p className="muted">Maximum team size of 5 members reached.</p>}{errors.map((error) => <p className="auth-error" key={error}>{error}</p>)}<div className="form-actions modal-actions"><button type="button" className="secondary-button" onClick={() => setStep(1)}>Back</button><button type="button" className="primary-button" onClick={() => validate(true) && setStep(3)}>Review Team</button></div></div>}
        {step === 3 && <div className="team-review"><h4>Team Registration Review</h4><p><strong>Team:</strong> {form.teamName}</p><p><strong>Hackathon:</strong> {hackathon.title}</p><h4>Team Leader</h4><p>{form.leaderName} · {form.usn} · {form.branch}<br />{form.collegeName} · {form.leaderEmail} · {form.leaderPhone}</p><h4>Team Members</h4>{form.members.map((member, index) => <p key={index}><strong>Member {index + 2}:</strong> {member.name} · {member.usn} · {member.branch}<br />{member.collegeName} · {member.email} · {member.phone}</p>)}<p className="team-total">Total Members: {form.members.length + 1} / 5</p><div className="form-actions modal-actions"><button type="button" className="secondary-button" onClick={() => setStep(2)}>Back</button><button type="button" className="primary-button" onClick={() => onRegistered({ ...form, members: [{ name: form.leaderName, email: form.leaderEmail, phone: form.leaderPhone, usn: form.usn, collegeName: form.collegeName, branch: form.branch }, ...form.members] })}>Confirm Team Registration</button></div></div>}
      </div>
    </div>
  )
}
