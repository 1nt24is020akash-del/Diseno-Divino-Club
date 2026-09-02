import { jsPDF } from 'jspdf'
import nmitLogo from '../assets/nmit-logo.svg?raw'

const INSTITUTE = 'NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY'
const CLUB_NAME = 'DISEÑO DIVINO'
const margin = 20
const pageWidth = 210
const contentWidth = pageWidth - margin * 2

const safeText = (value) => String(value || '').trim() || 'Not provided'
const sanitizeFilename = (value) => safeText(value).replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '')
const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
const currentDate = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

export const buildAttendanceLetter = async ({ activity, user, details, registeredCount }) => {
  const pdf = new jsPDF({ format: 'a4', unit: 'mm', compress: true })
  const organizingClub = safeText(activity.clubName || activity.organizer || CLUB_NAME)
  let y = 20

  const addPageIfNeeded = (height = 8) => {
    if (y + height <= 276) return
    pdf.addPage()
    y = 20
  }

  const text = (value, x, top, size = 10, options = {}) => {
    pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
    pdf.setFontSize(size)
    pdf.setTextColor(...(options.color || [38, 43, 53]))
    pdf.text(value, x, top, { align: options.align })
  }

  const wrapped = (value, x, top, width, size = 10, options = {}) => {
    pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
    pdf.setFontSize(size)
    const lines = pdf.splitTextToSize(safeText(value), width)
    lines.forEach((line) => {
      addPageIfNeeded(size * 0.45 + 4)
      text(line, x, y, size, options)
      y += size * 0.45 + 2
    })
    return lines.length
  }

  const heading = (value, size = 11) => {
    addPageIfNeeded(12)
    text(value, margin, y, size, { bold: true, color: [28, 71, 89] })
    y += 7
  }

  pdf.setFillColor(248, 251, 252)
  pdf.rect(0, 0, pageWidth, 48, 'F')
  await pdf.addSvgAsImage(nmitLogo, 45, 7, 120, 11.3)
  text(INSTITUTE, pageWidth / 2, 25, 10.5, { bold: true, color: [10, 34, 47], align: 'center' })
  pdf.setFillColor(35, 24, 78)
  pdf.roundedRect(margin, 30, contentWidth, 12, 3, 3, 'F')
  text(CLUB_NAME, pageWidth / 2, 38, 12, { bold: true, color: [160, 244, 255], align: 'center' })
  y = 61

  text('EVENT ATTENDANCE REQUEST LETTER', pageWidth / 2, y, 15, { bold: true, color: [10, 34, 47], align: 'center' })
  y += 11
  pdf.setDrawColor(81, 188, 196)
  pdf.setLineWidth(0.7)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 12

  text(`Date: ${currentDate()}`, margin, y, 10)
  y += 10
  wrapped('To,', margin, y, contentWidth, 10)
  wrapped('The Class Teacher / Faculty In-Charge', margin, y, contentWidth, 10)
  y += 5
  text(`Subject: Request for Attendance Consideration - ${safeText(activity.title)}`, margin, y, 10, { bold: true })
  y += 10
  wrapped('Respected Sir/Madam,', margin, y, contentWidth, 10)
  y += 3
  wrapped(`I, ${safeText(user.name)}, bearing USN ${safeText(details.usn)}, studying in the ${safeText(details.branch)} branch, would like to inform you that I am registered to attend the event "${safeText(activity.title)}".`, margin, y, contentWidth, 10)
  y += 4
  wrapped(`The event is organized by ${organizingClub} (${safeText(activity.organizer)}).`, margin, y, contentWidth, 10)
  y += 4

  heading('EVENT DETAILS')
  const rows = [
    ['Event Name', activity.title],
    ['Organizing Club', `${organizingClub} - ${safeText(activity.organizer)}`],
    ['Category', activity.category],
    ['Date', formatDate(activity.date)],
    ['Time', activity.time],
    ['Duration', activity.duration],
    ['Venue / Location', activity.location],
    ['Registration', `${registeredCount || 0} of ${activity.capacity} spots filled`],
  ]
  const rowHeight = 8
  const labelWidth = 43
  pdf.setFontSize(9)
  rows.forEach(([label, value]) => {
    addPageIfNeeded(rowHeight)
    pdf.setFillColor(241, 248, 249)
    pdf.rect(margin, y - 5.5, contentWidth, rowHeight, 'F')
    pdf.setDrawColor(205, 224, 226)
    pdf.rect(margin, y - 5.5, contentWidth, rowHeight)
    text(label, margin + 3, y, 8.5, { bold: true, color: [28, 71, 89] })
    text(safeText(value), margin + labelWidth, y, 8.5)
    y += rowHeight
  })
  y += 6

  heading('ABOUT THE EVENT')
  wrapped(activity.fullDescription, margin, y, contentWidth, 10)
  y += 4
  wrapped('I will be attending this event during the above-mentioned time. Therefore, I kindly request you to consider granting attendance for the academic hours affected due to my participation in this event.', margin, y, contentWidth, 10)
  y += 4
  wrapped('I assure you that I will be attending the event as a registered participant.', margin, y, contentWidth, 10)
  y += 4
  wrapped('I kindly request your consideration and support.', margin, y, contentWidth, 10)
  y += 4
  wrapped('Thank you.', margin, y, contentWidth, 10)
  y += 8
  wrapped('Yours sincerely,', margin, y, contentWidth, 10)
  y += 10
  text(safeText(user.name), margin, y, 10, { bold: true })
  y += 6
  text(`USN: ${safeText(details.usn)}`, margin, y, 9)
  y += 5
  text(`Branch: ${safeText(details.branch)}`, margin, y, 9)
  y += 5

  addPageIfNeeded(35)
  const signatureY = Math.max(y + 10, 252)
  const signatureX = 132
  pdf.setDrawColor(55, 70, 78)
  pdf.setLineWidth(0.4)
  pdf.line(signatureX, signatureY, pageWidth - margin, signatureY)
  text('Signature', signatureX, signatureY + 6, 8.5)
  text('HOD / Authorized Signatory', signatureX, signatureY + 12, 8.5, { bold: true })
  text('For the Organizing Club', signatureX, signatureY + 18, 8.5, { color: [28, 71, 89] })
  text(`${organizingClub} / ${safeText(activity.organizer)}`, signatureX, signatureY + 24, 8.5)

  pdf.setDrawColor(81, 188, 196)
  pdf.setLineWidth(0.5)
  pdf.line(margin, 285, pageWidth - margin, 285)
  text(`This letter is generated from the ${organizingClub} event registration record.`, pageWidth / 2, 291, 7.5, { color: [100, 112, 120], align: 'center' })

  return {
    pdf,
    filename: `Attendance_Letter_${sanitizeFilename(activity.title)}_${sanitizeFilename(details.usn)}.pdf`,
  }
}

export const downloadAttendanceLetter = async (data) => {
  const { pdf, filename } = await buildAttendanceLetter(data)
  pdf.save(filename)
}
