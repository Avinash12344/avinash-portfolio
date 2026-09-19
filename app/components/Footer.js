import Link from "next/link";
import "../styles/Footer.css";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com/Avinash12344",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/avinash-vishwakarma-59b7a71b3",
  },
  {
    label: "Email",
    href: "mailto:avinashvishwakarmawork@gmail.com",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__container">
        {/* ----------------------------------------
            TOP — brand + nav
            ---------------------------------------- */}

        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__brand-name">
              Avinash<span className="footer__brand-dot">.</span>
            </p>

            <p className="footer__brand-tagline">
              Full-stack developer building web apps, APIs, and
              Shopify solutions.
            </p>
          </div>

          <div className="footer__nav">
            <div className="footer__nav-group">
              <p className="footer__nav-label">Navigate</p>

              <ul className="footer__nav-list">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="footer__nav-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-group">
              <p className="footer__nav-label">Connect</p>

              <ul className="footer__nav-list">
                {SOCIAL.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="footer__nav-link"
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {item.label}
                      {item.href.startsWith("http") && (
                        <span aria-hidden="true"> ↗</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ----------------------------------------
            BOTTOM — copyright + back to top
            ---------------------------------------- */}

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} Avinash Vishwakarma
          </p>

          <Link href="/#top" className="footer__top-link">
            Back to top
            <span aria-hidden="true"> ↑</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}