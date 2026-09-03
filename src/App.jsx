import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import ActivityCard from './components/ActivityCard'
import Footer from './components/Footer'
import ConfirmationDialog from './components/ConfirmationDialog'
import BackgroundScene from './components/BackgroundScene'
import ChatbotWidget from './components/ChatbotWidget'
import CapacityMeter from './components/CapacityMeter'
import AuthModal from './components/AuthModal'
import RegistrationConfirmModal from './components/RegistrationConfirmModal'
import RegistrationDetailsModal from './components/RegistrationDetailsModal'
import TeamRegistrationModal from './components/TeamRegistrationModal'
import PptSubmissionModal from './components/PptSubmissionModal'
import DigitalEventPass from './components/DigitalEventPass'
import Leaderboard from './components/Leaderboard'
import { activities, filterOptions } from './data/activities'
import { hackathons } from './data/hackathons'
import {
  getInterests,
  getRegistrations,
  getRegistrationRecords,
  persistInterest,
  persistRegistration,
  removeRegistration,
  updateAttendanceStatus,
} from './utils/storage'
import { getAuthSession, signOut, updateAuthProfile } from './utils/authService'
import { downloadAttendanceLetter } from './utils/attendanceLetter'
import { getHackathonTeams, getPptSubmissions, getTeamForHackathon, getSubmissionForTeam, saveHackathonTeam, savePptSubmission } from './utils/hackathonStorage'

const mappedCategories = {
  Workshops: 'Workshop',
  Events: 'Event',
  Competitions: 'Competition',
  Hackathons: 'Hackathon',
  'Social / Community': 'Community',
}

// Legacy gallery data retained for compatibility with the previous home experience.
// eslint-disable-next-line no-unused-vars
const galleryEvents = [
  {
    id: 'creative-coding-workshop-gallery',
    category: 'Workshop',
    title: 'Creative Coding Workshop',
    description: 'Exploring code, creativity, and interactive digital experiences.',
    detail: 'Previously Conducted • 120+ Students',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'uiux-design-sprint-gallery',
    category: 'Workshop',
    title: 'UI/UX Design Sprint',
    description: 'Turning big ideas into smooth, beautiful product experiences.',
    detail: 'Previously Conducted • 90+ Students',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'campus-photography-walk-gallery',
    category: 'Event',
    title: 'Campus Photography Walk',
    description: 'Capturing stories, frames, and hidden corners across campus life.',
    detail: 'Previously Conducted • 70+ Students',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'creative-networking-evening-gallery',
    category: 'Community',
    title: 'Creative Networking Evening',
    description: 'Meeting makers, founders, and future collaborators in a relaxed setting.',
    detail: 'Previously Conducted • 110+ Students',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'innovation-challenge-gallery',
    category: 'Competition',
    title: 'Innovation Challenge',
    description: 'Turning student ideas into bold prototypes and brave new concepts.',
    detail: 'Previously Conducted • 85+ Students',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'build-break-hackathon-gallery',
    category: 'Hackathon',
    title: 'Build & Break Hackathon',
    description: 'A problem-solving sprint where creativity meets technology.',
    detail: 'Previously Conducted • 130+ Students',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ai-for-students-workshop-gallery',
    category: 'Workshop',
    title: 'AI for Students Workshop',
    description: 'Learning how to use AI thoughtfully for design, creativity, and productivity.',
    detail: 'Previously Conducted • 100+ Students',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'design-jam-night-gallery',
    category: 'Event',
    title: 'Design Jam Night',
    description: 'Rapid concepting, visual experiments, and real peer feedback.',
    detail: 'Previously Conducted • 140+ Students',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'web-development-bootcamp-gallery',
    category: 'Workshop',
    title: 'Web Development Bootcamp',
    description: 'From idea to interface, students build and iterate in real time.',
    detail: 'Previously Conducted • 180+ Students',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'student-innovation-meetup-gallery',
    category: 'Community',
    title: 'Student Innovation Meetup',
    description: 'Sharing ideas, prototypes, and early-stage projects across majors.',
    detail: 'Previously Conducted • 160+ Students',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
  },
]

// eslint-disable-next-line no-unused-vars
const statsHighlights = [
  { value: 35, suffix: '+', label: 'Events Conducted' },
  { value: 500, suffix: '+', label: 'Student Participants' },
  { value: 15, suffix: '+', label: 'Workshops' },
  { value: 2, suffix: '+', label: 'Hackathons' },
]

const designJamActivity = activities.find((activity) => activity.id === 'design-jam-night')

const heroEvents = [
  {
    id: 'poster-design-challenge',
    label: 'Poster',
    title: 'Challenge',
    activity: activities.find((activity) => activity.id === 'poster-design-challenge'),
  },
  {
    id: 'open-mic-night',
    label: 'Open Mic',
    title: 'Stage',
    activity: activities.find((activity) => activity.id === 'open-mic-night'),
  },
  {
    id: 'design-jam-night',
    label: 'Live this week',
    title: 'Design Jam Night',
    activity: designJamActivity,
  },
]

// eslint-disable-next-line no-unused-vars
function AnimatedCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    if (!counterRef.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(counterRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return undefined

    let rafId = 0
    let startTime = null
    const duration = 1400

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.round(value * progress))

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step)
      }
    }

    rafId = window.requestAnimationFrame(step)

    return () => window.cancelAnimationFrame(rafId)
  }, [hasAnimated, value])

  return (
    <div className="stat-card" ref={counterRef}>
      <strong>{count}{suffix}</strong>
      <span>{label}</span>
    </div>
  )
}

function DetailVisual({ activity }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      className={`detail-visual ${imageFailed ? 'image-fallback' : ''}`}
      style={{ '--card-from': activity.image.from, '--card-to': activity.image.to }}
    >
      {!imageFailed && (
        <img
          src={activity.image.src}
          alt={`${activity.title} event`}
          onError={() => setImageFailed(true)}
        />
      )}
      <span>{activity.title}</span>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function GalleryCard({ event, index }) {
  const handleTilt = (eventObject) => {
    const rect = eventObject.currentTarget.getBoundingClientRect()
    const x = (eventObject.clientX - rect.left) / rect.width
    const y = (eventObject.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 7
    const rotateX = (0.5 - y) * 7

    eventObject.currentTarget.style.transform = `translateY(${index % 3 === 0 ? 0 : index % 3 === 1 ? 18 : -6}px) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const resetTilt = (eventObject) => {
    eventObject.currentTarget.style.transform = ''
  }

  return (
    <article
      className={`gallery-card ${index % 3 === 0 ? 'card-wide' : ''} ${index % 2 === 0 ? 'card-tall' : ''}`}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
    >
      <div className="gallery-image-wrap">
        <img src={event.image} alt={event.title} loading="lazy" />
        <div className="gallery-glow" />
      </div>
      <div className="gallery-body">
        <span className="badge category-badge">{event.category}</span>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="gallery-meta">
          <span>{event.detail}</span>
        </div>
      </div>
    </article>
  )
}

function App() {
  const allActivities = useMemo(() => [...activities, ...hackathons], [])
  const [activeSection, setActiveSection] = useState('Home')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [eventPass, setEventPass] = useState(null)
  const [validationId, setValidationId] = useState('')
  const [validationResult, setValidationResult] = useState(null)
  const [activeHeroEventId, setActiveHeroEventId] = useState('design-jam-night')
  const [successActivity, setSuccessActivity] = useState(null)
  const [cancelTargetId, setCancelTargetId] = useState(null)
  const [toast, setToast] = useState('')
  const [registeredIds, setRegisteredIds] = useState(() => getRegistrations())
  const [registrationRecords, setRegistrationRecords] = useState(() => getRegistrationRecords())
  const [interestedIds, setInterestedIds] = useState(() => getInterests())
  const [authSession, setAuthSession] = useState(() => getAuthSession())
  const [authTarget, setAuthTarget] = useState(null)
  const [confirmationActivity, setConfirmationActivity] = useState(null)
  const [registrationDetailsActivity, setRegistrationDetailsActivity] = useState(null)
  const [registrationDetails, setRegistrationDetails] = useState(null)
  const [downloadingLetter, setDownloadingLetter] = useState('')
  const [letterError, setLetterError] = useState('')
  const [hackathonTeams, setHackathonTeams] = useState(() => getHackathonTeams())
  const [, setPptSubmissions] = useState(() => getPptSubmissions())
  const [teamTarget, setTeamTarget] = useState(null)
  const [teamSuccess, setTeamSuccess] = useState(null)
  const [pptTarget, setPptTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem('diseno-divino-registrations', JSON.stringify(registeredIds))
  }, [registeredIds])

  useEffect(() => {
    localStorage.setItem('diseno-divino-interests', JSON.stringify(interestedIds))
  }, [interestedIds])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const featuredActivities = useMemo(
    () => activities.filter((activity) => activity.featured).slice(0, 3),
    [],
  )

  const filteredActivities = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return allActivities.filter((activity) => {
      const activityDate = new Date(`${activity.date}T00:00:00`)
      const daysFromToday = (activityDate - startOfToday) / (1000 * 60 * 60 * 24)
      const matchesSearch =
        !normalized ||
        activity.title.toLowerCase().includes(normalized) ||
        activity.shortDescription.toLowerCase().includes(normalized) ||
        activity.location.toLowerCase().includes(normalized)

      if (!matchesSearch) return false

      if (selectedFilter === 'All') return true

      if (Object.keys(mappedCategories).includes(selectedFilter)) {
        return activity.category === mappedCategories[selectedFilter]
      }

      if (selectedFilter === 'Upcoming') {
        return daysFromToday >= 0
      }

      if (selectedFilter === 'This Week') {
        return daysFromToday >= 0 && daysFromToday <= 7
      }

      if (selectedFilter === 'This Month') {
        return daysFromToday >= 0 && daysFromToday <= 30
      }

      return true
    })
  }, [allActivities, searchTerm, selectedFilter])

  const registeredActivities = useMemo(
    () => authSession?.user ? activities.filter((activity) => registeredIds.includes(activity.id)) : [],
    [authSession, registeredIds],
  )

  const interestedActivities = useMemo(
    () => authSession?.user ? activities.filter((activity) => interestedIds.includes(activity.id)) : [],
    [authSession, interestedIds],
  )

  const registeredHackathons = useMemo(
    () => hackathons.filter((hackathon) => hackathonTeams.some((team) => team.hackathonId === hackathon.id && team.leaderId === authSession?.user?.id)),
    [authSession, hackathonTeams],
  )

  const getDisplayedRegisteredCount = (activity) => Math.min(
    activity.registeredCount + (registeredIds.includes(activity.id) ? 1 : 0),
    activity.capacity,
  )

  const handleTeamRegister = (hackathon) => {
    if (hackathon.registeredCount >= hackathon.capacity) {
      showToast('This hackathon is currently full.')
      return
    }
    if (!authSession?.user) {
      setAuthTarget(hackathon)
      return
    }
    const existingTeam = getTeamForHackathon(authSession.user.id, hackathon.id)
    if (existingTeam) {
      setTeamSuccess({ hackathon, team: existingTeam })
      return
    }
    setTeamTarget(hackathon)
  }

  const handleTeamRegistered = (team) => {
    saveHackathonTeam({ ...team, hackathonId: teamTarget.id, leaderId: authSession.user.id })
    const nextTeams = getHackathonTeams()
    setHackathonTeams(nextTeams)
    setTeamSuccess({ hackathon: teamTarget, team: nextTeams[nextTeams.length - 1] })
    setTeamTarget(null)
  }

  const handlePptSubmitted = (submission) => {
    savePptSubmission({ ...submission, teamId: pptTarget.team.id, hackathonId: pptTarget.hackathon.id, leaderId: authSession.user.id })
    setPptSubmissions(getPptSubmissions())
    setPptTarget(null)
    showToast('Round 1 submitted successfully.')
  }

  const handleNavigate = (title) => {
    setActiveSection(title)
    setMobileMenuOpen(false)

    let sectionId = 'home'
    if (title === 'Explore') sectionId = 'explore'
    if (title === 'About') sectionId = 'about'
    if (title === 'Leaderboard') sectionId = 'leaderboard'
    if (title === 'My Activities') sectionId = 'my-activities'

    const section = document.getElementById(sectionId)
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleActivityFilter = (filter) => {
    setSelectedFilter(filter)
    setActiveSection('Explore')
    setMobileMenuOpen(false)
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const showToast = (message) => setToast(message)

  const handleToggleInterest = (activityId) => {
    const added = persistInterest(activityId)
    setInterestedIds(getInterests())
    showToast(added ? 'Added to your interests.' : 'Removed from interests.')
  }

  const handleRegisterClick = (activity) => {
    if (!authSession?.user) {
      setAuthTarget(activity)
      return
    }
    setRegistrationDetailsActivity(activity)
  }

  const handleAuthenticated = (user) => {
    setAuthSession({ user })
    const activity = authTarget
    setAuthTarget(null)
    if (activity?.isHackathon) setTeamTarget(activity)
    else if (activity) setRegistrationDetailsActivity(activity)
  }

  const handleRegistrationDetails = (details) => {
    const updatedUser = updateAuthProfile(authSession.user.id, details)
    setAuthSession({ user: updatedUser })
    setRegistrationDetails(details)
    setRegistrationDetailsActivity(null)
    setConfirmationActivity(registrationDetailsActivity)
  }

  const handleConfirmRegistration = () => {
    if (!confirmationActivity || !authSession?.user) return
    if (registeredIds.includes(confirmationActivity.id)) return
    const record = persistRegistration(confirmationActivity.id, authSession.user, registrationDetails)
    setRegisteredIds(getRegistrations())
    setRegistrationRecords(getRegistrationRecords())
    setSuccessActivity({ ...confirmationActivity, registrationDetails: { ...authSession.user, ...registrationDetails }, record })
    setConfirmationActivity(null)
    setRegistrationDetails(null)
    setSelectedActivity(null)
    showToast("You're in! Registration confirmed.")
  }

  const handleLogout = () => {
    signOut()
    setAuthSession(null)
  }

  const handleDownloadLetter = async (activity, details = authSession?.user) => {
    if (!activity || !details || downloadingLetter) return
    setLetterError('')
    setDownloadingLetter(activity.id)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 120))
      await downloadAttendanceLetter({
        activity,
        user: authSession.user,
        details,
        registeredCount: getDisplayedRegisteredCount(activity),
      })
    } catch {
      setLetterError('Unable to generate the attendance letter. Please try again.')
    } finally {
      setDownloadingLetter('')
    }
  }

  const getRegistrationDetails = (activity) => {
    const record = getRegistrationRecords().find((item) => item.eventId === activity.id && item.userId === authSession?.user?.id)
    return record || authSession?.user
  }

  const openEventPass = (activity) => {
    const record = getRegistrationRecords().find((item) => item.eventId === activity.id && item.userId === authSession?.user?.id)
    if (record) setEventPass({ activity, record })
  }

  const handleValidatePass = (event) => {
    event.preventDefault()
    const record = getRegistrationRecords().find((item) => item.registrationId?.toUpperCase() === validationId.trim().toUpperCase())
    if (!record) {
      setValidationResult({ valid: false })
      return
    }
    const activity = allActivities.find((item) => item.id === record.eventId)
    const updated = updateAttendanceStatus(record.registrationId)
    setRegistrationRecords(getRegistrationRecords())
    setValidationResult({ valid: true, record: updated, activity })
  }

  const handleCancelRegistration = (activityId) => {
    removeRegistration(activityId)
    setRegisteredIds(getRegistrations())
    setCancelTargetId(null)
    showToast('Registration cancelled.')
  }

  const handleCloseSuccess = () => {
    setSuccessActivity(null)
    setSelectedActivity(null)
  }

  const activeHeroEvent = heroEvents.find((event) => event.id === activeHeroEventId) || heroEvents[2]
  const inactiveHeroEvents = heroEvents.filter((event) => event.id !== activeHeroEvent.id)
  const activeHeroCount = getDisplayedRegisteredCount(activeHeroEvent.activity)

  return (
    <div className="app-shell">
      <BackgroundScene />
      <Navbar
        onNavigate={handleNavigate}
        onActivityFilter={handleActivityFilter}
        activeSection={activeSection}
        activeFilter={selectedFilter}
        onOpenMenu={setMobileMenuOpen}
        isMobileMenuOpen={mobileMenuOpen}
        authUser={authSession?.user}
        onLogout={handleLogout}
      />

      <main>
        <section id="home" className="hero-section section-shell">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">Creative community • Student energy</div>
              <div className="hero-logo-lockup" aria-label="Diseño Divino logo">
                <span className="logo-line top">Diseño</span>
                <span className="logo-line bottom">Divino</span>
              </div>
              <h1>
                Create.<br />
                Connect.<br />
                Discover.
              </h1>
              <p>
                Diseño Divino brings together students through thoughtful workshops, expressive events,
                and meaningful experiences designed to spark creativity and connection.
              </p>
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={() => handleNavigate('Explore')}>
                  Explore Activities
                </button>
                <button type="button" className="secondary-button" onClick={() => handleNavigate('About')}>
                  About Us
                </button>
              </div>
              <div className="tiny-trust">
                <span>80+ student artists</span>
                <span>18 curated experiences</span>
              </div>
            </div>

            <div
              className="hero-art"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                const x = (event.clientX - rect.left) / rect.width
                const y = (event.clientY - rect.top) / rect.height
                event.currentTarget.style.setProperty('--mx', `${(x - 0.5) * 18}deg`)
                event.currentTarget.style.setProperty('--my', `${(0.5 - y) * 18}deg`)
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.setProperty('--mx', '0deg')
                event.currentTarget.style.setProperty('--my', '0deg')
              }}
            >
              <div className="hero-scene" aria-hidden="true">
                <div className="orb orb-one" />
                <div className="orb orb-two" />
                <div className="ring ring-one" />
                <div className="ring ring-two" />
                <div className="cube cube-one" />
                <div className="cube cube-two" />
              </div>
              <div className="hero-event-showcase">
                <div className="hero-preview-row" aria-label="Choose a featured event">
                  {inactiveHeroEvents.map((event) => (
                    <button
                      type="button"
                      className="hero-event-preview"
                      key={event.id}
                      onMouseEnter={() => setActiveHeroEventId(event.id)}
                      onFocus={() => setActiveHeroEventId(event.id)}
                      onClick={() => setActiveHeroEventId(event.id)}
                    >
                      <img src={event.activity.image.src} alt="" loading="lazy" />
                      <span className="hero-preview-overlay" />
                      <span className="hero-preview-content">
                        <small>{event.label}</small>
                        <strong>{event.title}</strong>
                      </span>
                    </button>
                  ))}
                </div>

                <article className="hero-main-event" key={activeHeroEvent.id}>
                  <img className="hero-main-event-image" src={activeHeroEvent.activity.image.src} alt={`${activeHeroEvent.title} event`} loading="lazy" />
                  <div className="hero-main-event-overlay" />
                  <div className="hero-main-event-content">
                    <div className="mini-tag">{activeHeroEvent.label}</div>
                    <span className="badge category-badge">{activeHeroEvent.activity.category}</span>
                    <h3>{activeHeroEvent.title}</h3>
                    <p className="hero-main-event-time">
                      {new Date(activeHeroEvent.activity.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {activeHeroEvent.activity.time}
                    </p>
                    <div className="hero-event-details">
                      <span>{activeHeroEvent.activity.location}</span>
                      <span>{activeHeroCount} / {activeHeroEvent.activity.capacity} spots filled</span>
                      <span>{Math.max(activeHeroEvent.activity.capacity - activeHeroCount, 0)} spots left</span>
                    </div>
                    <CapacityMeter capacity={activeHeroEvent.activity.capacity} registeredCount={activeHeroCount} />
                    <button type="button" className="ghost-button small" onClick={() => setSelectedActivity(activeHeroEvent.activity)}>
                      View Details
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section section-shell">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow">Featured experiences</span>
                <h2>Upcoming Activities</h2>
              </div>
              <button type="button" className="text-button inline" onClick={() => handleNavigate('Explore')}>
                View all
              </button>
            </div>

            <div className="featured-grid">
              {featuredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  registeredCount={getDisplayedRegisteredCount(activity)}
                  isInterested={interestedIds.includes(activity.id)}
                  isRegistered={registeredIds.includes(activity.id)}
                  onViewDetails={setSelectedActivity}
                  onToggleInterest={handleToggleInterest}
                  onRegister={handleTeamRegister}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="why-section section-shell">
          <div className="container">
            <div className="section-header align-left">
              <span className="eyebrow">Why join</span>
              <h2>Culture that grows with you.</h2>
            </div>

            <div className="benefit-layout">
              <div className="benefit-spotlight">
                <div className="spotlight-card">
                  <div className="spotlight-image">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
                      alt="Students collaborating around a creative project"
                      loading="lazy"
                    />
                  </div>
                  <div className="spotlight-content">
                    <span className="spotlight-kicker">This semester</span>
                    <h3>Creative momentum in motion.</h3>
                    <p>
                      Students come for the ideas and stay for the people, the peer energy, and the work that moves them forward.
                    </p>
                  </div>
                </div>
              </div>

              <div className="benefits-grid">
                {[
                  ['Learn', 'Build real creative skills through workshops, critiques, and hands-on learning.'],
                  ['Connect', 'Meet designers, makers, storytellers, and future collaborators.'],
                  ['Create', 'Take part in experiments, challenges, and community-driven projects.'],
                  ['Showcase', 'Share your work in a space that values originality and voice.'],
                ].map(([title, description]) => (
                  <div className="benefit-card" key={title}>
                    <span className="benefit-number">0{title === 'Learn' ? 1 : title === 'Connect' ? 2 : title === 'Create' ? 3 : 4}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section section-shell">
          <div className="container stats-grid">
            {[
              ['35+', 'Events conducted'],
              ['1,200', 'Active student members'],
              ['18', 'Workshops organized'],
              ['92%', 'Participation satisfaction'],
            ].map(([value, label]) => (
              <div className="stat-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="explore" className="explore-section section-shell">
          <div className="container">
            <div className="explore-intro reveal-block">
              <span className="eyebrow">EXPLORE</span>
              <h2>Find your next experience.</h2>
              <p>
                Discover workshops, events, competitions, and community moments designed to help students learn, build, and connect.
              </p>
            </div>

            <div className="explore-toolbar reveal-block">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>

            <div className="filter-row reveal-block" aria-label="Filter activities">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={selectedFilter === option ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setSelectedFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="explore-grid reveal-block">
              {filteredActivities.length ? (
                filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    registeredCount={getDisplayedRegisteredCount(activity)}
                    isInterested={interestedIds.includes(activity.id)}
                    isRegistered={registeredIds.includes(activity.id)}
                    onViewDetails={setSelectedActivity}
                    onToggleInterest={handleToggleInterest}
                    onRegister={activity.isHackathon ? handleTeamRegister : undefined}
                  />
                ))
              ) : (
                <div className="empty-state wide">
                  <h3>No activities match that search.</h3>
                  <p>Try a different keyword or switch back to all experiences.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Leaderboard records={registrationRecords} activities={allActivities} currentUserId={authSession?.user?.id} />

        <section id="my-activities" className="dashboard-section section-shell">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow">My Activities</span>
                <h2>Your creative calendar</h2>
              </div>
            </div>

            {registeredActivities.length === 0 && interestedActivities.length === 0 && registeredHackathons.length === 0 ? (
              <div className="empty-state">
                <h3>No activities yet.</h3>
                <p>Register or save an event to keep track of what you want to attend.</p>
                <button type="button" className="primary-button" onClick={() => handleNavigate('Explore')}>
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="dashboard-grid">
                <div className="dashboard-panel">
                  <h3>Registered</h3>
                  {registeredActivities.length ? (
                    <div className="mini-list">
                      {registeredActivities.map((activity) => (
                        <div className="mini-card" key={activity.id}>
                          <div>
                            <strong>{activity.title}</strong>
                            <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="mini-actions">
                            <button type="button" className="secondary-button small" onClick={() => handleDownloadLetter(activity, getRegistrationDetails(activity))} disabled={Boolean(downloadingLetter)}>
                              {downloadingLetter === activity.id ? 'Generating...' : 'Download Letter'}
                            </button>
                            <button type="button" className="text-button" onClick={() => setSelectedActivity(activity)}>
                              View Event
                            </button>
                            <button type="button" className="secondary-button small" onClick={() => setCancelTargetId(activity.id)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">No registrations yet.</p>
                  )}
                </div>

                <div className="dashboard-panel">
                  <h3>Interested</h3>
                  {interestedActivities.length ? (
                    <div className="mini-list">
                      {interestedActivities.map((activity) => (
                        <div className="mini-card" key={activity.id}>
                          <div>
                            <strong>{activity.title}</strong>
                            <span>{activity.category}</span>
                          </div>
                          <button type="button" className="text-button" onClick={() => setSelectedActivity(activity)}>
                            View Event
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">You haven’t marked anything as interested.</p>
                  )}
                </div>
              </div>
            )}
            {registeredHackathons.length > 0 && (
              <div className="hackathon-dashboard">
                <div className="section-header"><div><span className="eyebrow">Team registrations</span><h3>My Hackathons</h3></div></div>
                <div className="hackathon-dashboard-grid">
                  {registeredHackathons.map((hackathon) => {
                    const team = getTeamForHackathon(authSession.user.id, hackathon.id)
                    const submission = team && getSubmissionForTeam(team.id)
                    return <div className="hackathon-mini-card" key={hackathon.id}><div><strong>{hackathon.title}</strong><span>Team: {team.teamName}</span><span>Members: {team.members.length} / 5</span></div><div className="mini-actions"><span className={submission ? 'submission-complete' : 'submission-pending'}>{submission ? 'Round 1: Submitted' : 'Round 1: Pending'}</span><button type="button" className="text-button" onClick={() => setTeamSuccess({ hackathon, team })}>View Team</button>{submission ? <button type="button" className="text-button" onClick={() => setPptTarget({ hackathon, team })}>View Submission</button> : <button type="button" className="secondary-button small" onClick={() => setPptTarget({ hackathon, team })}>Submit PPT</button>}</div></div>
                  })}
                </div>
              </div>
            )}
            {registeredActivities.length > 0 && (
              <div className="passes-section">
                <div className="section-header"><div><span className="eyebrow">Digital access</span><h3>My Event Passes</h3></div></div>
                <div className="passes-grid">
                  {registeredActivities.map((activity) => {
                    const record = getRegistrationDetails(activity)
                    return record.registrationId ? (
                      <article className="pass-mini-card" key={activity.id}>
                        <img src={activity.image.src} alt="" loading="lazy" />
                        <div><span className="badge category-badge">{activity.category}</span><strong>{activity.title}</strong><span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><small>{record.attendanceStatus || 'Not Checked In'}</small></div>
                        <button type="button" className="primary-button small" onClick={() => openEventPass(activity)}>View Pass</button>
                      </article>
                    ) : null
                  })}
                </div>
              </div>
            )}
            <div className="organizer-panel">
              <div className="section-header"><div><span className="eyebrow">Organizer tools</span><h3>Validate Event Pass</h3></div></div>
              <form className="validation-form" onSubmit={handleValidatePass}>
                <input value={validationId} onChange={(event) => setValidationId(event.target.value)} placeholder="Enter registration ID" aria-label="Registration ID" />
                <button type="submit" className="secondary-button">Validate</button>
              </form>
              {validationResult && (validationResult.valid ? <div className="validation-result valid"><strong>Valid pass</strong><span>{validationResult.record.studentName || 'Student'} · {validationResult.activity?.title}</span><span>{validationResult.record.registrationId} · {validationResult.record.attendanceStatus}</span></div> : <div className="validation-result invalid"><strong>Invalid pass</strong><span>Registration ID not found.</span></div>)}
            </div>
          </div>
        </section>

        <section className="cta-section section-shell">
          <div className="container cta-box">
            <div>
              <span className="eyebrow">Something exciting is always happening</span>
              <h2>Keep your creative calendar full.</h2>
            </div>
            <button type="button" className="primary-button" onClick={() => handleNavigate('Explore')}>
              Explore Events
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ChatbotWidget />

      {eventPass && authSession?.user && (
        <DigitalEventPass
          activity={eventPass.activity}
          record={eventPass.record}
          user={authSession.user}
          onClose={() => setEventPass(null)}
          onAddToActivities={() => { setEventPass(null); handleNavigate('My Activities'); showToast('Pass is available in My Activities.') }}
        />
      )}

      {selectedActivity && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="details-title">
          <div className="modal-card activity-detail-card">
            <button type="button" className="close-button" aria-label="Close details" onClick={() => setSelectedActivity(null)}>
              ×
            </button>
            <DetailVisual key={selectedActivity.id} activity={selectedActivity} />

            <div className="detail-content">
              <div className="detail-head">
                <span className="badge category-badge">{selectedActivity.category}</span>
                <button type="button" className="text-button" onClick={() => handleToggleInterest(selectedActivity.id)}>
                  {interestedIds.includes(selectedActivity.id) ? 'Interested ✓' : 'Interested'}
                </button>
              </div>

              <h3 id="details-title">{selectedActivity.title}</h3>
              <p className="detail-description">{selectedActivity.fullDescription}</p>

              {selectedActivity.isHackathon && <div className="hackathon-detail-block"><strong>Theme</strong><p>{selectedActivity.theme}</p><strong>Eligibility</strong><p>{selectedActivity.eligibility}</p><strong>Prizes</strong><p>{selectedActivity.prizes}</p><strong>Round Structure</strong>{selectedActivity.rounds.map((round) => <span key={round}>{round}</span>)}</div>}

              <div className="detail-meta-grid">
                <div><span>Date</span><strong>{new Date(selectedActivity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></div>
                <div><span>Time</span><strong>{selectedActivity.time}</strong></div>
                <div><span>Location</span><strong>{selectedActivity.location}</strong></div>
                <div><span>Duration</span><strong>{selectedActivity.duration}</strong></div>
                <div><span>Organizer</span><strong>{selectedActivity.organizer}</strong></div>
                <div><span>Seats</span><strong>{Math.max(selectedActivity.capacity - getDisplayedRegisteredCount(selectedActivity), 0)} left</strong></div>
              </div>

              <div className="detail-sections">
                <div>
                  <h4>What to expect</h4>
                  <ul>
                    {selectedActivity.whatToExpect.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4>Requirements</h4>
                  <ul>
                    {selectedActivity.requirements.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="form-actions modal-actions">
                <button type="button" className="secondary-button" onClick={() => setSelectedActivity(null)}>
                  Close
                </button>
                <button type="button" className="primary-button" onClick={() => selectedActivity.isHackathon ? handleTeamRegister(selectedActivity) : handleRegisterClick(selectedActivity)}>
                  {selectedActivity.isHackathon ? 'Register Team' : 'Register Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successActivity && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className="modal-card success-card">
            <button type="button" className="close-button" onClick={handleCloseSuccess} aria-label="Close registration success">×</button>
            <div className="success-mark">✓</div>
            <h3 id="success-title">You’re in!</h3>
            <p>
              You successfully registered for <strong>{successActivity.title}</strong>.
            </p>
            <div className="success-summary">
              <span>{new Date(successActivity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{successActivity.time}</span>
              <span>{successActivity.location}</span>
            </div>
            <a className="secondary-button directions-button" href="https://maps.app.goo.gl/EsVAGKYEamohgZ2MA" target="_blank" rel="noreferrer">📍 Get Directions</a>
            {successActivity.record && <button type="button" className="primary-button attendance-button" onClick={() => { setSuccessActivity(null); setEventPass({ activity: successActivity, record: successActivity.record }) }}>View My Event Pass</button>}
            <button type="button" className="primary-button attendance-button" onClick={() => handleDownloadLetter(successActivity, successActivity.registrationDetails)} disabled={Boolean(downloadingLetter)}>
              {downloadingLetter === successActivity.id ? 'Generating your attendance letter...' : 'Download Attendance Letter'}
            </button>
            {letterError && <p className="auth-error" role="alert">{letterError}</p>}
            <div className="form-actions modal-actions success-actions">
              <button type="button" className="secondary-button" onClick={() => { handleCloseSuccess(); handleNavigate('My Activities') }}>
                View My Activities
              </button>
              <button type="button" className="primary-button" onClick={handleCloseSuccess}>
                Explore More Events
              </button>
            </div>
          </div>
        </div>
      )}

      {authTarget && !authSession?.user && (
        <AuthModal onClose={() => setAuthTarget(null)} onAuthenticated={handleAuthenticated} />
      )}

      {registrationDetailsActivity && authSession?.user && (
        <RegistrationDetailsModal
          activity={registrationDetailsActivity}
          user={authSession.user}
          initialDetails={registrationDetails}
          onClose={() => setRegistrationDetailsActivity(null)}
          onContinue={handleRegistrationDetails}
        />
      )}

      {confirmationActivity && authSession?.user && (
        <RegistrationConfirmModal
          activity={confirmationActivity}
          user={authSession.user}
          registrationDetails={registrationDetails}
          registeredCount={getDisplayedRegisteredCount(confirmationActivity)}
          alreadyRegistered={registeredIds.includes(confirmationActivity.id)}
          onClose={() => setConfirmationActivity(null)}
          onConfirm={handleConfirmRegistration}
          onViewActivities={() => {
            setConfirmationActivity(null)
            handleNavigate('My Activities')
          }}
        />
      )}

      {teamTarget && authSession?.user && <TeamRegistrationModal hackathon={teamTarget} user={authSession.user} onClose={() => setTeamTarget(null)} onRegistered={handleTeamRegistered} />}

      {teamSuccess && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="team-success-title">
          <div className="modal-card success-card">
            <button type="button" className="close-button" onClick={() => setTeamSuccess(null)} aria-label="Close team registration success">×</button>
            <div className="success-mark">✓</div>
            <h3 id="team-success-title">Team Registered Successfully!</h3>
            <p>Your team is successfully registered for <strong>{teamSuccess.hackathon.title}</strong>.</p>
            <div className="success-summary"><span>Team: {teamSuccess.team.teamName}</span><span>Members: {teamSuccess.team.members.length} / 5</span></div>
            <div className="form-actions modal-actions success-actions"><button type="button" className="secondary-button" onClick={() => setPptTarget({ hackathon: teamSuccess.hackathon, team: teamSuccess.team })}>Submit Round 1 PPT</button><button type="button" className="primary-button" onClick={() => { setTeamSuccess(null); handleNavigate('My Activities') }}>My Activities</button></div>
          </div>
        </div>
      )}

      {pptTarget && authSession?.user && <PptSubmissionModal hackathon={pptTarget.hackathon} team={pptTarget.team} existingSubmission={getSubmissionForTeam(pptTarget.team.id)} onClose={() => setPptTarget(null)} onSubmitted={handlePptSubmitted} />}

      {cancelTargetId && (
        <ConfirmationDialog
          title="Cancel registration?"
          message="This will remove your spot for this activity. You can still join later if you change your mind."
          onCancel={() => setCancelTargetId(null)}
          onConfirm={() => handleCancelRegistration(cancelTargetId)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
