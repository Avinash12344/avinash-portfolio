"use client";

import "../styles/About.css";

export default function About({ profile, services }) {
  if (!profile?.name) return null;

  const { about, location, availability } = profile;

  const aboutParagraphs = about
    ? about
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const helpItems = Array.isArray(services)
    ? services.filter((s) => s && s.is_active !== false).slice(0, 6)
    : [];

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container about__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="about__label">About</p>

        {/* ----------------------------------------
            HEADLINE + ASIDE
            ---------------------------------------- */}

        <div className="about__top">
          <h2 id="about-title" className="about__heading">
            I build software that
            <br />
            <em>earns its keep.</em>
          </h2>

          <p className="about__aside">
            Years of shipping web apps, APIs, and Shopify work — the
            kind that runs in production without needing a babysitter.
          </p>
        </div>

        {/* ----------------------------------------
            BODY GRID
            ---------------------------------------- */}

        <div className="about__grid">
          {/* Bio */}
          <div className="about__bio">
            {aboutParagraphs.length > 0 ? (
              aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="about__empty">Bio coming soon.</p>
            )}

            <dl className="about__meta">
              {location && (
                <div className="about__meta-item">
                  <dt>Based in</dt>
                  <dd>{location}</dd>
                </div>
              )}

              {availability !== undefined && (
                <div className="about__meta-item">
                  <dt>Status</dt>
                  <dd>
                    <span
                      className={`about__status ${
                        availability ? "about__status--on" : ""
                      }`}
                    >
                      <span className="about__status-dot" aria-hidden="true" />
                      {availability
                        ? "Open to new projects"
                        : "Currently unavailable"}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Help list */}
          {helpItems.length > 0 && (
            <aside className="about__help" aria-labelledby="about-help-title">
              <h3 id="about-help-title" className="about__help-title">
                What I can help with
              </h3>

              <ul className="about__help-list">
                {helpItems.map((service) => (
                  <li key={service.id} className="about__help-item">
                    {service.title}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}