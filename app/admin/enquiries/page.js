"use client";

import { useEffect, useState } from "react";

import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../../lib/api";

import "./enquiries.css";

// Must match backend: src/schemas/enquiry.schema.js → STATUSES
const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "ARCHIVED",
];

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

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const response = await getEnquiries();
      setEnquiries(response.data || []);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function handleStatusChange(id, status) {
    try {
      setError("");
      await updateEnquiryStatus(id, status);
      await loadEnquiries();
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this enquiry?")) return;

    try {
      setError("");
      await deleteEnquiry(id);
      await loadEnquiries();
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      setError(err.message);
    }
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      enquiry.client_name?.toLowerCase().includes(query) ||
      enquiry.client_email?.toLowerCase().includes(query) ||
      enquiry.client_company?.toLowerCase().includes(query) ||
      enquiry.project_type?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="enquiries-page">
      <div className="enquiries-header">
        <div>
          <p className="enquiries-eyebrow">ADMIN / ENQUIRIES</p>
          <h1>Enquiries</h1>
          <p className="enquiries-description">
            Manage incoming project enquiries and track potential clients.
          </p>
        </div>

        <div className="enquiries-count">
          <span>{enquiries.length}</span>
          <small>Total Enquiries</small>
        </div>
      </div>

      <div className="enquiries-toolbar">
        <input
          type="text"
          placeholder="Search client, email, company or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="status-filters">
          {/* ALL button — was missing before */}
          <button
            className={statusFilter === "ALL" ? "active" : ""}
            onClick={() => setStatusFilter("ALL")}
          >
            ALL
          </button>

          {STATUSES.map((status) => (
            <button
              key={status}
              className={statusFilter === status ? "active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="enquiries-state">Loading enquiries...</div>
      )}

      {!loading && error && (
        <div className="enquiries-state enquiries-state--error">
          <p>{error}</p>
          <button onClick={loadEnquiries}>Try Again</button>
        </div>
      )}

      {!loading && !error && filteredEnquiries.length === 0 && (
        <div className="enquiries-state">
          {search || statusFilter !== "ALL"
            ? "No enquiries match your filters."
            : "No enquiries found."}
        </div>
      )}

      {!loading && !error && filteredEnquiries.length > 0 && (
        <div className="enquiries-table-wrapper">
          <table className="enquiries-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Source</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>
                    <div className="enquiry-client-name">
                      {enquiry.client_name}
                    </div>
                    <div className="enquiry-client-email">
                      {enquiry.client_email}
                    </div>
                    {enquiry.client_company && (
                      <div className="enquiry-client-company">
                        {enquiry.client_company}
                      </div>
                    )}
                  </td>

                  <td>
                    <span className="project-type">
                      {enquiry.project_type}
                    </span>
                    <p className="enquiry-message">{enquiry.message}</p>
                  </td>

                  <td>
                    {enquiry.budget ? (
                      <>
                        {enquiry.currency || "INR"}{" "}
                        {formatBudget(enquiry.budget)}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    <select
                      value={enquiry.status}
                      onChange={(e) =>
                        handleStatusChange(enquiry.id, e.target.value)
                      }
                      className={`status-select status-${enquiry.status.toLowerCase()}`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <span className="source-badge">{enquiry.source}</span>
                  </td>

                  <td>
                    {enquiry.created_at
                      ? new Date(enquiry.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(enquiry.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}