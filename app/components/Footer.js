import "../styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">

        {/* =========================
            CTA
        ========================= */}

        <div className="footer__cta-section">

          <div className="footer__cta-meta">
            <span className="footer__line" />
            <span>Let's work together</span>
          </div>

          <h2 className="footer__title">
            Have a project
            <span> in mind?</span>
          </h2>

          <p className="footer__description">
            Whether you're building something new,
            improving an existing product, or
            solving a difficult technical problem,
            let's talk about it.
          </p>

          <a
            href="#contact"
            className="footer__cta"
          >
            <span>Start a conversation</span>
            <span
              className="footer__cta-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

        </div>

        {/* =========================
            FOOTER NAVIGATION
        ========================= */}

        <div className="footer__middle">

          <div className="footer__brand">
            <span className="footer__brand-mark">
              AV
            </span>

            <div>
              <strong>
                Avinash Vishwakarma
              </strong>

              <p>
                Software Developer
              </p>
            </div>
          </div>

          <nav
            className="footer__nav"
            aria-label="Footer navigation"
          >
            <div className="footer__nav-group">
              <span className="footer__nav-label">
                Navigate
              </span>

              <a href="#about">
                About
              </a>

              <a href="#services">
                Services
              </a>

              <a href="#skills">
                Skills
              </a>

              <a href="#work">
                Work
              </a>
            </div>

            <div className="footer__nav-group">
              <span className="footer__nav-label">
                Connect
              </span>

              <a href="#contact">
                Contact
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </nav>

        </div>

        {/* =========================
            BOTTOM
        ========================= */}

        <div className="footer__bottom">

          <span>
            © {year} Avinash Vishwakarma
          </span>

          <span>
            Designed & built with React + Next.js
          </span>

          <a href="#top">
            Back to top ↑
          </a>

        </div>

      </div>
    </footer>
  );
}