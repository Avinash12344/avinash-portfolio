"use client";

import { useEffect, useState } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../../lib/api";
import "./profile.css";

const EMPTY_FORM = {
  name: "",
  headline: "",
  shortDescription: "",
  about: "",
  profileImage: "",
  resumeUrl: "",
  email: "",
  location: "",
  availability: true,
};

export default function ProfilePage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await getAdminProfile();
        const p = res.data || {};

        setForm({
          name: p.name || "",
          headline: p.headline || "",
          shortDescription: p.short_description || "",
          about: p.about || "",
          profileImage: p.profile_image || "",
          resumeUrl: p.resume_url || "",
          email: p.email || "",
          location: p.location || "",
          availability: p.availability !== false,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateAdminProfile(form);
      setSuccess("Profile saved successfully.");
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-state">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <p className="profile-eyebrow">PORTFOLIO CONTENT</p>
          <h1>Profile</h1>
          <p>Your name, headline, bio and contact info.</p>
        </div>
      </div>

      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <section className="profile-section">
          <h2>Identity</h2>

          <div className="profile-grid">
            <label>
              <span>Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                maxLength={100}
              />
            </label>

            <label>
              <span>Location</span>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                maxLength={100}
                placeholder="e.g. Bhopal, India"
              />
            </label>

            <label className="profile-grid--full">
              <span>Headline</span>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => update("headline", e.target.value)}
                required
                minLength={10}
                maxLength={200}
                placeholder="One sentence that sums up what you do"
              />
            </label>

            <label className="profile-grid--full">
              <span>Short Description (for meta tags)</span>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                maxLength={300}
              />
            </label>

            <label className="profile-grid--full">
              <span>About (separate paragraphs with a blank line)</span>
              <textarea
                rows={8}
                value={form.about}
                onChange={(e) => update("about", e.target.value)}
                maxLength={5000}
              />
            </label>
          </div>
        </section>

        <section className="profile-section">
          <h2>Contact & Links</h2>

          <div className="profile-grid">
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </label>

            <label>
              <span>Profile Image URL</span>
              <input
                type="url"
                value={form.profileImage}
                onChange={(e) => update("profileImage", e.target.value)}
                placeholder="https://..."
              />
            </label>

            <label className="profile-grid--full">
              <span>Resume URL</span>
              <input
                type="url"
                value={form.resumeUrl}
                onChange={(e) => update("resumeUrl", e.target.value)}
                placeholder="https://..."
              />
            </label>
          </div>
        </section>

        <section className="profile-section">
          <h2>Availability</h2>

          <label className="profile-checkbox">
            <input
              type="checkbox"
              checked={form.availability}
              onChange={(e) => update("availability", e.target.checked)}
            />
            <span>Open to new projects (shows a green dot on the site)</span>
          </label>
        </section>

        <div className="profile-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}