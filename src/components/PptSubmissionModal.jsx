import { useState } from 'react'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function PptSubmissionModal({ hackathon, team, existingSubmission, onClose, onSubmitted }) {
  const [form, setForm] = useState({ projectTitle: '', problemStatement: '', proposedSolution: '', technologyStack: '' })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const chooseFile = (event) => {
    const nextFile = event.target.files?.[0]
    if (!nextFile) return
    if (!/\.(ppt|pptx|pdf)$/i.test(nextFile.name)) return setError('Accepted formats: PPT, PPTX, PDF.')
    if (nextFile.size > MAX_FILE_SIZE) return setError('Files must be 10 MB or smaller.')
    setError('')
    setFile(nextFile)
  }
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    if (!file) return setError('Upload your Round 1 presentation file.')
    onSubmitted({ ...form, fileName: file.name, fileSize: file.size })
  }

  if (existingSubmission) return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card ppt-modal"><button type="button" className="close-button" onClick={onClose} aria-label="Close submission">×</button><span className="eyebrow">Round 1 submission</span><h3>Round 1 PPT Already Submitted</h3><p className="registration-details-subtitle">{existingSubmission.projectTitle}</p><div className="submission-status">SUBMITTED ✓<small>{new Date(existingSubmission.submittedAt).toLocaleString()}</small></div><button type="button" className="primary-button" onClick={onClose}>Close</button></div></div>

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ppt-title"><div className="modal-card ppt-modal"><button type="button" className="close-button" onClick={onClose} aria-label="Close PPT submission">×</button><span className="eyebrow">Round 1 · {step === 1 ? 'Details' : step === 2 ? 'Upload' : 'Submit'}</span><h3 id="ppt-title">Idea Presentation Submission</h3><p className="registration-details-subtitle">{hackathon.title} · Team {team.teamName} · Leader {team.leaderName}</p>{step === 1 && <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setStep(2) }}><label><span>Project Title *</span><input name="projectTitle" value={form.projectTitle} onChange={update} required /></label><label><span>Problem Statement *</span><textarea name="problemStatement" value={form.problemStatement} onChange={update} required rows="3" /></label><label><span>Proposed Solution *</span><textarea name="proposedSolution" value={form.proposedSolution} onChange={update} required rows="3" /></label><label><span>Technology Stack *</span><input name="technologyStack" value={form.technologyStack} onChange={update} required /></label><button type="submit" className="primary-button">Continue to Upload</button></form>}{step === 2 && <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setStep(3) }}><label className="file-dropzone"><span>PPT File Upload *</span><input type="file" accept=".ppt,.pptx,.pdf" onChange={chooseFile} />{file ? <strong>✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</strong> : <small>Accepted formats: PPT, PPTX, PDF · Maximum 10 MB</small>}</label>{error && <p className="auth-error">{error}</p>}<div className="form-actions modal-actions"><button type="button" className="secondary-button" onClick={() => setStep(1)}>Back</button><button type="submit" className="primary-button">Review Submission</button></div></form>}{step === 3 && <div className="team-review"><h4>Are you sure you want to submit?</h4><p><strong>Project:</strong> {form.projectTitle}</p><p><strong>File:</strong> {file?.name}</p><div className="form-actions modal-actions"><button type="button" className="secondary-button" onClick={() => setStep(2)}>Back</button><button type="button" className="primary-button" onClick={submit}>Submit Round 1</button></div></div>}</div></div>
}
