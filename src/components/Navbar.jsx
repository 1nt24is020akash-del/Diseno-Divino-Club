const navItems = ['Home', 'Explore', 'About', 'Leaderboard', 'My Activities']

export default function Navbar({ onNavigate, activeSection, onOpenMenu, isMobileMenuOpen, authUser, onLogout }) {
  const renderNav = (mobile = false) => (
    <nav className={mobile ? 'mobile-nav' : 'desktop-nav'} aria-label="Main navigation">
      {navItems.map((item) => {
        const href = item === 'Home' ? '#' : item === 'Explore' ? '#explore' : item === 'About' ? '#about' : item === 'Leaderboard' ? '#leaderboard' : '#my-activities'
        const isActive = activeSection === item
        return (
          <a key={item} href={href} className={isActive ? 'nav-link active' : 'nav-link'} onClick={() => {
            onNavigate(item)
            if (mobile) onOpenMenu(false)
          }}>
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

        {renderNav(false)}

        <div className="header-actions">
          {authUser && (
            <details className="profile-menu">
              <summary aria-label="Open student profile"><span className="profile-avatar">{authUser.name?.[0]?.toUpperCase() || 'S'}</span><span className="profile-name">{authUser.name}</span></summary>
              <div className="profile-popover"><strong>{authUser.name}</strong><span>{authUser.email}</span><button type="button" className="text-button" onClick={onLogout}>Log out</button></div>
            </details>
          )}
          <button type="button" className="ghost-button" onClick={() => onNavigate('Explore')}>
            Explore Events
          </button>
          <button type="button" className="menu-toggle" aria-label="Toggle menu" onClick={() => onOpenMenu(!isMobileMenuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-wrap">
          <div className="container">
            {renderNav(true)}
          </div>
        </div>
      )}
    </header>
  )
}
