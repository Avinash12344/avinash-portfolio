"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createMyWork } from "../../../lib/api";
import "../form.css";

const EMPTY_FORM = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  exceptionalWork: "",
  category: "Web App",
  techStack: "",
  thumbnailUrl: "",
  liveUrl: "",
  githubUrl: "",
  isFeatured: false,
  isPublished: false,
  displayOrder: 0,
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewMyWorkPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };

      // Auto-generate slug from name unless user touched slug manually
      if (field === "name" && autoSlug) {
        next.slug = slugify(value);
      }

      return next;
    });

    if (error) setError("");
  }

  function handleSlugChange(value) {
    setAutoSlug(false);
    update("slug", value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        exceptionalWork: form.exceptionalWork
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        category: form.category.trim() || "Web App",
        techStack: form.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        thumbnailUrl: form.thumbnailUrl.trim(),
        liveUrl: form.liveUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
        displayOrder: Number(form.displayOrder) || 0,
      };

      const res = await createMyWork(payload);
      router.push(`/admin/my-work/${res.data.id}`);
    } catch (err) {
      console.error("Create failed:", err);
      setError(err.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mywork-form-page">
      <div className="mywork-form-header">
        <Link href="/admin/my-work" className="mywork-form-back">
          ← Back to My Work
        </Link>

        <h1>New Project</h1>
        <p>Add a personal project to your public portfolio.</p>
      </div>

      {error && <div className="mywork-form-error">{error}</div>}

      <form className="mywork-form" onSubmit={handleSubmit}>
        <section className="mywork-form-section">
          <h2>Basics</h2>

          <div className="mywork-form-grid">
            <label className="full">
              <span>Project Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                maxLength={200}
                placeholder="e.g. Employee Management System"
              />
            </label>

            <label>
              <span>Slug *</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                maxLength={120}
                placeholder="employee-management-system"
              />
              <small className="mywork-form-hint">
                URL: /work/{form.slug || "your-slug"}
              </small>
            </label>

            <label>
              <span>Category *</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                required
                maxLength={80}
                placeholder="e.g. Web App, Backend, Shopify"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                <option value="Web App" />
                <option value="Backend" />
                <option value="Frontend" />
                <option value="Shopify" />
                <option value="Mobile" />
                <option value="Experiment" />
              </datalist>
            </label>

            <label className="full">
              <span>Tagline</span>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                maxLength={200}
                placeholder="One-liner shown on the card (optional)"
              />
            </label>
          </div>
        </section>

        <section className="mywork-form-section">
          <h2>Overview</h2>

          <div className="mywork-form-grid">
            <label className="full">
              <span>Description</span>
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                maxLength={10000}
                placeholder="Describe the project. Leave a blank line between paragraphs."
              />
            </label>

            <label className="full">
              <span>What I did exceptionally (one bullet per line)</span>
              <textarea
                rows={6}
                value={form.exceptionalWork}
                onChange={(e) => update("exceptionalWork", e.target.value)}
                placeholder={"Shipped solo in 3 weeks\nCut API response from 800ms to 120ms\nHandled 10k concurrent users"}
              />
              <small className="mywork-form-hint">
                Each line becomes a bullet on the case study page.
              </small>
            </label>

            <label className="full">
              <span>Tech stack (comma-separated)</span>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) => update("techStack", e.target.value)}
                placeholder="React, Next.js, Node.js, PostgreSQL"
              />
            </label>
          </div>
        </section>

        <section className="mywork-form-section">
          <h2>Links & Media</h2>

          <div className="mywork-form-grid">
            <label className="full">
              <span>Thumbnail URL</span>
              <input
                type="url"
                value={form.thumbnailUrl}
                onChange={(e) => update("thumbnailUrl", e.target.value)}
                placeholder="https://i.imgur.com/..."
              />
            </label>

            <label>
              <span>Live URL</span>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => update("liveUrl", e.target.value)}
                placeholder="https://..."
              />
            </label>

            <label>
              <span>GitHub URL</span>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => update("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
              />
            </label>
          </div>
        </section>

        <section className="mywork-form-section">
          <h2>Publishing</h2>

          <div className="mywork-form-grid">
            <label>
              <span>Display Order</span>
              <input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) => update("displayOrder", e.target.value)}
              />
              <small className="mywork-form-hint">
                Lower numbers appear first.
              </small>
            </label>

            <div className="mywork-form-checkboxes">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => update("isPublished", e.target.checked)}
                />
                <span>Publish on site</span>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => update("isFeatured", e.target.checked)}
                />
                <span>Mark as featured</span>
              </label>
            </div>
          </div>
        </section>

        <div className="mywork-form-actions">
          <Link href="/admin/my-work" className="mywork-form-cancel">
            Cancel
          </Link>

          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}