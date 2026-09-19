"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  getMyWorkById,
  updateMyWork,
  deleteMyWork,
  addMyWorkImage,
  deleteMyWorkImage,
} from "../../../lib/api";
import "../form.css";

const EMPTY_IMAGE = {
  imageUrl: "",
  altText: "",
  caption: "",
  displayOrder: 0,
};

export default function EditMyWorkPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
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
  });

  const [images, setImages] = useState([]);
  const [imageForm, setImageForm] = useState(EMPTY_IMAGE);
  const [addingImage, setAddingImage] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const res = await getMyWorkById(id);
      const p = res.data;

      setForm({
        slug: p.slug || "",
        name: p.name || "",
        tagline: p.tagline || "",
        description: p.description || "",
        exceptionalWork: (p.exceptional_work || []).join("\n"),
        category: p.category || "Web App",
        techStack: (p.tech_stack || []).join(", "),
        thumbnailUrl: p.thumbnail_url || "",
        liveUrl: p.live_url || "",
        githubUrl: p.github_url || "",
        isFeatured: p.is_featured ?? false,
        isPublished: p.is_published ?? false,
        displayOrder: p.display_order ?? 0,
      });

      setImages(p.images || []);
    } catch (err) {
      console.error("Failed to load project:", err);
      setError(err.message || "Failed to load project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

      await updateMyWork(id, payload);
      setSuccess("Project saved.");
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;

    try {
      await deleteMyWork(id);
      router.push("/admin/my-work");
    } catch (err) {
      alert(err.message || "Failed to delete.");
    }
  }

  async function handleAddImage(e) {
    e.preventDefault();
    setAddingImage(true);
    setError("");

    try {
      const res = await addMyWorkImage(id, {
        imageUrl: imageForm.imageUrl.trim(),
        altText: imageForm.altText.trim(),
        caption: imageForm.caption.trim(),
        displayOrder: Number(imageForm.displayOrder) || 0,
      });

      setImages((current) => [...current, res.data]);
      setImageForm(EMPTY_IMAGE);
    } catch (err) {
      console.error("Add image failed:", err);
      setError(err.message || "Failed to add image.");
    } finally {
      setAddingImage(false);
    }
  }

  async function handleDeleteImage(imageId) {
    if (!confirm("Delete this image?")) return;

    try {
      await deleteMyWorkImage(id, imageId);
      setImages((current) => current.filter((img) => img.id !== imageId));
    } catch (err) {
      alert(err.message || "Failed to delete image.");
    }
  }

  if (loading) {
    return (
      <div className="mywork-form-page">
        <div className="mywork-form-state">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="mywork-form-page">
      <div className="mywork-form-header">
        <Link href="/admin/my-work" className="mywork-form-back">
          ← Back to My Work
        </Link>

        <div className="mywork-form-title-row">
          <div>
            <h1>{form.name || "Edit Project"}</h1>
            <p>
              /{form.slug} · {form.isPublished ? "Published" : "Draft"}
            </p>
          </div>

          <button
            type="button"
            className="mywork-form-delete"
            onClick={handleDelete}
          >
            Delete Project
          </button>
        </div>
      </div>

      {error && <div className="mywork-form-error">{error}</div>}
      {success && <div className="mywork-form-success">{success}</div>}

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
              />
            </label>

            <label>
              <span>Slug *</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                required
                maxLength={120}
              />
            </label>

            <label>
              <span>Category *</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                required
                maxLength={80}
              />
            </label>

            <label className="full">
              <span>Tagline</span>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                maxLength={200}
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
              />
            </label>

            <label className="full">
              <span>What I did exceptionally (one bullet per line)</span>
              <textarea
                rows={6}
                value={form.exceptionalWork}
                onChange={(e) => update("exceptionalWork", e.target.value)}
              />
            </label>

            <label className="full">
              <span>Tech stack (comma-separated)</span>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) => update("techStack", e.target.value)}
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
              />
            </label>

            <label>
              <span>Live URL</span>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => update("liveUrl", e.target.value)}
              />
            </label>

            <label>
              <span>GitHub URL</span>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => update("githubUrl", e.target.value)}
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* ==========================================
          IMAGE GALLERY
          ========================================== */}

      <section className="mywork-form-section mywork-gallery-section">
        <h2>Gallery ({images.length})</h2>

        {images.length === 0 ? (
          <p className="mywork-gallery-empty">
            No images yet. Add one below to appear on the case study page.
          </p>
        ) : (
          <div className="mywork-gallery-grid">
            {images.map((img) => (
              <div key={img.id} className="mywork-gallery-item">
                <div className="mywork-gallery-thumb">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || ""}
                    width={400}
                    height={260}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div className="mywork-gallery-meta">
                  {img.caption && <p>{img.caption}</p>}
                  {img.alt_text && <small>alt: {img.alt_text}</small>}

                  <button
                    type="button"
                    className="mywork-gallery-delete"
                    onClick={() => handleDeleteImage(img.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form className="mywork-image-form" onSubmit={handleAddImage}>
          <h3>Add Image</h3>

          <div className="mywork-form-grid">
            <label className="full">
              <span>Image URL *</span>
              <input
                type="url"
                value={imageForm.imageUrl}
                onChange={(e) =>
                  setImageForm({ ...imageForm, imageUrl: e.target.value })
                }
                required
                placeholder="https://i.imgur.com/..."
              />
            </label>

            <label className="full">
              <span>Alt text (for accessibility)</span>
              <input
                type="text"
                value={imageForm.altText}
                onChange={(e) =>
                  setImageForm({ ...imageForm, altText: e.target.value })
                }
                maxLength={300}
                placeholder="Describe what's in the image"
              />
            </label>

            <label className="full">
              <span>Caption</span>
              <input
                type="text"
                value={imageForm.caption}
                onChange={(e) =>
                  setImageForm({ ...imageForm, caption: e.target.value })
                }
                maxLength={500}
                placeholder="Optional caption shown below the image"
              />
            </label>

            <label>
              <span>Display Order</span>
              <input
                type="number"
                min={0}
                value={imageForm.displayOrder}
                onChange={(e) =>
                  setImageForm({
                    ...imageForm,
                    displayOrder: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <div className="mywork-form-actions">
            <button type="submit" disabled={addingImage}>
              {addingImage ? "Adding..." : "Add Image"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}