export const XP_RULES = Object.freeze({
  registration: 50,
  attendance: 100,
  workshop: 150,
  hackathon: 250,
  competition: 150,
})

export const BADGES = [
  { name: 'Active Member', icon: '🔥', reason: 'Participate in three or more events.', test: (student) => student.events >= 3 },
  { name: 'Innovator', icon: '💡', reason: 'Join a competition or hackathon.', test: (student) => student.competitions > 0 || student.hackathons > 0 },
  { name: 'Creative Mind', icon: '🎨', reason: 'Take part in creative workshops or events.', test: (student) => student.creative > 0 },
  { name: 'Event Explorer', icon: '⚡', reason: 'Register for multiple different events.', test: (student) => student.events >= 2 },
  { name: 'Community Builder', icon: '🤝', reason: 'Show up for community events.', test: (student) => student.community > 0 },
  { name: 'Rising Star', icon: '🚀', reason: 'Reach 250 XP as a new member.', test: (student) => student.xp >= 250 },
  { name: 'Top Performer', icon: '🌟', reason: 'Reach the top three leaderboard positions.', test: (student) => student.rank <= 3 },
]

const getTransactionKey = (record, type) => `${record.registrationId || record.id}:${type}`

export const buildLeaderboard = (records, activities, currentUserId) => {
  const students = new Map()
  const transactions = []

  records.forEach((record) => {
    const activity = activities.find((item) => item.id === record.eventId)
    if (!activity) return
    const studentId = record.userId || 'local-student'
    const existing = students.get(studentId) || {
      id: studentId,
      name: record.studentName || 'Student',
      branch: record.branch || 'Creative Studies',
      collegeName: record.collegeName || '',
      xp: 0,
      events: 0,
      competitions: 0,
      hackathons: 0,
      creative: 0,
      community: 0,
      transactions: [],
    }
    const addTransaction = (type, points, description) => {
      const key = getTransactionKey(record, type)
      if (transactions.some((item) => item.key === key)) return
      const transaction = { key, points, description, date: record.registeredAt }
      transactions.push(transaction)
      existing.xp += points
      existing.transactions.push(transaction)
    }

    existing.events += 1
    if (activity.category === 'Competition') existing.competitions += 1
    if (activity.category === 'Hackathon') existing.hackathons += 1
    if (activity.category === 'Community') existing.community += 1
    if (activity.category === 'Workshop' || activity.category === 'Event') existing.creative += 1
    addTransaction('registration', XP_RULES.registration, `Registered for ${activity.title}`)
    if (record.attendanceStatus === 'Checked In') addTransaction('attendance', XP_RULES.attendance, `Attended ${activity.title}`)
    if (activity.category === 'Workshop') addTransaction('workshop', XP_RULES.workshop, `Completed ${activity.title}`)
    if (activity.category === 'Hackathon') addTransaction('hackathon', XP_RULES.hackathon, `Participated in ${activity.title}`)
    if (activity.category === 'Competition') addTransaction('competition', XP_RULES.competition, `Participated in ${activity.title}`)
    students.set(studentId, existing)
  })

  const ranked = [...students.values()]
    .sort((first, second) => second.xp - first.xp || first.name.localeCompare(second.name))
    .map((student, index) => ({ ...student, rank: index + 1 }))
    .map((student) => ({ ...student, badges: BADGES.filter((badge) => badge.test(student)) }))

  return { students: ranked, currentStudent: ranked.find((student) => student.id === currentUserId) || null, transactions }
}
