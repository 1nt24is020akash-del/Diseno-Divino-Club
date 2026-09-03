import { useEffect, useMemo, useRef, useState } from 'react'
import { BADGES, buildLeaderboard } from '../utils/leaderboard'

function CountUp({ value }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let frame = 0
      const start = performance.now()
      const tick = (time) => {
        const progress = Math.min((time - start) / 900, 1)
        setCount(Math.round(value * progress))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      observer.disconnect()
      return () => cancelAnimationFrame(frame)
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])
  return <strong ref={ref}>{count.toLocaleString()}+</strong>
}

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()

const featuredStudents = [
  { id: 'featured-1', name: 'Akash', branch: 'Computer Science & Engineering', collegeName: 'Nitte Meenakshi Institute of Technology', xp: 1250, events: 12, wins: 4, achievement: 'Hackathon Champion', achievementIcon: '🏆', prizePool: '₹50,000', wonPoints: 1250, detail: 'Led the winning hackathon team with a campus accessibility platform.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=85' },
  { id: 'featured-2', name: 'Vikas Patel K R', branch: 'Information Science & Engineering', collegeName: 'Nitte Meenakshi Institute of Technology', xp: 1080, events: 10, wins: 3, achievement: 'Top Innovator', achievementIcon: '💡', prizePool: '₹30,000', wonPoints: 1080, detail: 'Designed an intelligent event discovery system for student communities.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=85' },
  { id: 'featured-3', name: 'Naveen', branch: 'Communication Design', collegeName: 'Nitte Meenakshi Institute of Technology', xp: 950, events: 9, wins: 2, achievement: 'Creative Star', achievementIcon: '🎨', prizePool: '₹20,000', wonPoints: 950, detail: 'Shaped the visual identity for the annual student creative showcase.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=85' },
  { id: 'featured-4', name: 'Rahul', branch: 'Electronics & Communication', collegeName: 'Nitte Meenakshi Institute of Technology', xp: 820, events: 8, wins: 1, achievement: 'Active Member', achievementIcon: '🔥', prizePool: '₹10,000', wonPoints: 820, detail: 'A consistent contributor across workshops, events, and team activities.', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=240&q=85' },
  { id: 'featured-5', name: 'Priya', branch: 'Artificial Intelligence & ML', collegeName: 'Nitte Meenakshi Institute of Technology', xp: 760, events: 7, wins: 1, achievement: 'Rising Star', achievementIcon: '⭐', prizePool: '₹5,000', wonPoints: 760, detail: 'Made a strong first-season debut with a thoughtful machine learning prototype.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=85' },
].map((student, index) => ({ ...student, rank: index + 1, badges: [], transactions: [] }))

function StudentAvatar({ student, large = false }) {
  const [imageFailed, setImageFailed] = useState(false)

  return imageFailed || !student.image
    ? <div className={`student-photo ${large ? 'large' : ''} fallback-photo`} aria-label={`${student.name} initials`}>{initials(student.name)}</div>
    : <img className={`student-photo ${large ? 'large' : ''}`} src={student.image} alt={`${student.name} profile`} onError={() => setImageFailed(true)} />
}

function XpBar({ xp }) {
  const [hasEntered, setHasEntered] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const element = barRef.current
    if (!element) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.4 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div className="xp-bar" ref={barRef} aria-label={`${xp} XP progress`}><span style={{ width: hasEntered ? `${Math.min((xp / 1250) * 100, 100)}%` : '0%' }} /></div>
}

export default function Leaderboard({ records, activities, currentUserId }) {
  const { students, currentStudent } = useMemo(() => buildLeaderboard(records, activities, currentUserId), [records, activities, currentUserId])
  const visibleStudents = students.length > 0 ? students.slice(0, 5) : featuredStudents
  const podium = visibleStudents.slice(0, 3)
  const stats = [[35, 'Events Conducted'], [500, 'Student Registrations'], [100, 'Active Members'], [50, 'Challenges Completed']]

  return (
    <section id="leaderboard" className="leaderboard-section section-shell">
      <div className="container leaderboard-container">
        <div className="leaderboard-hero reveal-block">
          <span className="eyebrow">🏆 Student leaderboard</span>
          <h2>Learn. Create. Participate. Rise.</h2>
          <p>Celebrate the students turning curiosity into momentum across the Diseño Divino community.</p>
        </div>
        <div className="leaderboard-stats">
          {stats.map(([value, label]) => <div className="leaderboard-stat" key={label}><CountUp value={value} /><span>{label}</span></div>)}
        </div>
        {podium.length > 0 && <div className="leaderboard-podium">{podium.map((student, index) => <article className={`podium-card podium-${student.rank}`} key={student.id}><span className="podium-rank">{['🥇', '🥈', '🥉'][index]} #{student.rank}</span>{student.rank === 1 && <span className="podium-crown" aria-hidden="true">♛</span>}<StudentAvatar student={student} large /><h3>{student.name}</h3><span>{student.branch}</span><strong>{student.xp.toLocaleString()} XP</strong><XpBar xp={student.xp} /><span className="podium-achievement">{student.achievementIcon || '🏅'} {student.achievement || student.badges?.[0]?.name || 'Active Member'}</span></article>)}</div>}
        {currentStudent && <div className="my-rank-card"><span>Your current rank</span><strong>#{currentStudent.rank}</strong><div><b>{currentStudent.name}</b><small>{currentStudent.xp.toLocaleString()} XP</small></div><div className="rank-progress"><i style={{ width: `${Math.min((currentStudent.xp % 1000) / 10, 100)}%` }} /></div></div>}
        <div className="leaderboard-list"><div className="leaderboard-list-heading"><span>Student details</span><span>XP total</span></div>{visibleStudents.map((student) => <article className={`leader-row rank-${student.rank}`} key={student.id}><strong className="row-rank">#{student.rank}</strong><StudentAvatar student={student} /><div className="leader-identity"><strong>{student.name}</strong><span>{student.branch} · {student.collegeName}</span><p>{student.detail || 'Active member of the Diseño Divino student community.'}</p><div className="student-achievements"><span><b>Achievement</b>{student.achievement ? `${student.achievementIcon} ${student.achievement}` : student.badges?.map((badge) => badge.name).join(' · ') || 'Active participant'}</span><span><b>Events</b>{student.events || 0} participated · {student.wins || 0} won</span><span className="prize-highlight"><b>Prize pool won</b>{student.prizePool || '$0'}</span></div><XpBar xp={student.xp} /></div><strong className="row-xp"><span>XP TOTAL</span>{student.xp.toLocaleString()}</strong></article>)}</div>
        {currentStudent && <div className="achievement-panel"><div><span className="eyebrow">My profile</span><h3>Recent Achievements</h3><p>Earn XP through registrations, attendance, workshops, and hackathons. Rewards are calculated from validated activity records.</p></div><div className="achievement-badges">{BADGES.slice(0, 4).map((badge) => <span title={`${badge.name}: ${badge.reason}`} key={badge.name}>{badge.icon} {badge.name}</span>)}</div></div>}
      </div>
    </section>
  )
}
