"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getMyWork, deleteMyWork, updateMyWork } from "../../lib/api";
import "./my-work.css";

export default function MyWorkPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await getMyWork();
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleTogglePublished(project) {
    try {
      setBusyId(project.id);

      await updateMyWork(project.id, {
        slug: project.slug,
        name: project.name,
        tagline: project.tagline,
        description: project.description,
        exceptionalWork: project.exceptional_work || [],
        category: project.category,
        techStack: project.tech_stack || [],
        thumbnailUrl: project.thumbnail_url,
        liveUrl: project.live_url,
        githubUrl: project.github_url,
        isFeatured: project.is_featured,
        isPublished: !project.is_published,
        displayOrder: project.display_order,
      });

      setProjects((current) =>
        current.map((p) =>
          p.id === project.id
            ? { ...p, is_published: !p.is_published }
            : p
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update status.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;

    try {
      setBusyId(project.id);
      await deleteMyWork(project.id);
      setProjects((current) => current.filter((p) => p.id !== project.id));
    } catch (err) {
      alert(err.message || "Failed to delete.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.tech_stack || []).some((t) => t.toLowerCase().includes(q));

      const matchesFilter =
        filter === "ALL" ||
        (filter === "PUBLISHED" && p.is_published) ||
        (filter === "DRAFT" && !p.is_published) ||
        (filter === "FEATURED" && p.is_featured);

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((p) => p.is_published).length,
      drafts: projects.filter((p) => !p.is_published).length,
      featured: projects.filter((p) => p.is_featured).length,
    }),
    [projects]
  );

  return (
    <div className="mywork-page">
      <div className="mywork-header">
        <div>
          <p className="mywork-eyebrow">PORTFOLIO CONTENT</p>
          <h1>My Work</h1>
          <p>
            Personal projects and experiments shown on your public site.
          </p>
        </div>

        <Link href="/admin/my-work/new" className="mywork-primary-button">
          + New Project
        </Link>
      </div>

      <div className="mywork-stats">
        <div className="mywork-stat">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="mywork-stat">
          <span>Published</span>
          <strong>{stats.published}</strong>
        </div>
        <div className="mywork-stat">
          <span>Drafts</span>
          <strong>{stats.drafts}</strong>
        </div>
        <div className="mywork-stat">
          <span>Featured</span>
          <strong>{stats.featured}</strong>
        </div>
      </div>

      <div className="mywork-toolbar">
        <input
          type="text"
          placeholder="Search by name, slug, category or tech..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mywork-filters">
          {[
            ["ALL", "All"],
            ["PUBLISHED", "Published"],
            ["DRAFT", "Drafts"],
            ["FEATURED", "Featured"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mywork-error">{error}</div>}

      {loading ? (
        <div className="mywork-state">Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div className="mywork-state">
          {projects.length === 0
            ? "No projects yet. Click + New Project to add your first one."
            : "No projects match your filters."}
        </div>
      ) : (
        <div className="mywork-table-wrapper">
          <table className="mywork-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Tech</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={`/admin/my-work/${p.id}`}
                      className="mywork-name"
                    >
                      {p.name}
                    </Link>
                    <div className="mywork-slug">/{p.slug}</div>
                  </td>
                  <td>{p.category || "—"}</td>
                  <td>
                    <div className="mywork-tech-list">
                      {(p.tech_stack || []).slice(0, 3).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                      {(p.tech_stack || []).length > 3 && (
                        <span className="mywork-tech-more">
                          +{p.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={
                        p.is_published
                          ? "status-badge status-badge--published"
                          : "status-badge status-badge--draft"
                      }
                      onClick={() => handleTogglePublished(p)}
                      disabled={busyId === p.id}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td>{p.is_featured ? "★" : "—"}</td>
                  <td>
                    <div className="mywork-actions">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/my-work/${p.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="mywork-danger"
                        onClick={() => handleDelete(p)}
                        disabled={busyId === p.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}