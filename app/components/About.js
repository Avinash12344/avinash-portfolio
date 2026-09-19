"use client";

import "../styles/About.css";

const highlights = [
  "Modern web application development",
  "REST API & backend development",
  "React / Next.js applications",
  "Shopify application development",
  "Database-driven applications",
  "API integration & debugging",
];

export default function About({ profile }) {
  const aboutParagraphs = profile?.about
    ? profile.about
        .split("\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  return (
    <section
      id="about"
      className="about"
      aria-labelledby="about-title"
    >
      <div className="container">
        <div className="about__top">
          <p className="eyebrow">01. About Me</p>
    
          <span className="about__top-label">
            DEVELOPER / BUILDER
          </span>
        </div>

        <div className="about__heading">
          <h2 id="about-title">
            Building useful
            <br />
            <span>things with code.</span>
          </h2>

          <div className="about__number">
            <span>01</span>
            <span>ABOUT</span>
          </div>
        </div>

        <div className="about__grid">
          <div className="about__content">
            {aboutParagraphs.length > 0 ? (
              aboutParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  I'm Avinash Vishwakarma, a software
                  developer focused on building modern web
                  applications, APIs, and backend systems.
                </p>

                <p>
                  I enjoy taking an idea or business
                  requirement and turning it into a clean,
                  functional, and maintainable product.
                </p>

                <p>
                  My experience includes React, JavaScript,
                  Node.js, databases, APIs, and Shopify
                  development.
                </p>
              </>
            )}

            <div className="about__meta">
              {profile?.location && (
                <div>
                  <span>LOCATION</span>
                  <strong>{profile.location}</strong>
                </div>
              )}

              {profile?.availability !== undefined && (
                <div>
                  <span>STATUS</span>

                  <strong
                    className={
                      profile.availability
                        ? "availability available"
                        : "availability unavailable"
                    }
                  >
                    <i aria-hidden="true" />
                    {profile.availability
                      ? "Available for new projects"
                      : "Currently unavailable"}
                  </strong>
                </div>
              )}
            </div>
          </div>

          <aside
            className="about__highlights"
            aria-labelledby="about-highlights-title"
          >
            <div className="about__highlights-header">
              <span>02</span>

              <p id="about-highlights-title">
                WHAT I CAN HELP WITH
              </p>
            </div>

            <ul>
              {highlights.map((highlight, index) => (
                <li key={highlight}>
                  <span className="about__highlight-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="about__highlight-text">
                    {highlight}
                  </span>

                  <span
                    className="about__highlight-arrow"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        
      </div>
    </section>
  );
}