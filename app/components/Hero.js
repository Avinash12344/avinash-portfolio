"use client";

import "../styles/Hero.css";

export default function Hero({ profile }) {
  const name =
    profile?.name || "Avinash Vishwakarma";

  const headline =
    profile?.headline ||
    "Full Stack Developer & Backend Engineer";

  const isAvailable =
    profile?.availability !== false;

  return (
    <section
      id="top"
      className="hero"
      aria-labelledby="hero-title"
    >
      {/* Background atmosphere */}
      <div className="hero__background" aria-hidden="true">
        <div className="hero__orb hero__orb--one" />
        <div className="hero__orb hero__orb--two" />

        <div className="hero__cube hero__cube--one" />
        <div className="hero__cube hero__cube--two" />
        <div className="hero__cube hero__cube--three" />
        <div className="hero__cube hero__cube--four" />

        <div className="hero__glow" />
      </div>

      <div className="hero__content">
        <div className="hero__availability">
          <span
            className="hero__availability-dot"
            aria-hidden="true"
          />

          {isAvailable
            ? "Available for freelance work"
            : "Currently unavailable"}
        </div>

        <p className="hero__eyebrow">
          Full Stack Developer
        </p>

        <h1
          id="hero-title"
          className="hero__title"
        >
          {name}
        </h1>

        <p className="hero__role">
          {headline}
        </p>

        <div className="hero__featured">
          <span className="hero__featured-label">
            AVAILABLE FOR
          </span>

          <div className="hero__featured-items">
            <span>WEB DEVELOPMENT</span>
            <span>BACKEND SYSTEMS</span>
            <span>SHOPIFY</span>
            <span>BUG FIXING</span>
          </div>
        </div>
      </div>

      <div className="hero__bottom">
        <div className="hero__socials">
          <a
            href="https://github.com/Avinash12344"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/avinash-vishwakarma-59b7a71b3"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>

        <a
          href="#services"
          className="hero__scroll"
          aria-label="Scroll to expertise"
        >
          <span className="hero__scroll-mouse">
            <span />
          </span>
        </a>

        <span className="hero__section-number">
          01
        </span>
      </div>
    </section>
  );
}