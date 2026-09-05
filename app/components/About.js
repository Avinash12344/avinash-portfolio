"use client";

import { useEffect, useState } from "react";
import "../styles/About.css";
import { getProfile } from "../lib/api";

const highlights = [
  "Modern web application development",
  "REST API & backend development",
  "React / Next.js applications",
  "Shopify application development",
  "Database-driven applications",
  "API integration & debugging",
];

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const response = await getProfile();

        if (mounted) {
          setProfile(response?.data || null);
        }
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

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

        <p className="eyebrow">
          01. About Me
        </p>

        <div className="about__grid">

          {/* ================================
              ABOUT CONTENT
          ================================= */}

          <div className="about__content">

            <h2
              id="about-title"
              className="section-title"
            >
              Building useful things with{" "}
              <span>code.</span>
            </h2>

            {aboutParagraphs.length > 0 ? (
              aboutParagraphs.map(
                (paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              )
            ) : (
              <>
                <p>
                  I'm Avinash Vishwakarma, a
                  software developer focused on
                  building modern web applications,
                  APIs, and backend systems.
                </p>

                <p>
                  I enjoy taking an idea or business
                  requirement and turning it into a
                  clean, functional, and maintainable
                  product.
                </p>

                <p>
                  My experience includes React,
                  JavaScript, Node.js, databases,
                  APIs, and Shopify development.
                </p>
              </>
            )}

            {profile?.location && (
              <p className="about__meta">
                <strong>Location:</strong>{" "}
                {profile.location}
              </p>
            )}

            {profile?.availability !== undefined && (
              <p className="about__meta">
                <strong>Availability:</strong>{" "}
                <span
                  className={
                    profile.availability
                      ? "availability available"
                      : "availability unavailable"
                  }
                >
                  {profile.availability
                    ? "Available for new projects"
                    : "Currently unavailable"}
                </span>
              </p>
            )}

          </div>


          {/* ================================
              HIGHLIGHTS
          ================================= */}

          <aside
            className="about__highlights"
            aria-labelledby="about-highlights-title"
          >
            <p
              id="about-highlights-title"
              className="about__label"
            >
              What I can help with
            </p>

            <ul>
              {highlights.map(
                (highlight) => (
                  <li key={highlight}>
                    <span
                      aria-hidden="true"
                    >
                      ▹
                    </span>

                    <span>
                      {highlight}
                    </span>
                  </li>
                )
              )}
            </ul>
          </aside>

        </div>
      </div>
    </section>
  );
}