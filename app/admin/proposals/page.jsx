"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProposals,
  updateProposalStatus,
  deleteProposal,
} from "../../lib/api";

import "./proposals.css";

const STATUS_OPTIONS = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadProposals() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("Authentication required.");
      }

      const response = await getProposals(token);

      setProposals(response.data || []);
    } catch (error) {
      console.error("Failed to load proposals:", error);
      setError(error.message || "Failed to load proposals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProposals();
  }, []);

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        proposal.status === statusFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        proposal.title?.toLowerCase().includes(searchText) ||
        proposal.client_name?.toLowerCase().includes(searchText) ||
        proposal.client_email?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [proposals, statusFilter, search]);

  const statistics = useMemo(() => {
    return {
      total: proposals.length,
      draft: proposals.filter(
        (item) => item.status === "DRAFT"
      ).length,
      sent: proposals.filter(
        (item) => item.status === "SENT"
      ).length,
      viewed: proposals.filter(
        (item) => item.status === "VIEWED"
      ).length,
      accepted: proposals.filter(
        (item) => item.status === "ACCEPTED"
      ).length,
      rejected: proposals.filter(
        (item) => item.status === "REJECTED"
      ).length,
      expired: proposals.filter(
        (item) => item.status === "EXPIRED"
      ).length,
    };
  }, [proposals]);

 async function handleStatusChange(id, status) {
  try {
    setUpdatingId(id);

    const token = localStorage.getItem("admin_token");

    if (!token) {
      throw new Error("Authentication required.");
    }

    console.log("Updating proposal:", {
      id,
      status,
      tokenExists: !!token,
    });

    const response = await updateProposalStatus(
      id,
      status,
      token
    );

    console.log("Update response:", response);

    const updatedProposal = response.data;

    setProposals((current) =>
      current.map((proposal) =>
        proposal.id === id
          ? {
              ...proposal,
              ...updatedProposal,
            }
          : proposal
      )
    );
  } catch (error) {
    console.error(
      "Failed to update proposal status:",
      error
    );

    alert(
      error.message ||
        "Failed to update proposal status."
    );
  } finally {
    setUpdatingId(null);
  }
}

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this proposal?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("Authentication required.");
      }

      await deleteProposal(id, token);

      setProposals((current) =>
        current.filter(
          (proposal) => proposal.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete proposal:",
        error
      );

      alert(
        error.message ||
          "Failed to delete proposal."
      );
    }
  }

  function formatAmount(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <main className="proposals-page">
      <div className="proposals-container">

        {/* HEADER */}

        <div className="proposals-header">
          <div>
            <p className="proposals-eyebrow">
              ADMIN / PROPOSALS
            </p>

            <h1>Proposals</h1>

            <p className="proposals-subtitle">
              Manage proposals, track their status,
              and monitor client decisions.
            </p>
          </div>

          <button
            className="proposal-primary-button"
            type="button"
          >
            + Create Proposal
          </button>
        </div>


        {/* ERROR */}

        {error && (
          <div className="proposal-error">
            {error}
          </div>
        )}


        {/* STATISTICS */}

        <div className="proposal-stats">

          <div className="proposal-stat-card">
            <span>Total</span>
            <strong>{statistics.total}</strong>
          </div>

          <div className="proposal-stat-card">
            <span>Draft</span>
            <strong>{statistics.draft}</strong>
          </div>

          <div className="proposal-stat-card">
            <span>Sent</span>
            <strong>{statistics.sent}</strong>
          </div>

          <div className="proposal-stat-card">
            <span>Viewed</span>
            <strong>{statistics.viewed}</strong>
          </div>

          <div className="proposal-stat-card proposal-stat-card--success">
            <span>Accepted</span>
            <strong>{statistics.accepted}</strong>
          </div>

          <div className="proposal-stat-card proposal-stat-card--danger">
            <span>Rejected</span>
            <strong>{statistics.rejected}</strong>
          </div>

          <div className="proposal-stat-card">
            <span>Expired</span>
            <strong>{statistics.expired}</strong>
          </div>

        </div>


        {/* FILTERS */}

        <div className="proposal-toolbar">

          <input
            type="text"
            placeholder="Search proposals or clients..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="proposal-search"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="proposal-filter"
          >
            <option value="ALL">
              All statuses
            </option>

            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status.replace("_", " ")}
              </option>
            ))}
          </select>

        </div>


        {/* TABLE */}

        <div className="proposal-table-wrapper">

          {loading ? (
            <div className="proposal-state">
              Loading proposals...
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="proposal-state">
              No proposals found.
            </div>
          ) : (
            <table className="proposal-table">

              <thead>
                <tr>
                  <th>Proposal</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProposals.map(
                  (proposal) => (
                    <tr key={proposal.id}>

                      <td>
                        <div className="proposal-title">
                          {proposal.title}
                        </div>

                        <div className="proposal-project">
                          {proposal.project_type ||
                            "Project"}
                        </div>
                      </td>


                      <td>
                        <div className="proposal-client-name">
                          {proposal.client_name}
                        </div>

                        <div className="proposal-client-email">
                          {proposal.client_email}
                        </div>
                      </td>


                      <td>
                        <strong>
                          {formatAmount(
                            proposal.amount,
                            proposal.currency
                          )}
                        </strong>
                      </td>


                      <td>
                        {proposal.estimated_days
                          ? `${proposal.estimated_days} days`
                          : "—"}
                      </td>


                      <td>
                        <select
                          value={proposal.status}
                          disabled={
                            updatingId ===
                            proposal.id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              proposal.id,
                              event.target.value
                            )
                          }
                          className={`proposal-status proposal-status--${proposal.status.toLowerCase()}`}
                        >
                          {STATUS_OPTIONS.map(
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
                      </td>


                      <td>
                        {formatDate(
                          proposal.sent_at
                        )}
                      </td>


                      <td>
                        <div className="proposal-actions">

                          <button
                            type="button"
                            className="proposal-action"
                            onClick={() =>
                              alert(
                                "Proposal details coming next."
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="proposal-action proposal-action--danger"
                            onClick={() =>
                              handleDelete(
                                proposal.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>
    </main>
  );
}