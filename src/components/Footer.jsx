export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="brand footer-brand">
            <span className="brand-lockup footer-lockup" aria-label="Diseño Divino">
              <span className="brand-first">Diseño</span>
              <span className="brand-second">Divino</span>
            </span>
          </div>
          <p>Creative experiences for curious students.</p>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          <a href="#about">About</a>
          <a href="/profile">My Activities</a>
        </div>
        <div className="social-links" aria-label="Social links">
          <a href="#">Instagram</a>
          <a href="#">Behance</a>
          <a href="#">Campus Hub</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Creative Club • Student Community</span>
        <span>© 2026 Diseño Divino</span>
      </div>
    </footer>
  )
}
