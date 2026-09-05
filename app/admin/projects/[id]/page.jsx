"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/app/lib/api";

import "../projects.css";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
  useState(
    searchParams.get("edit") === "true"
  );

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "CLIENT",
    status: "PLANNED",
    budget: "",
    currency: "INR",
    startDate: "",
    deadline: "",
    githubUrl: "",
    liveUrl: "",
    notes: "",
    isFeatured: false,
  });

  useEffect(() => {
    loadProject();
  }, []);

  async function handleDelete() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project? This action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    const token =
      localStorage.getItem("admin_token");

    if (!token) {
      throw new Error(
        "Authentication required."
      );
    }

    const response =
      await deleteProject(
        params.id,
        token
      );

    if (!response.success) {
      throw new Error(
        response.message ||
          "Failed to delete project."
      );
    }

    router.push("/admin/projects");
  } catch (error) {
    console.error(
      "Failed to delete project:",
      error
    );

    alert(
      error.message ||
        "Failed to delete project."
    );
  }
}

  async function loadProject() {
    try {
      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      const response =
        await getProjectById(
          params.id,
          token
        );

      const data = response.data;

      setProject(data);

      setForm({
        name: data.name || "",
        description:
          data.description || "",
        type: data.type || "CLIENT",
        status:
          data.status || "PLANNED",
        budget:
          data.budget ?? "",
        currency:
          data.currency || "INR",
        startDate:
          data.start_date || "",
        deadline:
          data.deadline || "",
        githubUrl:
          data.github_url || "",
        liveUrl:
          data.live_url || "",
        notes:
          data.notes || "",
        isFeatured:
          Boolean(data.is_featured),
      });
    } catch (error) {
      console.error(
        "Failed to load project:",
        error
      );

      setError(
        error.message ||
          "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function startEditing() {
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    if (!project) return;

    setForm({
      name: project.name || "",
      description:
        project.description || "",
      type: project.type || "CLIENT",
      status:
        project.status || "PLANNED",
      budget:
        project.budget ?? "",
      currency:
        project.currency || "INR",
      startDate:
        project.start_date || "",
      deadline:
        project.deadline || "",
      githubUrl:
        project.github_url || "",
      liveUrl:
        project.live_url || "",
      notes:
        project.notes || "",
      isFeatured:
        Boolean(project.is_featured),
    });

    setError("");
    setEditing(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      if (!form.name.trim()) {
        throw new Error(
          "Project name is required."
        );
      }

      const response =
        await updateProject(
          params.id,
          {
            name: form.name.trim(),

            description:
              form.description.trim() ||
              null,

            type: form.type,

            status: form.status,

            budget:
              form.budget !== ""
                ? Number(form.budget)
                : null,

            currency:
              form.currency,

            startDate:
              form.startDate || null,

            deadline:
              form.deadline || null,

            githubUrl:
              form.githubUrl.trim() ||
              null,

            liveUrl:
              form.liveUrl.trim() ||
              null,

            notes:
              form.notes.trim() ||
              null,

            isFeatured:
              form.isFeatured,
          },
          token
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to update project."
        );
      }

      const updatedProject =
        response.data;

      setProject(
        updatedProject
      );

      setForm({
        name:
          updatedProject.name || "",
        description:
          updatedProject.description ||
          "",
        type:
          updatedProject.type ||
          "CLIENT",
        status:
          updatedProject.status ||
          "PLANNED",
        budget:
          updatedProject.budget ?? "",
        currency:
          updatedProject.currency ||
          "INR",
        startDate:
          updatedProject.start_date ||
          "",
        deadline:
          updatedProject.deadline ||
          "",
        githubUrl:
          updatedProject.github_url ||
          "",
        liveUrl:
          updatedProject.live_url ||
          "",
        notes:
          updatedProject.notes ||
          "",
        isFeatured:
          Boolean(
            updatedProject.is_featured
          ),
      });

      setEditing(false);
    } catch (error) {
      console.error(
        "Failed to update project:",
        error
      );

      setError(
        error.message ||
          "Failed to update project."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-loading">
        Loading project...
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="page-error">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-error">
        Project not found.
      </div>
    );
  }

  return (
    <div className="project-details-page">

      {/* HEADER */}

      <div className="project-details-header">

        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/projects"
              )
            }
          >
            ← Back to Projects
          </button>

          <h1>{project.name}</h1>

          <p>
            {project.description ||
              "No description provided."}
          </p>
        </div>

        {!editing && (
  <div className="project-header-actions">

    <button
      type="button"
      className="edit-project-button"
      onClick={startEditing}
    >
      Edit Project
    </button>

    <button
      type="button"
      className="delete-project-button"
      onClick={handleDelete}
    >
      Delete Project
    </button>

  </div>
)}
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {/* EDIT FORM */}

      {editing ? (
        <form
          className="details-card"
          onSubmit={handleSubmit}
        >
          <h2>Edit Project</h2>

          <div className="details-grid">

            <div>
              <label>
                Project Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Type</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="CLIENT">
                  CLIENT
                </option>

                <option value="PORTFOLIO">
                  PORTFOLIO
                </option>
              </select>
            </div>

            <div>
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PLANNED">
                  PLANNED
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="ON_HOLD">
                  ON HOLD
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

                <option value="CANCELLED">
                  CANCELLED
                </option>
              </select>
            </div>

            <div>
              <label>Budget</label>

              <input
                type="number"
                name="budget"
                min="0"
                value={form.budget}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Currency</label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                <option value="INR">
                  INR
                </option>

                <option value="USD">
                  USD
                </option>

                <option value="EUR">
                  EUR
                </option>
              </select>
            </div>

            <div>
              <label>
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-field">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="form-field">
            <label>
              GitHub URL
            </label>

            <input
              type="url"
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>
              Live URL
            </label>

            <input
              type="url"
              name="liveUrl"
              value={form.liveUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>
              Notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={
                  form.isFeatured
                }
                onChange={
                  handleChange
                }
              />

              Featured Project
            </label>
          </div>

          <div className="form-actions">

            <button
              type="button"
              onClick={
                cancelEditing
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>
        </form>
      ) : (
        <>
          {/* BASIC INFORMATION */}

          <section className="details-card">
            <h2>
              Project Information
            </h2>

            <div className="details-grid">

              <div>
                <span>Type</span>

                <strong>
                  {project.type}
                </strong>
              </div>

              <div>
                <span>Budget</span>

                <strong>
                  {project.currency}{" "}
                  {Number(
                    project.budget || 0
                  ).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Start Date</span>

                <strong>
                  {project.start_date ||
                    "Not set"}
                </strong>
              </div>

              <div>
                <span>Deadline</span>

                <strong>
                  {project.deadline ||
                    "Not set"}
                </strong>
              </div>

            </div>
          </section>

          {/* CLIENT */}

          <section className="details-card">
            <h2>Client</h2>

            {project.client_id ? (
              <div className="details-grid">

                <div>
                  <span>Name</span>

                  <strong>
                    {project.client_name}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {project.client_email}
                  </strong>
                </div>

                <div>
                  <span>Company</span>

                  <strong>
                    {project.client_company ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {project.client_phone ||
                      "—"}
                  </strong>
                </div>

              </div>
            ) : (
              <p>
                No client associated.
              </p>
            )}
          </section>

          {/* PROPOSAL */}

          <section className="details-card">
            <h2>Proposal</h2>

            {project.proposal_id ? (
              <div className="details-grid">

                <div>
                  <span>Title</span>

                  <strong>
                    {project.proposal_title}
                  </strong>
                </div>

                <div>
                  <span>Amount</span>

                  <strong>
                    {
                      project.proposal_currency
                    }{" "}
                    {Number(
                      project.proposal_amount ||
                        0
                    ).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {project.proposal_status}
                  </strong>
                </div>

                <div>
                  <span>
                    Estimated Days
                  </span>

                  <strong>
                    {
                      project.proposal_estimated_days ||
                      "—"
                    }
                  </strong>
                </div>

              </div>
            ) : (
              <p>
                No proposal associated.
              </p>
            )}
          </section>

          {/* LINKS */}

          <section className="details-card">
            <h2>
              Project Links
            </h2>

            <div className="project-links">

              {project.github_url && (
                <a
                  href={
                    project.github_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}

              {project.live_url && (
                <a
                  href={
                    project.live_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Website
                </a>
              )}

              {!project.github_url &&
                !project.live_url && (
                  <p>
                    No links added.
                  </p>
                )}

            </div>
          </section>

          {/* NOTES */}

          <section className="details-card">
            <h2>Notes</h2>

            <p>
              {project.notes ||
                "No notes added."}
            </p>
          </section>
        </>
      )}

    </div>
  );
}