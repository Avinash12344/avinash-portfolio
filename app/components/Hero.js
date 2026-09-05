"use client";

import { useEffect, useState } from "react";
import "../styles/Hero.css";
import { getProfile } from "../lib/api";

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();
        setProfile(response?.data || null);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Unable to load profile.");
      }
    }

    loadProfile();
  }, []);

  const name =
    profile?.name ||
    "Avinash Vishwakarma";

  const headline =
    profile?.headline ||
    "I build web applications & backend systems.";

  const description =
    profile?.short_description ||
    "I'm a developer focused on building modern web applications, reliable APIs, and scalable backend systems that solve real business problems.";

  return (
    <section className="hero">
      <div className="container hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow">
            Hi, my name is
          </p>

          <h1 className="hero__title">
            {name}.
          </h1>

          <h2 className="hero__subtitle">
            {headline}
          </h2>

          <p className="hero__description">
            {description}
          </p>

          <div className="hero__actions">
            <a
              href="#contact"
              className="hero__button hero__button--primary"
            >
              Hire Me
            </a>

            <a
              href="#work"
              className="hero__button hero__button--secondary"
            >
              View My Work
            </a>
          </div>

          <div className="hero__socials">
            <a
              href="https://github.com/Avinash12344"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/avinash-vishwakarma-2b0a1b1b6/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          {error && (
            <p className="hero__error">
              {error}
            </p>
          )}
        </div>
      </div>

      <a
        href="#about"
        className="hero__scroll"
      >
        <span>Scroll to explore</span>
        <span className="hero__scroll-line" />
      </a>
    </section>
  );
}