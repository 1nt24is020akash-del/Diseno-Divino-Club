const TEAMS_KEY = 'diseno-divino-hackathon-teams'
const SUBMISSIONS_KEY = 'diseno-divino-ppt-submissions'

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const getHackathonTeams = () => read(TEAMS_KEY)
export const getPptSubmissions = () => read(SUBMISSIONS_KEY)
export const getUserHackathonTeams = (userId) => getHackathonTeams().filter((team) => team.leaderId === userId)
export const getTeamForHackathon = (userId, hackathonId) => getHackathonTeams().find((team) => team.leaderId === userId && team.hackathonId === hackathonId)

export const saveHackathonTeam = (team) => {
  const teams = getHackathonTeams()
  write(TEAMS_KEY, [...teams, { ...team, id: `team-${crypto.randomUUID()}`, registeredAt: new Date().toISOString(), status: 'confirmed' }])
}

export const savePptSubmission = (submission) => {
  const submissions = getPptSubmissions()
  write(SUBMISSIONS_KEY, [...submissions, { ...submission, id: `ppt-${crypto.randomUUID()}`, submittedAt: new Date().toISOString(), status: 'submitted' }])
}

export const getSubmissionForTeam = (teamId) => getPptSubmissions().find((submission) => submission.teamId === teamId)
