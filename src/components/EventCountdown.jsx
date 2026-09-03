import { useEffect, useMemo, useState } from 'react'

const parseStart = (activity) => {
  const match = activity.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return new Date(`${activity.date}T00:00:00`)
  let hour = Number(match[1])
  if (match[3].toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (match[3].toUpperCase() === 'AM' && hour === 12) hour = 0
  return new Date(`${activity.date}T${String(hour).padStart(2, '0')}:${match[2]}:00`)
}

const getTimeLeft = (target, now) => {
  const milliseconds = Math.max(target.getTime() - now, 0)
  const totalSeconds = Math.floor(milliseconds / 1000)
  return { days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60, complete: milliseconds === 0 }
}

export default function EventCountdown({ activity }) {
  const target = useMemo(() => parseStart(activity), [activity])
  const [now, setNow] = useState(() => Date.now())
  const timeLeft = useMemo(() => getTimeLeft(target, now), [target, now])

  useEffect(() => {
    const update = () => setNow(Date.now())
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [target])

  const eventEnd = useMemo(() => new Date(target.getTime() + (activity.duration === 'Full Day' ? 9 : 3) * 60 * 60 * 1000), [activity.duration, target])
  if (now >= eventEnd.getTime()) return <div className="countdown-status complete">EVENT COMPLETED</div>
  if (timeLeft.complete) return <div className="countdown-status live">HACKATHON IS LIVE 🚀</div>

  return <div className="event-countdown" aria-label={`${activity.title} countdown`}><span className="countdown-kicker">{activity.category === 'Hackathon' ? 'HACKATHON STARTS IN' : 'EVENT STARTS IN'}</span><div className="countdown-grid">{[['days', 'DAYS'], ['hours', 'HOURS'], ['minutes', 'MINUTES'], ['seconds', 'SECONDS']].map(([key, label]) => <div className="countdown-unit" key={key}><strong key={timeLeft[key]}>{String(timeLeft[key]).padStart(2, '0')}</strong><span>{label}</span></div>)}</div></div>
}
