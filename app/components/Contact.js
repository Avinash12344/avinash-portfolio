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

    /* =================================================
       VALIDATION
       ================================================= */

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

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
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

    /* =================================================
       SUBMIT
       ================================================= */

    try {
      setLoading(true);

      await createEnquiry({
        name,
        email,
        projectType:
          form.projectType,
        budget:
          form.budget || null,
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
        error?.message ||
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

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="contact__header">

          <p className="eyebrow">
            05. Contact
          </p>

          <span className="contact__header-mark">
            LET'S TALK
          </span>

        </div>

        <div className="contact__grid">

          {/* =================================================
              CONTENT
              ================================================= */}

          <div className="contact__content">

            <h2
              id="contact-title"
              className="section-title"
            >
              Let's build
              <br />
              something{" "}
              <span>
                together.
              </span>
            </h2>

            <p>
              Have a project, idea, or
              technical problem you'd
              like help with?
            </p>

            <p>
              Tell me what you're trying
              to build and I'll get back
              to you with the next steps.
            </p>

            {/* CONTACT DETAILS */}

            <div className="contact__details">

              <a
                href="mailto:avinashvishwakarmawork@gmail.com"
              >
                avinashvishwakarmawork@gmail.com
              </a>

              <a
                href="https://github.com/Avinash12344"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <span>↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/avinash-vishwakarma-59b7a71b3"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <span>↗</span>
              </a>

            </div>

          </div>

          {/* =================================================
              FORM
              ================================================= */}

          <form
            className="contact__form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* NAME */}

            <div className="form__group">

              <label htmlFor="name">
                01. Name
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

            {/* EMAIL */}

            <div className="form__group">

              <label htmlFor="email">
                02. Email
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

            {/* PROJECT + BUDGET */}

            <div className="form__row">

              <div className="form__group">

                <label htmlFor="projectType">
                  03. Project Type
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
                  04. Budget
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

            {/* MESSAGE */}

            <div className="form__group">

              <label htmlFor="message">
                05. Tell me about your project
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

            {/* =================================================
                FEEDBACK
                ================================================= */}

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

            {/* =================================================
                SUBMIT
                ================================================= */}

            <button
              type="submit"
              className="contact__submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Sending..."
                  : "Send Enquiry"}
              </span>

              {!loading && (
                <span aria-hidden="true">
                  ↗
                </span>
              )}
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}