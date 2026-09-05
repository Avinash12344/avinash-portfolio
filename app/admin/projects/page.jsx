"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProjectsAdmin,
  updateProjectStatus,
  deleteProject,
  createProject,
  getClients,
  getProposalsAdmin
} from "@/app/lib/api";
import "./projects.css"
import { useRouter } from "next/navigation";


const PROJECT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const PROJECT_TYPES = [
  "PORTFOLIO",
  "CLIENT",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

    const [showCreateForm, setShowCreateForm] =
  useState(false);

const [creating, setCreating] =
  useState(false);
  const [clients, setClients] = useState([]);
const [proposals, setProposals] = useState([]);

const router = useRouter();

const [form, setForm] = useState({
  clientId: "",
  proposalId: "",

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

  // ============================================
  // LOAD PROJECTS
  // ============================================

  useEffect(() => {
  loadProjects();
  loadClients();
  loadProposals();
}, []);

  async function loadClients() {
  try {
    const token =
      localStorage.getItem("admin_token");

    if (!token) {
      throw new Error(
        "Authentication required."
      );
    }

    const response =
      await getClients(token);

    setClients(response.data || []);
  } catch (error) {
    console.error(
      "Failed to load clients:",
      error
    );
  }
}

async function loadProposals() {
  try {
    const token =
      localStorage.getItem("admin_token");

    if (!token) {
      throw new Error(
        "Authentication required."
      );
    }

    const response =
      await getProposalsAdmin(token);

    setProposals(response.data || []);
  } catch (error) {
    console.error(
      "Failed to load proposals:",
      error
    );
  }
}

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      const response =
        await getProjectsAdmin(token);

      setProjects(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load projects:",
        error
      );

      setError(
        error.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // FILTER
  // ============================================

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        project.name
          ?.toLowerCase()
          .includes(searchValue) ||
        project.client_name
          ?.toLowerCase()
          .includes(searchValue) ||
        project.type
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        project.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        project.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    projects,
    search,
    statusFilter,
    typeFilter,
  ]);

  // ============================================
  // STATUS
  // ============================================

  async function handleStatusChange(
    id,
    status
  ) {
    try {
      setUpdatingId(id);

      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      const response =
        await updateProjectStatus(
          id,
          status,
          token
        );

      const updatedProject =
        response.data;

      setProjects((current) =>
        current.map((project) =>
          project.id === id
            ? {
                ...project,
                ...updatedProject,
              }
            : project
        )
      );
    } catch (error) {
      console.error(
        "Failed to update project status:",
        error
      );

      alert(
        error.message ||
          "Failed to update project status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // ============================================
  // DELETE
  // ============================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }

      await deleteProject(id, token);

      setProjects((current) =>
        current.filter(
          (project) => project.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );

      alert(
        error.message ||
          "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleFormChange(event) {
  const { name, value, type, checked } =
    event.target;

  setForm((current) => ({
    ...current,
    [name]:
      type === "checkbox"
        ? checked
        : value,
  }));
}


function resetForm() {
  setForm({
    clientId: "",
    proposalId: "",

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
}

async function handleCreateProject(event) {
  event.preventDefault();

  try {
    setCreating(true);

    const token =
      localStorage.getItem("admin_token");

    if (!token) {
      throw new Error(
        "Authentication required."
      );
    }

    const response =
  await createProject(
    {
      ...form,

      clientId:
        form.clientId || null,

      proposalId:
        form.proposalId || null,

      budget:
        form.budget === ""
          ? null
          : Number(form.budget),
    },
    token
  );

    const newProject = response.data;

    setProjects((current) => [
      newProject,
      ...current,
    ]);

    resetForm();
    setShowCreateForm(false);

  } catch (error) {
    console.error(
      "Failed to create project:",
      error
    );

    alert(
      error.message ||
        "Failed to create project."
    );
  } finally {
    setCreating(false);
  }
}
// ============================================
  // RENDER
  // ============================================

  return (
    <main className="admin-page">
      <div className="admin-container">

        <div className="page-header">
          <div>
            <p className="eyebrow">
              ADMIN / PROJECTS
            </p>

            <h1>Projects</h1>

            <p>
              Manage your portfolio and client
              projects.
            </p>
          </div>

          <button
  className="primary-button"
  onClick={() =>
    setShowCreateForm(true)
  }
>
  + New Project
</button>
        </div>

{showCreateForm && (
  <div className="project-form-card">

    <div className="project-form-header">
      <div>
        <h2>Create Project</h2>
        <p>
          Add a new portfolio or client project.
        </p>
      </div>

      <button
        type="button"
        className="close-button"
        onClick={() => {
          resetForm();
          setShowCreateForm(false);
        }}
      >
        ×
      </button>
    </div>

    <form onSubmit={handleCreateProject}>

      <div className="form-grid">

        {/* NAME */}

        <div className="form-group full">
          <label>
            Project Name *
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="e.g. Employee Management System"
            required
          />
        </div>


        {/* TYPE */}

        <div className="form-group">
          <label>
            Project Type *
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleFormChange}
          >
            <option value="CLIENT">
              Client
            </option>

            <option value="PORTFOLIO">
              Portfolio
            </option>
          </select>
        </div>

        <div className="form-group">
  <label>
    Client
  </label>

  <select
    name="clientId"
    value={form.clientId}
    onChange={handleFormChange}
    disabled={form.type === "PORTFOLIO"}
  >
    <option value="">
      Select Client
    </option>

    {clients.map((client) => (
      <option
        key={client.id}
        value={client.id}
      >
        {client.name}
        {client.company
          ? ` — ${client.company}`
          : ""}
      </option>
    ))}
  </select>
</div>

<div className="form-group">
  <label>
    Proposal
  </label>

  <select
    name="proposalId"
    value={form.proposalId}
    onChange={handleFormChange}
    disabled={!form.clientId}
  >
    <option value="">
      Select Proposal
    </option>

    {proposals
      .filter(
        (proposal) =>
          !form.clientId ||
          proposal.client_id ===
            form.clientId
      )
      .map((proposal) => (
        <option
          key={proposal.id}
          value={proposal.id}
        >
          {proposal.title} —{" "}
          {proposal.currency}{" "}
          {Number(
            proposal.amount
          ).toLocaleString()}
        </option>
      ))}
  </select>
</div>


        {/* STATUS */}

        <div className="form-group">
          <label>
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleFormChange}
          >
            {PROJECT_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status.replace(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>
        </div>


        {/* BUDGET */}

        <div className="form-group">
          <label>
            Budget
          </label>

          <input
            type="number"
            min="0"
            name="budget"
            value={form.budget}
            onChange={handleFormChange}
            placeholder="50000"
          />
        </div>


        {/* CURRENCY */}

        <div className="form-group">
          <label>
            Currency
          </label>

          <select
            name="currency"
            value={form.currency}
            onChange={handleFormChange}
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


        {/* START DATE */}

        <div className="form-group">
          <label>
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleFormChange}
          />
        </div>


        {/* DEADLINE */}

        <div className="form-group">
          <label>
            Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleFormChange}
          />
        </div>


        {/* GITHUB */}

        <div className="form-group">
          <label>
            GitHub URL
          </label>

          <input
            type="url"
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleFormChange}
            placeholder="https://github.com/..."
          />
        </div>


        {/* LIVE URL */}

        <div className="form-group">
          <label>
            Live URL
          </label>

          <input
            type="url"
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleFormChange}
            placeholder="https://..."
          />
        </div>


        {/* DESCRIPTION */}

        <div className="form-group full">
          <label>
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows="4"
            placeholder="Describe the project..."
          />
        </div>


        {/* NOTES */}

        <div className="form-group full">
          <label>
            Notes
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleFormChange}
            rows="3"
            placeholder="Internal notes..."
          />
        </div>


        {/* FEATURED */}

        <div className="checkbox-group full">

          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleFormChange}
            />

            <span>
              Feature this project on portfolio
            </span>
          </label>

        </div>

      </div>


      {/* ACTIONS */}

      <div className="form-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            resetForm();
            setShowCreateForm(false);
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={creating}
        >
          {creating
            ? "Creating..."
            : "Create Project"}
        </button>

      </div>

    </form>

  </div>
)}
        {/* FILTERS */}

        <div className="filters">

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All Statuses
            </option>

            {PROJECT_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status.replace(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All Types
            </option>

            {PROJECT_TYPES.map(
              (type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              )
            )}
          </select>

        </div>

        {/* CONTENT */}

        {loading && (
          <div className="state-card">
            Loading projects...
          </div>
        )}

        {!loading && error && (
          <div className="state-card error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredProjects.length === 0 && (
            <div className="state-card">
              No projects found.
            </div>
          )}

        {!loading &&
          !error &&
          filteredProjects.length > 0 && (
            <div className="table-card">

              <table>

                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredProjects.map(
                    (project) => (
                      <tr key={project.id}>

                        <td>
                          <strong>
                            {project.name}
                          </strong>

                          {project.description && (
                            <small>
                              {
                                project.description
                              }
                            </small>
                          )}
                        </td>

                        <td>
                          {project.client_name ||
                            "—"}
                        </td>

                        <td>
                          {project.type}
                        </td>

                        <td>
                          {project.budget !==
                          null
                            ? `${project.currency} ${Number(
                                project.budget
                              ).toLocaleString()}`
                            : "—"}
                        </td>

                        <td>
                          <select
                            value={
                              project.status
                            }
                            disabled={
                              updatingId ===
                              project.id
                            }
                            onChange={(
                              event
                            ) =>
                              handleStatusChange(
                                project.id,
                                event.target
                                  .value
                              )
                            }
                          >
                            {PROJECT_STATUSES.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {status.replace(
                                    "_",
                                    " "
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </td>

                        <td>
                          {project.deadline
                            ? new Date(
                                project.deadline
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td>
                          <div className="actions">

                           <button
  type="button"
  onClick={() =>
    router.push(
      `/admin/projects/${project.id}`
    )
  }
>
  View
</button>

                            <button
  type="button"
  onClick={() =>
    router.push(`/admin/projects/${project.id}?edit=true`)
  }
>
  Edit Project
</button>

                            <button
                              className="danger"
                              disabled={
                                deletingId ===
                                project.id
                              }
                              onClick={() =>
                                handleDelete(
                                  project.id
                                )
                              }
                            >
                              {deletingId ===
                              project.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>
    </main>
  );
}