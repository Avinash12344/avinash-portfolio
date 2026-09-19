"use client";

import { useState } from "react";

import "../styles/Contact.css";
import { createEnquiry } from "../lib/api";

const INITIAL_FORM = {
  name: "",
  email: "",
  projectType: "",
  message: "",
  website: "", // honeypot
};

const PROJECT_TYPES = [
  { value: "web-app", label: "Web Application" },
  { value: "backend", label: "Backend / API" },
  { value: "shopify", label: "Shopify" },
  { value: "bug-fix", label: "Bug Fix / Improvement" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (error) setError("");
    if (success) setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Honeypot — silently accept if filled
    if (form.website.trim() !== "") {
      setSuccess("Thanks! Your enquiry has been sent.");
      setForm(INITIAL_FORM);
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name) return setError("Please enter your name.");
    if (!email) return setError("Please enter your email.");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!form.projectType) return setError("Please select a project type.");
    if (!message) return setError("Please tell me about your project.");

    try {
      setLoading(true);

      await createEnquiry({
        name,
        email,
        projectType: form.projectType,
        message,
      });

      setSuccess("Thanks! Your enquiry has been sent. I'll be in touch soon.");
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      setError(
        err?.message || "Unable to send your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="contact__label">Contact</p>

        {/* ----------------------------------------
            GRID
            ---------------------------------------- */}

        <div className="contact__grid">
          {/* --------------------------------
              LEFT — CONTENT
              -------------------------------- */}

          <div className="contact__content">
            <h2 id="contact-title" className="contact__heading">
              Let&rsquo;s build
              <br />
              something <em>together.</em>
            </h2>

            <p className="contact__lead">
              Have a project, idea, or technical problem you&rsquo;d
              like help with? Tell me what you&rsquo;re trying to
              build and I&rsquo;ll get back to you with next steps.
            </p>

            <div className="contact__details">
              <a
                href="mailto:avinashvishwakarmawork@gmail.com"
                className="contact__detail"
              >
                <span className="contact__detail-label">Email</span>
                <span className="contact__detail-value">
                  avinashvishwakarmawork@gmail.com
                </span>
              </a>

              <a
                href="https://github.com/Avinash12344"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__detail"
              >
                <span className="contact__detail-label">GitHub</span>
                <span className="contact__detail-value">
                  @Avinash12344 <span aria-hidden="true">↗</span>
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/avinash-vishwakarma-59b7a71b3"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__detail"
              >
                <span className="contact__detail-label">LinkedIn</span>
                <span className="contact__detail-value">
                  Avinash Vishwakarma <span aria-hidden="true">↗</span>
                </span>
              </a>
            </div>
          </div>

          {/* --------------------------------
              RIGHT — FORM
              -------------------------------- */}

          <form
            className="contact__form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Honeypot */}
            <div className="contact__honeypot" aria-hidden="true">
              <label htmlFor="website">Website (leave blank)</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <div className="contact__field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="contact__field">
              <label>Project type</label>

              <div className="contact__chips">
                {PROJECT_TYPES.map((type) => {
                  const isActive = form.projectType === type.value;

                  return (
                    <button
                      type="button"
                      key={type.value}
                      className={
                        isActive
                          ? "contact__chip contact__chip--active"
                          : "contact__chip"
                      }
                      onClick={() => {
                        setForm((c) => ({ ...c, projectType: type.value }));
                        if (error) setError("");
                      }}
                      disabled={loading}
                      aria-pressed={isActive}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="contact__field">
              <label htmlFor="message">Project details</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder="What are you trying to build?"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="contact__feedback contact__feedback--error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div
                className="contact__feedback contact__feedback--success"
                role="status"
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              className="contact__submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send enquiry"}
              {!loading && (
                <span className="contact__submit-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}