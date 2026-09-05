"use client";

import { useState } from "react";
import "../styles/Contact.css";
import { createEnquiry } from "../lib/api";

const INITIAL_FORM = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] =
    useState(INITIAL_FORM);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const message =
      form.message.trim();

    if (!name) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!form.projectType) {
      setError(
        "Please select a project type."
      );
      return;
    }

    if (!message) {
      setError(
        "Please tell me about your project."
      );
      return;
    }

    try {
      setLoading(true);

      await createEnquiry({
        name,
        email,
        projectType: form.projectType,
        budget: form.budget || null,
        message,
      });

      setSuccess(
        "Thanks! Your enquiry has been sent successfully. I'll get back to you soon."
      );

      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(
        "Failed to submit enquiry:",
        error
      );

      setError(
        error.message ||
          "Unable to send your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="contact"
      aria-labelledby="contact-title"
    >
      <div className="container">

        <p className="eyebrow">
          07. Contact
        </p>

        <div className="contact__grid">

          {/* ====================================
              CONTENT
          ==================================== */}

          <div className="contact__content">

            <h2
              id="contact-title"
              className="section-title"
            >
              Let's build something{" "}
              <span>together.</span>
            </h2>

            <p>
              Have a project, idea, or technical
              problem you'd like help with? Tell me
              a little about it and I'll get back to
              you.
            </p>

            <div className="contact__details">

              <a href="mailto:your-email@example.com">
                avinashvishwakarmawork@gmail.com
              </a>

              <a
                href="https://github.com/Avinash12344"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/avinash-vishwakarma-59b7a71b3"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>

            </div>

          </div>


          {/* ====================================
              FORM
          ==================================== */}

          <form
            className="contact__form"
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="form__group">

              <label htmlFor="name">
                Name
              </label>

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


            <div className="form__group">

              <label htmlFor="email">
                Email
              </label>

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


            <div className="form__row">

              <div className="form__group">

                <label htmlFor="projectType">
                  Project Type
                </label>

                <select
                  id="projectType"
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="web-app">
                    Web Application
                  </option>

                  <option value="backend">
                    Backend / API
                  </option>

                  <option value="shopify">
                    Shopify
                  </option>

                  <option value="bug-fix">
                    Bug Fix / Improvement
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>


              <div className="form__group">

                <label htmlFor="budget">
                  Budget
                </label>

                <select
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="under-10k">
                    Under ₹10K
                  </option>

                  <option value="10k-25k">
                    ₹10K – ₹25K
                  </option>

                  <option value="25k-50k">
                    ₹25K – ₹50K
                  </option>

                  <option value="50k-plus">
                    ₹50K+
                  </option>

                  <option value="discuss">
                    Let's discuss
                  </option>
                </select>

              </div>

            </div>


            <div className="form__group">

              <label htmlFor="message">
                Tell me about your project
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                placeholder="What are you trying to build?"
                disabled={loading}
              />

            </div>


            {/* FEEDBACK */}

            {error && (
              <div
                className="contact__message contact__message--error"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="contact__message contact__message--success"
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
              {loading
                ? "Sending..."
                : "Send Enquiry"}

              {!loading && (
                <span>→</span>
              )}
            </button>

          </form>

        </div>
      </div>
    </section>
  );
}