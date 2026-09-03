import { useEffect, useRef, useState } from 'react'

const navItems = ['Home', 'Explore', 'About', 'Leaderboard', 'My Activities', 'My Certificates']
const activityItems = ['Workshops', 'Events', 'Competitions', 'Upcoming']

export default function Navbar({ onNavigate, onActivityFilter, activeSection, activeFilter, onOpenMenu, isMobileMenuOpen, authUser, onLogout, notificationBell }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    if (!profileOpen) return undefined
    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [profileOpen])
  const renderNav = () => (
    <nav className="desktop-nav" aria-label="Main navigation">
      {navItems.map((item) => {
        const href = item === 'Home' ? '#' : item === 'Explore' ? '#explore' : item === 'About' ? '#about' : item === 'Leaderboard' ? '#leaderboard' : item === 'My Certificates' ? '/certificates' : '/profile'
        const isActive = activeSection === item
        return (
          <a key={item} href={href} className={isActive ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate(item)}>
            {item}
          </a>
        )
      })}
    </nav>
  )

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="brand" onClick={() => onNavigate('Home')} aria-label="Diseño Divino home">
          <span className="brand-lockup" aria-label="Diseño Divino">
            <span className="brand-first">Diseño</span>
            <span className="brand-second">Divino</span>
          </span>
        </a>

        {renderNav()}

        <div className="header-actions">
          {notificationBell}
          {authUser && (
            <details className="profile-menu" ref={profileMenuRef} open={profileOpen}>
              <summary aria-label="Open student profile" onClick={(event) => { event.preventDefault(); setProfileOpen((value) => !value) }}><span className="profile-avatar">{authUser.name?.[0]?.toUpperCase() || 'S'}</span><span className="profile-name">{authUser.name}</span></summary>
              <div className="profile-popover"><strong>{authUser.name}</strong><span>{authUser.email}</span><button type="button" className="text-button" onClick={() => { setProfileOpen(false); onNavigate('My Profile') }}>👤 My Profile</button><button type="button" className="text-button" onClick={() => { setProfileOpen(false); onLogout() }}>🚪 Sign Out</button></div>
            </details>
          )}
          <button type="button" className="ghost-button" onClick={() => onNavigate('Explore')}>
            Explore Events
          </button>
          <button type="button" className="menu-toggle" aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} onClick={() => onOpenMenu(!isMobileMenuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav className="mobile-primary-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const href = item === 'Home' ? '#' : item === 'Explore' ? '#explore' : item === 'About' ? '#about' : item === 'Leaderboard' ? '#leaderboard' : item === 'My Certificates' ? '/certificates' : '/profile'
          return <a key={item} href={href} className={activeSection === item ? 'active' : ''} onClick={() => onNavigate(item)}>{item}</a>
        })}
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu-layer">
          <button type="button" className="mobile-menu-backdrop" aria-label="Close activity menu" onClick={() => onOpenMenu(false)} />
          <div className="mobile-menu-wrap">
            <div className="mobile-menu-heading"><span>Browse activities</span><button type="button" aria-label="Close activity menu" onClick={() => onOpenMenu(false)}>×</button></div>
            <nav className="mobile-activity-nav" aria-label="Activity navigation">
              {activityItems.map((item) => <a key={item} href="#explore" className={activeFilter === item ? 'active' : ''} onClick={() => onActivityFilter(item)}>{item}<span aria-hidden="true">↗</span></a>)}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
