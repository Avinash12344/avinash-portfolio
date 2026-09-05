"use client";

import { useEffect, useState } from "react";

import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../../lib/api";

import "./enquiries.css";

const statuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
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

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  async function loadEnquiries() {
  try {
    setLoading(true);
    setError("");

    const response = await getEnquiries();

    setEnquiries(response.data || []);
  } catch (error) {
    console.error("Failed to load enquiries:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadEnquiries();
  }, []);


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  async function handleStatusChange(id, status) {
  try {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      throw new Error("Authentication required.");
    }

    await updateEnquiryStatus(
      id,
      status,
      token
    );

    // Reload enquiries
    await loadEnquiries();

  } catch (error) {
    console.error(
      "Failed to update enquiry status:",
      error
    );

    setError(error.message);
  }
}


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
  try {
    await deleteEnquiry(id);

    await loadEnquiries();
  } catch (error) {
    console.error(
      "Failed to delete enquiry:",
      error
    );

    setError(error.message);
  }
};


  // ==========================================
  // FILTER
  // ==========================================

  const filteredEnquiries =
    enquiries.filter((enquiry) => {

      const query =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !query ||
        enquiry.client_name
          ?.toLowerCase()
          .includes(query) ||
        enquiry.client_email
          ?.toLowerCase()
          .includes(query) ||
        enquiry.client_company
          ?.toLowerCase()
          .includes(query) ||
        enquiry.project_type
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        enquiry.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });


  return (
    <main className="enquiries-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="enquiries-header">

        <div>

          <p className="enquiries-eyebrow">
            ADMIN / ENQUIRIES
          </p>

          <h1>Enquiries</h1>

          <p className="enquiries-description">
            Manage incoming project enquiries
            and track potential clients.
          </p>

        </div>


        <div className="enquiries-count">

          <span>
            {enquiries.length}
          </span>

          <small>
            Total Enquiries
          </small>

        </div>

      </div>


      {/* ======================================
          TOOLBAR
      ====================================== */}

      <div className="enquiries-toolbar">

        <input
          type="text"
          placeholder="Search client, email, company or project..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />


        <div className="status-filters">

          {statuses.map(
            (status) => (

              <button
                key={status}
                className={
                  statusFilter === status
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setStatusFilter(
                    status
                  )
                }
              >
                {status}
              </button>

            )
          )}

        </div>

      </div>


      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="enquiries-state">
          Loading enquiries...
        </div>
      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {!loading && error && (

        <div className="enquiries-state enquiries-state--error">

          <p>{error}</p>

          <button
            onClick={loadEnquiries}
          >
            Try Again
          </button>

        </div>

      )}


      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        !error &&
        filteredEnquiries.length === 0 && (

          <div className="enquiries-state">

            {search ||
            statusFilter !== "ALL"
              ? "No enquiries match your filters."
              : "No enquiries found."}

          </div>

        )}


      {/* ======================================
          TABLE
      ====================================== */}

      {!loading &&
        !error &&
        filteredEnquiries.length > 0 && (

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

                {filteredEnquiries.map(
                  (enquiry) => (

                    <tr key={enquiry.id}>

                      {/* CLIENT */}

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


                      {/* PROJECT */}

                      <td>

                        <span className="project-type">
                          {enquiry.project_type}
                        </span>

                        <p className="enquiry-message">
                          {enquiry.message}
                        </p>

                      </td>


                      {/* BUDGET */}

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


                      {/* STATUS */}

                      <td>

                        <select
                          value={
                            enquiry.status
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              enquiry.id,
                              event.target.value
                            )
                          }
                          className={`status-select status-${enquiry.status.toLowerCase()}`}
                        >

                          {statuses
                            .filter(
                              (status) =>
                                status !==
                                "ALL"
                            )
                            .map(
                              (status) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {status}
                                </option>
                              )
                            )}

                        </select>

                      </td>


                      {/* SOURCE */}

                      <td>
                        <span className="source-badge">
                          {enquiry.source}
                        </span>
                      </td>


                      {/* DATE */}

                      <td>

                        {enquiry.created_at
                          ? new Date(
                              enquiry.created_at
                            ).toLocaleDateString()
                          : "—"}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              enquiry.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

    </main>
  );
}