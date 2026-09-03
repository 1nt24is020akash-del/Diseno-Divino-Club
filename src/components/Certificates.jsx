import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

function CertificatePreview({ certificate, onClose }) {
  const [qrCode, setQrCode] = useState('')
  useEffect(() => { QRCode.toDataURL(certificate.id, { width: 180, margin: 1 }).then(setQrCode).catch(() => setQrCode('')) }, [certificate.id])
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="certificate-title"><div className="certificate-modal"><button type="button" className="close-button" onClick={onClose} aria-label="Close certificate">×</button><div className="certificate-paper" id="certificate-paper"><span className="certificate-kicker">DISEÑO DIVINO · NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY</span><div className="certificate-seal">✦</div><h2 id="certificate-title">CERTIFICATE OF PARTICIPATION</h2><p>This is to certify that</p><h3>{certificate.studentName}</h3><p>USN: {certificate.usn || 'Not provided'}</p><p>has successfully participated in</p><strong className="certificate-event">{certificate.activity.title}</strong><p>organized by</p><strong>DISEÑO DIVINO</strong><p>NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY</p><p>on {formatDate(certificate.activity.date)}.</p><div className="certificate-footer"><span>Issued {formatDate(certificate.issueDate)}<small>{certificate.id}</small></span>{qrCode && <img src={qrCode} alt="Certificate verification code" />}<span>Club Organizer<small>Diseño Divino</small></span></div></div><div className="certificate-actions"><button type="button" className="primary-button" onClick={() => downloadCertificate(certificate, qrCode)}>Download PDF</button><button type="button" className="secondary-button" onClick={onClose}>Close</button></div></div></div>
}

const downloadCertificate = (certificate, qrCode) => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' })
  pdf.setFillColor(7, 11, 20); pdf.rect(0, 0, 297, 210, 'F')
  pdf.setDrawColor(95, 227, 255); pdf.setLineWidth(1); pdf.rect(12, 12, 273, 186)
  pdf.setTextColor(168, 241, 255); pdf.setFontSize(10); pdf.text('DISENO DIVINO · NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY', 148.5, 30, { align: 'center' })
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(24); pdf.text('CERTIFICATE OF PARTICIPATION', 148.5, 58, { align: 'center' }); pdf.setFontSize(12); pdf.text('This is to certify that', 148.5, 78, { align: 'center' }); pdf.setFontSize(22); pdf.text(certificate.studentName, 148.5, 94, { align: 'center' }); pdf.setFontSize(11); pdf.text(`USN: ${certificate.usn || 'Not provided'}`, 148.5, 104, { align: 'center' }); pdf.text('has successfully participated in', 148.5, 119, { align: 'center' }); pdf.setFontSize(17); pdf.text(certificate.activity.title, 148.5, 133, { align: 'center' }); pdf.setFontSize(11); pdf.text(`organized by DISENO DIVINO on ${formatDate(certificate.activity.date)}`, 148.5, 147, { align: 'center' }); pdf.text(`College: ${certificate.collegeName || 'NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY'}`, 148.5, 158, { align: 'center' }); pdf.setTextColor(168, 241, 255); pdf.text(`Certificate ID: ${certificate.id}`, 28, 184); pdf.text('Club Organizer', 238, 184)
  if (qrCode) pdf.addImage(qrCode, 'PNG', 255, 25, 25, 25)
  pdf.save(`${certificate.id}-${certificate.activity.slug || certificate.activity.id}.pdf`)
}

export default function Certificates({ certificates, onExplore }) {
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  return <section id="my-certificates" className="certificates-section section-shell"><div className="container"><div className="section-header"><div><span className="eyebrow">My Certificates</span><h2>Proof of your creative momentum.</h2></div></div>{certificates.length ? <div className="certificates-grid">{certificates.map((certificate) => <article className="certificate-card" key={certificate.id}><img src={certificate.activity.image.src} alt="" /><div className="certificate-card-body"><span className="certificate-badge">🏅 Certificate Available</span><h3>{certificate.activity.title}</h3><span>{formatDate(certificate.activity.date)}</span><p><strong>Club:</strong> Diseño Divino<br /><strong>College:</strong> {certificate.collegeName || 'NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY'}</p><div className="certificate-card-actions"><button type="button" className="primary-button small" onClick={() => setSelectedCertificate(certificate)}>View Certificate</button><button type="button" className="secondary-button small" onClick={() => downloadCertificate(certificate)}>Download PDF</button></div></div></article>)}</div> : <div className="empty-state certificates-empty"><div className="certificate-empty-icon">🏅</div><h3>No Certificates Yet</h3><p>Attend and complete Diseño Divino events to unlock certificates.</p><button type="button" className="primary-button" onClick={onExplore}>Explore Events</button></div>}</div>{selectedCertificate && <CertificatePreview certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />}</section>
}
