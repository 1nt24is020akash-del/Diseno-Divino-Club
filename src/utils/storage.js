const STORAGE_KEYS = {
  registrations: 'diseno-divino-registrations',
  registrationRecords: 'diseno-divino-registration-records',
  interests: 'diseno-divino-interests',
}

export const loadFromStorage = (key) => {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : []
  } catch (error) {
    console.error('Unable to load local storage value:', error)
    return []
  }
}

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Unable to save local storage value:', error)
  }
}

export const getRegistrations = () => loadFromStorage(STORAGE_KEYS.registrations)
export const getRegistrationRecords = () => loadFromStorage(STORAGE_KEYS.registrationRecords)
export const getInterests = () => loadFromStorage(STORAGE_KEYS.interests)

export const persistRegistration = (activityId, user, details = {}) => {
  const current = getRegistrations()
  if (!current.includes(activityId)) {
    const updated = [...current, activityId]
    saveToStorage(STORAGE_KEYS.registrations, updated)
    const uniquePart = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 6)
      : Math.random().toString(36).slice(2, 8)
    const record = {
      id: `registration-${Date.now()}`,
      registrationId: `DD-${new Date().getFullYear()}-${uniquePart.toUpperCase()}`,
      userId: user?.id || 'local-student',
      eventId: activityId,
      studentName: user?.name || '',
      collegeName: details.collegeName || user?.collegeName || '',
      usn: details.usn || user?.usn || '',
      branch: details.branch || user?.branch || '',
      phone: details.phone || user?.phone || '',
      registeredAt: new Date().toISOString(),
      status: 'confirmed',
      attendanceStatus: 'Not Checked In',
      validationVersion: 1,
    }
    saveToStorage(STORAGE_KEYS.registrationRecords, [...getRegistrationRecords(), record])
    return record
  }
  return false
}

export const updateAttendanceStatus = (registrationId) => {
  const records = getRegistrationRecords()
  const record = records.find((item) => item.registrationId === registrationId)
  if (!record || record.attendanceStatus === 'Checked In') return record || null
  const updatedRecord = { ...record, attendanceStatus: 'Checked In', checkedInAt: new Date().toISOString() }
  saveToStorage(STORAGE_KEYS.registrationRecords, records.map((item) => item.registrationId === registrationId ? updatedRecord : item))
  return updatedRecord
}

export const persistInterest = (activityId) => {
  const current = getInterests()
  const exists = current.includes(activityId)
  const updated = exists ? current.filter((id) => id !== activityId) : [...current, activityId]
  saveToStorage(STORAGE_KEYS.interests, updated)
  return !exists
}

export const removeRegistration = (activityId) => {
  const current = getRegistrations().filter((id) => id !== activityId)
  saveToStorage(STORAGE_KEYS.registrations, current)
  saveToStorage(STORAGE_KEYS.registrationRecords, getRegistrationRecords().filter((record) => record.eventId !== activityId))
}

export const getActivityStatus = (activity) => {
  if (activity.capacity && activity.registeredCount >= activity.capacity) return 'Registration Closed'
  if (activity.status === 'Almost Full') return 'Almost Full'
  if (activity.status === 'Limited Spots') return 'Limited Spots'
  return 'Open'
}
