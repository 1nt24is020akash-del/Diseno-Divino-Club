import { useEffect, useMemo, useRef, useState } from 'react'
import { BADGES, buildLeaderboard } from '../utils/leaderboard'

const tabs = [
  ['Overall', 'all'], ['This Month', 'month'], ['This Week', 'week'], ['Creative', 'creative'], ['Technical', 'technical'], ['Hackathons', 'hackathons'],
]

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

export default function Leaderboard({ records, activities, currentUserId }) {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('All Branches')
  const [period, setPeriod] = useState('All Time')
  const { students, currentStudent } = useMemo(() => buildLeaderboard(records, activities, currentUserId), [records, activities, currentUserId])
  const branches = useMemo(() => ['All Branches', ...new Set(students.map((student) => student.branch).filter(Boolean))], [students])
  const visibleStudents = useMemo(() => students.filter((student) => {
    const matchesSearch = !search.trim() || student.name.toLowerCase().includes(search.trim().toLowerCase()) || student.branch.toLowerCase().includes(search.trim().toLowerCase())
    const matchesBranch = branch === 'All Branches' || student.branch === branch
    const matchesTab = tab === 'all' || (tab === 'creative' && student.creative) || (tab === 'technical' && student.hackathons === 0 && student.creative === 0) || (tab === 'hackathons' && student.hackathons) || (tab === 'month' || tab === 'week')
    return matchesSearch && matchesBranch && matchesTab && (period === 'All Time' || student.transactions.some((transaction) => new Date(transaction.date) >= new Date(Date.now() - (period === 'This Week' ? 7 : 30) * 86400000)))
  }), [students, search, branch, period, tab])
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
        <div className="leaderboard-tabs" role="tablist" aria-label="Leaderboard views">
          {tabs.map(([label, value]) => <button type="button" role="tab" aria-selected={tab === value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)} key={value}>{label}</button>)}
        </div>
        <div className="leaderboard-controls">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." aria-label="Search students" />
          <select value={branch} onChange={(event) => setBranch(event.target.value)} aria-label="Filter by branch">{branches.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Filter by time period"><option>All Time</option><option>This Week</option><option>This Month</option><option>This Semester</option></select>
        </div>
        {podium.length > 0 && <div className="leaderboard-podium">{podium.map((student, index) => <article className={`podium-card podium-${index + 1}`} key={student.id}><span className="podium-rank">{['🥇', '🥈', '🥉'][index]} #{student.rank}</span><div className="leader-avatar">{initials(student.name)}</div><h3>{student.name}</h3><span>{student.branch}</span><strong>{student.xp.toLocaleString()} XP</strong><div className="badge-list">{student.badges.slice(0, 2).map((badge) => <span title={`${badge.name}: ${badge.reason}`} key={badge.name}>{badge.icon}</span>)}</div></article>)}</div>}
        {currentStudent && <div className="my-rank-card"><span>Your current rank</span><strong>#{currentStudent.rank}</strong><div><b>{currentStudent.name}</b><small>{currentStudent.xp.toLocaleString()} XP</small></div><div className="rank-progress"><i style={{ width: `${Math.min((currentStudent.xp % 1000) / 10, 100)}%` }} /></div></div>}
        <div className="leaderboard-list"><div className="leaderboard-list-heading"><span>Rank / Student</span><span>XP</span></div>{visibleStudents.map((student) => <article className="leader-row" key={student.id}><strong className="row-rank">#{student.rank}</strong><div className="leader-avatar small">{initials(student.name)}</div><div className="leader-identity"><strong>{student.name}</strong><span>{student.branch}</span><div className="badge-list">{student.badges.map((badge) => <span title={`${badge.name}: ${badge.reason}`} key={badge.name}>{badge.icon} {badge.name}</span>)}</div></div><strong className="row-xp">{student.xp.toLocaleString()} XP</strong></article>)}</div>
        {currentStudent && <div className="achievement-panel"><div><span className="eyebrow">My profile</span><h3>Recent Achievements</h3><p>Earn XP through registrations, attendance, workshops, and hackathons. Rewards are calculated from validated activity records.</p></div><div className="achievement-badges">{BADGES.slice(0, 4).map((badge) => <span title={`${badge.name}: ${badge.reason}`} key={badge.name}>{badge.icon} {badge.name}</span>)}</div></div>}
      </div>
    </section>
  )
}
