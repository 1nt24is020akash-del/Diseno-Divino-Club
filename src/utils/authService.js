const SESSION_KEY = 'diseno-divino-auth-session'
const USERS_KEY = 'diseno-divino-auth-users'

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const publicUser = (userRecord) => {
  const user = { ...userRecord }
  delete user.passwordHash
  return user
}

export const getAuthSession = () => readJson(SESSION_KEY, null)

const saveSession = (user) => {
  const session = { user, authenticatedAt: new Date().toISOString() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return user
}

export const signInWithEmail = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readJson(USERS_KEY, [])
  const user = users.find((item) => item.email === normalizedEmail)
  if (!user || user.passwordHash !== await hashPassword(password)) {
    throw new Error('The email or password is incorrect.')
  }
  return saveSession(publicUser(user))
}

export const createEmailAccount = async ({ fullName, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readJson(USERS_KEY, [])
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }
  const user = {
    id: `student-${crypto.randomUUID()}`,
    name: fullName.trim(),
    email: normalizedEmail,
    collegeName: '',
    usn: '',
    branch: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provider: 'email',
    avatar: '',
    passwordHash: await hashPassword(password),
  }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  return saveSession(publicUser(user))
}

export const updateAuthProfile = (userId, profile) => {
  const users = readJson(USERS_KEY, [])
  const updatedUser = users.find((user) => user.id === userId)
  if (!updatedUser) return getAuthSession()?.user || null
  const nextUser = { ...updatedUser, ...profile, updatedAt: new Date().toISOString() }
  localStorage.setItem(USERS_KEY, JSON.stringify(users.map((user) => user.id === userId ? nextUser : user)))
  return saveSession(publicUser(nextUser))
}

export const signOut = () => localStorage.removeItem(SESSION_KEY)
