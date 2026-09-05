"use client";

import { useEffect, useState } from "react";
import { getClientById } from "../../../lib/api";
import "./client-details.css";

function formatBudget(budget) {
  const budgetLabels = {
    "under-10k": "Under ₹10K",
    "10k-25k": "₹10K – ₹25K",
    "25k-50k": "₹25K – ₹50K",
    "50k-plus": "₹50K+",
    discuss: "Let's discuss",
  };

  return budgetLabels[budget] || budget;
}

export default function ClientDetailsPage({ params }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  useEffect(() => {
    async function loadClient() {
      try {
        const token =
          localStorage.getItem("admin_token");

        if (!token) {
          throw new Error(
            "Authentication required."
          );
        }

        const { id } = await params;

        const response =
          await getClientById(id, token);

        setClient(response.data);
      } catch (error) {
        console.error(
          "Failed to load client:",
          error
        );

        setError(
          error.message ||
            "Failed to load client."
        );
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [params]);

  if (loading) {
    return (
      <div className="client-details-page">
        <div className="client-details-state">
          Loading client...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-details-page">
        <div className="client-details-state client-details-state--error">
          {error}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-details-page">
        <div className="client-details-state">
          Client not found.
        </div>
      </div>
    );
  }

  return (
    <div className="client-details-page">

      <button
        className="client-back"
        onClick={() =>
          window.history.back()
        }
      >
        ← Back to Clients
      </button>

      <div className="client-details-header">
        <div>
          <p className="client-details-eyebrow">
            CLIENT
          </p>

          <h1>{client.name}</h1>

          <p>
            {client.company ||
              "Independent Client"}
          </p>
        </div>

        <div className="client-details-actions">
          <button className="client-action-button">
            Edit Client
          </button>

          <button className="client-action-button client-action-button--danger">
            Delete
          </button>
        </div>
      </div>

      {/* =============================== */}
      {/* CLIENT INFORMATION */}
      {/* =============================== */}

      <section className="client-info-card">

        <div className="client-info-grid">

          <div>
            <span>Email</span>
            <strong>{client.email}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>
              {client.phone || "—"}
            </strong>
          </div>

          <div>
            <span>Company</span>
            <strong>
              {client.company || "—"}
            </strong>
          </div>

          <div>
            <span>Website</span>
            <strong>
              {client.website || "—"}
            </strong>
          </div>

          <div>
            <span>Created</span>
            <strong>
              {new Date(
                client.created_at
              ).toLocaleDateString()}
            </strong>
          </div>

          <div>
            <span>Updated</span>
            <strong>
              {new Date(
                client.updated_at
              ).toLocaleDateString()}
            </strong>
          </div>

        </div>

        {client.notes && (
          <div className="client-notes">
            <span>Notes</span>
            <p>{client.notes}</p>
          </div>
        )}

      </section>


      {/* =============================== */}
      {/* ENQUIRIES */}
      {/* =============================== */}

      <section className="client-section">

        <div className="client-section-header">
          <div>
            <p className="client-section-eyebrow">
              LEADS
            </p>

            <h2>Enquiries</h2>
          </div>

          <span className="client-section-count">
            {client.enquiries?.length || 0}
          </span>
        </div>

        {client.enquiries?.length ? (
          <div className="client-related-list">

            {client.enquiries.map(
              (enquiry) => (
                <article
                  className="client-related-card"
                  key={enquiry.id}
                >
                  <div>
                    <h3>
                      {enquiry.project_type}
                    </h3>

                    <p>
                      {enquiry.message}
                    </p>
                  </div>

                  <div className="client-related-meta">

                    <span
                      className={`status status--${enquiry.status.toLowerCase()}`}
                    >
                      {enquiry.status}
                    </span>

                    <span>
                      {enquiry.budget ? (
  <>
    {enquiry.currency || "INR"}{" "}
    {formatBudget(enquiry.budget)}
  </>
) : (
  "—"
)}
                    </span>

                    <span>
                      {new Date(
                        enquiry.created_at
                      ).toLocaleDateString()}
                    </span>

                  </div>
                </article>
              )
            )}

          </div>
        ) : (
          <div className="client-empty">
            No enquiries for this client.
          </div>
        )}

      </section>


      {/* =============================== */}
      {/* PROJECTS */}
      {/* =============================== */}

      <section className="client-section">

        <div className="client-section-header">
          <div>
            <p className="client-section-eyebrow">
              WORK
            </p>

            <h2>Projects</h2>
          </div>

          <span className="client-section-count">
            {client.projects?.length || 0}
          </span>
        </div>

        {client.projects?.length ? (
          <div className="client-related-list">

            {client.projects.map(
              (project) => (
                <article
                  className="client-related-card"
                  key={project.id}
                >
                  <div>
                    <h3>
                      {project.name}
                    </h3>

                    <p>
                      {project.description ||
                        "No description available."}
                    </p>
                  </div>

                  <div className="client-related-meta">

                    <span
                      className={`status status--${project.status.toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                    <span>
                      {project.budget
                        ? project.budget
                        : "No budget"}
                    </span>

                    {project.deadline && (
                      <span>
                        Due{" "}
                        {new Date(
                          project.deadline
                        ).toLocaleDateString()}
                      </span>
                    )}

                  </div>
                </article>
              )
            )}

          </div>
        ) : (
          <div className="client-empty">
            No projects for this client.
          </div>
        )}

      </section>

    </div>
  );
}