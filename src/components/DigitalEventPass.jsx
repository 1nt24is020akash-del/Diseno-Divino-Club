import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

export default function DigitalEventPass({ activity, record, user, onClose, onAddToActivities }) {
  const [qrCode, setQrCode] = useState('')
  const studentName = record.studentName || user?.name || 'Student'

  useEffect(() => {
    let cancelled = false
    const payload = JSON.stringify({
      registrationId: record.registrationId,
      studentId: record.userId,
      eventId: record.eventId,
      version: record.validationVersion || 1,
    })
    QRCode.toDataURL(payload, { width: 320, margin: 2, color: { dark: '#07111d', light: '#dffcff' } })
      .then((url) => { if (!cancelled) setQrCode(url) })
      .catch(() => setQrCode(''))
    return () => { cancelled = true }
  }, [record])

  const downloadPass = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    pdf.setFillColor(7, 11, 20)
    pdf.rect(0, 0, 210, 297, 'F')
    pdf.setTextColor(223, 252, 255)
    pdf.setFontSize(22)
    pdf.text('DISENO DIVINO', 20, 28)
    pdf.setFontSize(11)
    pdf.setTextColor(168, 241, 255)
    pdf.text('STUDENT EVENT PASS', 20, 37)
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.text(activity.title, 20, 64)
    pdf.setFontSize(11)
    pdf.text(`${activity.category}  |  ${activity.date}  |  ${activity.time}`, 20, 74)
    pdf.text(`Venue: ${activity.location}`, 20, 82)
    pdf.text(`Duration: ${activity.duration}`, 20, 90)
    pdf.setTextColor(168, 241, 255)
    pdf.text('STUDENT', 20, 112)
    pdf.setTextColor(255, 255, 255)
    pdf.text(`Name: ${studentName}`, 20, 122)
    pdf.text(`USN: ${record.usn || 'Not provided'}`, 20, 130)
    pdf.text(`Branch: ${record.branch || 'Not provided'}`, 20, 138)
    pdf.text(`College: ${record.collegeName || 'Not provided'}`, 20, 146)
    pdf.setTextColor(168, 241, 255)
    pdf.text(`Registration ID: ${record.registrationId}`, 20, 164)
    if (qrCode) pdf.addImage(qrCode, 'PNG', 135, 108, 48, 48)
    pdf.setTextColor(190, 200, 210)
    pdf.text('Present this pass at the event', 20, 190)
    pdf.save(`${record.registrationId}-${activity.slug || activity.id}.pdf`)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pass-title">
      <div className="digital-pass-modal">
        <button type="button" className="close-button" onClick={onClose} aria-label="Close event pass">×</button>
        <div className="digital-pass" id="digital-event-pass">
          <div className="pass-header">
            <div><strong>DISEÑO DIVINO</strong><span>STUDENT EVENT PASS</span></div>
            <span className="pass-status">CONFIRMED</span>
          </div>
          <div className="pass-event-visual">
            <img src={activity.image.src} alt={`${activity.title} event`} />
            <div><span>{activity.category}</span><h2 id="pass-title">{activity.title}</h2></div>
          </div>
          <div className="pass-event-info">
            <div><span>Date</span><strong>{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div>
            <div><span>Time</span><strong>{activity.time}</strong></div>
            <div><span>Venue</span><strong>{activity.location}</strong></div>
            <div><span>Duration</span><strong>{activity.duration}</strong></div>
          </div>
          <div className="pass-student-section">
            <div className="pass-student-details">
              <span className="pass-label">Student</span>
              <strong>{studentName}</strong>
              <span>USN: {record.usn || 'Not provided'}</span>
              <span>Branch: {record.branch || 'Not provided'}</span>
              <span>College: {record.collegeName || 'Not provided'}</span>
              <span>Organizer: Diseño Divino</span>
            </div>
            <div className="pass-qr-wrap">
              {qrCode ? <img src={qrCode} alt="Unique registration QR code" /> : <span>Generating QR...</span>}
              <small>{record.registrationId}</small>
            </div>
          </div>
          <p className="pass-note">Present this pass at the event entrance.</p>
        </div>
        <div className="pass-actions">
          <button type="button" className="primary-button" onClick={downloadPass}>Download Pass</button>
          <button type="button" className="secondary-button" onClick={onAddToActivities}>Add to My Activities</button>
          <a className="ghost-button" href="https://maps.app.goo.gl/EsVAGKYEamohgZ2MA" target="_blank" rel="noreferrer">Get Directions</a>
          <button type="button" className="text-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
