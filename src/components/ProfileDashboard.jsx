import { BADGES } from '../utils/leaderboard'

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const relativeDate = (date) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000))
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`
}

const initials = (name = 'Student') => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()

export default function ProfileDashboard({ user, records, activities, certificates, leaderboardStudent, onEditProfile, onOpenEvent, onViewCertificate, onViewAllCertificates, onOpenActivities, onExplore }) {
  if (!user) return <section id="profile" className="profile-section section-shell"><div className="container"><div className="empty-state profile-login-state"><div className="profile-empty-avatar">✦</div><h2>Your student profile</h2><p>Sign in to see your events, XP, badges, certificates, and creative progress.</p><button type="button" className="primary-button" onClick={onExplore}>Explore Events</button></div></div></section>

  const userRecords = records.filter((record) => record.userId === user.id)
  const recentRecords = [...userRecords].sort((first, second) => new Date(second.registeredAt) - new Date(first.registeredAt)).slice(0, 4)
  const earnedBadges = BADGES.filter((badge) => leaderboardStudent && badge.test(leaderboardStudent))
  const completionFields = [user.name, user.email, user.collegeName, user.usn, user.branch, user.phone]
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)
  const missing = [['collegeName', 'College name'], ['usn', 'USN'], ['branch', 'Branch'], ['phone', 'Phone number']].filter(([key]) => !user[key]).map(([, label]) => label)
  const stats = [
    [leaderboardStudent?.xp || 0, 'Total XP', '✦'],
    [userRecords.filter((record) => record.attendanceStatus === 'Checked In').length, 'Events Attended', '✓'],
    [userRecords.filter((record) => activities.find((activity) => activity.id === record.eventId)?.category === 'Hackathon').length, 'Hackathons', '⚡'],
    [certificates.length, 'Certificates', '🏅'],
    [leaderboardStudent?.competitions || 0, 'Challenges Completed', '◇'],
  ]
  const timeline = recentRecords.flatMap((record) => {
    const activity = activities.find((item) => item.id === record.eventId)
    if (!activity) return []
    const items = [{ id: `${record.id}-registered`, icon: '✦', title: 'Registered for', name: activity.title, date: record.registeredAt }]
    if (record.attendanceStatus === 'Checked In') items.push({ id: `${record.id}-attended`, icon: '✓', title: 'Attended', name: activity.title, date: record.checkedInAt || record.registeredAt })
    return items
  }).slice(0, 6)

  return <section id="profile" className="profile-section section-shell"><div className="container profile-container">
    <div className="profile-header-panel"><div className="profile-avatar-large">{user.avatar ? <img src={user.avatar} alt={`${user.name} profile`} /> : initials(user.name)}</div><div className="profile-header-copy"><span className="eyebrow">Student profile · Diseño Divino</span><h2>{user.name}</h2><p>{user.usn || 'USN pending'} · {user.branch || 'Branch pending'}</p><span className="profile-college">{user.collegeName || 'College details pending'}</span><div className="profile-status"><span className="status-glow" /> Active Member <span>·</span> Diseño Divino</div></div><button type="button" className="secondary-button profile-edit-button" onClick={onEditProfile}>Edit Profile</button></div>
    <div className="profile-main-grid"><div className="profile-primary-column">
      <div className="profile-stats-grid">{stats.map(([value, label, icon]) => <div className="profile-stat-card" key={label}><span>{icon}</span><strong>{value.toLocaleString()}</strong><small>{label}</small></div>)}</div>
      <section className="profile-panel"><div className="profile-panel-heading"><div><span className="eyebrow">Momentum</span><h3>Activity timeline</h3></div><button type="button" className="text-button" onClick={onOpenActivities}>Open My Activities</button></div>{timeline.length ? <div className="activity-timeline">{timeline.map((item) => <div className="timeline-item" key={item.id}><span className="timeline-icon">{item.icon}</span><div><strong>{item.title} <em>{item.name}</em></strong><small>{relativeDate(item.date)} · {formatDate(item.date)}</small></div></div>)}</div> : <p className="muted">Register and attend events to build your activity timeline.</p>}</section>
      <section className="profile-panel"><div className="profile-panel-heading"><div><span className="eyebrow">Your calendar</span><h3>Recent events</h3></div><button type="button" className="text-button" onClick={onOpenActivities}>View all</button></div>{recentRecords.length ? <div className="profile-event-grid">{recentRecords.map((record) => { const activity = activities.find((item) => item.id === record.eventId); return activity ? <article className="profile-event-card" key={record.id}><img src={activity.image.src} alt="" /><div><strong>{activity.title}</strong><span>{formatDate(activity.date)}</span><small className={record.attendanceStatus === 'Checked In' ? 'profile-attended' : ''}>{record.attendanceStatus === 'Checked In' ? 'Attended' : 'Registered'}</small><button type="button" className="text-button" onClick={() => onOpenEvent(activity)}>View Details</button></div></article> : null})}</div> : <p className="muted">Your registered events will appear here.</p>}</section>
    </div><aside className="profile-sidebar">
      <section className="profile-panel completion-panel"><div className="profile-panel-heading"><div><span className="eyebrow">Profile health</span><h3>Profile completion</h3></div><strong>{completion}%</strong></div><div className="completion-bar"><span style={{ width: `${completion}%` }} /></div>{missing.length ? <p>Still missing: {missing.join(', ')}.</p> : <p>Your student profile is complete.</p>}</section>
      <section className="profile-panel"><div className="profile-panel-heading"><div><span className="eyebrow">Collection</span><h3>Badges</h3></div></div><div className="profile-badges">{BADGES.slice(0, 6).map((badge) => { const earned = earnedBadges.some((earnedBadge) => earnedBadge.name === badge.name); return <span className={earned ? 'earned' : 'locked'} title={badge.reason} key={badge.name}>{earned ? badge.icon : '🔒'} {badge.name}</span> })}</div></section>
      <section className="profile-panel profile-certificates-preview"><div className="profile-panel-heading"><div><span className="eyebrow">Recognition</span><h3>My Certificates</h3></div><button type="button" className="text-button" onClick={onViewAllCertificates}>View all</button></div>{certificates.length ? certificates.slice(0, 2).map((certificate) => <div className="profile-certificate-row" key={certificate.id}><span>🏅</span><div><strong>{certificate.activity.title}</strong><small>{formatDate(certificate.activity.date)}</small></div><button type="button" className="text-button" onClick={() => onViewCertificate(certificate)}>View</button></div>) : <p className="muted">Attend an event to unlock certificates.</p>}</section>
    </aside></div>
  </div></section>
}
