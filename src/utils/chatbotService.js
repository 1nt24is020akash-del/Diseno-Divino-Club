import { activities } from '../data/activities'
import { getInterests, getRegistrations } from './storage'

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const currentCount = (activity, registrations) => Math.min(
  activity.registeredCount + (registrations.includes(activity.id) ? 1 : 0),
  activity.capacity,
)

const activityLine = (activity, registrations) => {
  const filled = currentCount(activity, registrations)
  const available = Math.max(activity.capacity - filled, 0)
  return `${activity.title} - ${formatDate(activity.date)} at ${activity.time} in ${activity.location}. ${available} spots available out of ${activity.capacity}; ${filled} filled.`
}

export const getChatContext = () => {
  const registrations = getRegistrations()
  const interests = getInterests()
  return { registrations, interests }
}

export function answerQuestion(question) {
  const query = question.trim().toLowerCase()
  const { registrations, interests } = getChatContext()
  const findActivity = () => activities.find((activity) => query.includes(activity.title.toLowerCase()) || query.includes(activity.category.toLowerCase()))

  if (!query) return 'Ask me about events, capacity, registrations, My Activities, or a creative technology question.'

  if (query.includes('my activit') || query.includes('registered') || query.includes('i sign')) {
    const registered = activities.filter((activity) => registrations.includes(activity.id))
    if (!registered.length) return 'You do not have any registrations yet. Open an event and choose Register Now to get started.'
    return `You are registered for ${registered.length} ${registered.length === 1 ? 'activity' : 'activities'}:\n${registered.map((activity) => `- ${activity.title} on ${formatDate(activity.date)}`).join('\n')}`
  }

  if (query.includes('interest')) {
    const interested = activities.filter((activity) => interests.includes(activity.id))
    if (!interested.length) return 'You have not marked any activities as interested yet. Tap Interested on an event card to save one.'
    return `Your interested activities are:\n${interested.map((activity) => `- ${activity.title}`).join('\n')}`
  }

  if (query.includes('spot') || query.includes('capacity') || query.includes('available') || query.includes('fill')) {
    const activity = findActivity()
    if (activity) {
      const filled = currentCount(activity, registrations)
      return `${activity.title} has ${Math.max(activity.capacity - filled, 0)} spots available out of ${activity.capacity} total. ${filled} spots are currently filled.`
    }
    return `Here are the current capacity highlights:\n${activities.slice(0, 5).map((item) => `- ${item.title}: ${Math.max(item.capacity - currentCount(item, registrations), 0)} of ${item.capacity} spots available`).join('\n')}`
  }

  if (query.includes('schedule') || query.includes('upcoming') || query.includes('event') || query.includes('when')) {
    const upcoming = [...activities].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
    return `Here are the next activities I found:\n${upcoming.map((activity) => `- ${activityLine(activity, registrations)}`).join('\n')}`
  }

  if (query.includes('register') || query.includes('join')) {
    return 'Choose View Details on any event card, then select Register Now. Complete the short form and your registration will appear in My Activities.'
  }

  if (query.includes('what is') || query.includes('about') || query.includes('club') || query.includes('diseño')) {
    return 'Diseño Divino is a student creative community for workshops, events, design challenges, and meaningful collaboration across art, design, storytelling, and technology.'
  }

  if (query.includes('inheritance')) return 'In programming, inheritance lets a child class reuse and extend a parent class. It is useful for shared behavior, but composition is often more flexible when relationships change.'
  if (query.includes('hackathon')) return 'For a hackathon, start with a small problem, define the simplest demo, divide roles, and leave time to test and present. A clear story usually beats a crowded feature list.'
  if (query.includes('design') || query.includes('code') || query.includes('program') || query.includes('tech')) return 'A strong creative technology project starts with a clear human idea, then uses code to make that idea interactive. Prototype the smallest expressive interaction first and refine it through feedback.'

  return 'I can help with event dates, locations, capacity, registration, My Activities, and club information. I can also offer general advice about design, coding, technology, and student projects.'
}
