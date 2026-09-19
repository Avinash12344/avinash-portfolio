"use client";

import "../styles/Hero.css";

export default function Hero({ profile, skills }) {
  if (!profile?.name) return null;

  const { name, headline, availability, location } = profile;

  const activeSkills = Array.isArray(skills)
    ? skills.filter((s) => s && s.is_active !== false).slice(0, 6)
    : [];

  // First name only for the big greeting
  const firstName = name.trim().split(" ")[0];

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero__container">
        {/* --------------------------------------------
            STATUS ROW
            -------------------------------------------- */}

        {(availability !== undefined || location) && (
          <div className="hero__status">
            {availability !== undefined && (
              <span
                className={`hero__availability ${
                  availability ? "hero__availability--on" : ""
                }`}
              >
                <span className="hero__dot" aria-hidden="true" />
                {availability
                  ? "Open to new projects"
                  : "Currently unavailable"}
              </span>
            )}

            {location && (
              <span className="hero__location">Based in {location}</span>
            )}
          </div>
        )}

        {/* --------------------------------------------
            NAME
            -------------------------------------------- */}

        <h1 id="hero-title" className="hero__title">
          <span className="hero__greeting">Hello, I&rsquo;m</span>
          <span className="hero__name">
            {firstName}
            <span className="hero__name-dot">.</span>
          </span>
        </h1>

        {/* --------------------------------------------
            HEADLINE
            -------------------------------------------- */}

        {headline && <p className="hero__headline">{headline}</p>}

        {/* --------------------------------------------
            CTAs
            -------------------------------------------- */}

        <div className="hero__actions">
          <a href="#work" className="hero__cta hero__cta--primary">
            See my work
            <span className="hero__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>

          <a href="#contact" className="hero__cta">
            Get in touch
          </a>
        </div>

        {/* --------------------------------------------
            STACK
            -------------------------------------------- */}

        {activeSkills.length > 0 && (
          <div className="hero__stack">
            <span className="hero__stack-label">Stack</span>

            <div className="hero__stack-items">
              {activeSkills.map((s) => (
                <span key={s.id}>{s.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------
          SOCIALS (bottom)
          -------------------------------------------- */}

      <div className="container hero__socials">
        <div className="hero__socials-group">
          <a
            href="https://github.com/Avinash12344"
            target="_blank"
            rel="noreferrer"
            className="hero__social-link"
          >
            GitHub
            <span aria-hidden="true">↗</span>
          </a>

          <span className="hero__socials-sep" aria-hidden="true">
            /
          </span>

          <a
            href="https://www.linkedin.com/in/avinash-vishwakarma-59b7a71b3"
            target="_blank"
            rel="noreferrer"
            className="hero__social-link"
          >
            LinkedIn
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <span className="hero__year">
          {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}