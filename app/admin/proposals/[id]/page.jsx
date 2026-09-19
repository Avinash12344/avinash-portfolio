"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  getProposalById,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
} from "@/lib/api";

import "../proposals.css";

const STATUSES = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

function formatAmount(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProposalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(
    searchParams.get("edit") === "true"
  );
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "INR",
    estimatedDays: "",
    status: "DRAFT",
  });

  useEffect(() => {
    loadProposal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProposal() {
    try {
      setLoading(true);
      setError("");

      const response = await getProposalById(params.id);
      const data = response.data;

      setProposal(data);
      setForm({
        title: data.title || "",
        description: data.description || "",
        amount: data.amount ?? "",
        currency: data.currency || "INR",
        estimatedDays: data.estimated_days ?? "",
        status: data.status || "DRAFT",
      });
    } catch (err) {
      console.error("Failed to load proposal:", err);
      setError(err.message || "Failed to load proposal.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEditing() {
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    if (!proposal) return;

    setForm({
      title: proposal.title || "",
      description: proposal.description || "",
      amount: proposal.amount ?? "",
      currency: proposal.currency || "INR",
      estimatedDays: proposal.estimated_days ?? "",
      status: proposal.status || "DRAFT",
    });

    setEditing(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.title.trim()) {
        throw new Error("Title is required.");
      }

      if (!form.description.trim()) {
        throw new Error("Description is required.");
      }

      if (form.amount === "" || Number(form.amount) < 0) {
        throw new Error("Amount must be a non-negative number.");
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        currency: form.currency,
        estimatedDays:
          form.estimatedDays === ""
            ? null
            : Number(form.estimatedDays),
      };

      const response = await updateProposal(params.id, payload);
      const updated = response.data;

      // If status changed, call the dedicated endpoint
      if (form.status !== proposal.status) {
        const statusRes = await updateProposalStatus(
          params.id,
          form.status
        );
        setProposal(statusRes.data);
      } else {
        setProposal(updated);
      }

      setEditing(false);
    } catch (err) {
      console.error("Failed to update proposal:", err);
      setError(err.message || "Failed to update proposal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this proposal? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteProposal(params.id);
      router.push("/admin/proposals");
    } catch (err) {
      console.error("Failed to delete proposal:", err);
      alert(err.message || "Failed to delete proposal.");
    }
  }

  if (loading) {
    return (
      <div className="proposals-page">
        <div className="proposal-state">Loading proposal...</div>
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="proposals-page">
        <div className="proposal-error">{error}</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="proposals-page">
        <div className="proposal-state">Proposal not found.</div>
      </div>
    );
  }

  return (
    <div className="proposals-page">
      <div className="proposals-container">

        {/* HEADER */}
        <div className="proposals-header">
          <div>
            <button
              type="button"
              className="proposal-back"
              onClick={() => router.push("/admin/proposals")}
            >
              ← Back to Proposals
            </button>

            <p className="proposals-eyebrow">ADMIN / PROPOSALS</p>

            <h1>{proposal.title}</h1>

            <p className="proposals-subtitle">
              {proposal.client_name || "No client"}{" "}
              {proposal.client_company
                ? `— ${proposal.client_company}`
                : ""}
            </p>
          </div>

          {!editing && (
            <div className="proposal-header-actions">
              <button
                type="button"
                className="proposal-action"
                onClick={startEditing}
              >
                Edit Proposal
              </button>

              <button
                type="button"
                className="proposal-action proposal-action--danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="proposal-error">{error}</div>
        )}

        {/* EDIT FORM */}
        {editing ? (
          <form className="proposal-details-card" onSubmit={handleSubmit}>
            <h2>Edit Proposal</h2>

            <div className="proposal-details-grid">
              <div className="full">
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Currency</label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div>
                <label>Estimated Days</label>
                <input
                  type="number"
                  name="estimatedDays"
                  min="1"
                  value={form.estimatedDays}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="proposal-details-field">
              <label>Description</label>
              <textarea
                name="description"
                rows={6}
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="proposal-form-actions">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="proposal-primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* DETAILS */}
            <section className="proposal-details-card">
              <h2>Proposal Information</h2>

              <div className="proposal-details-grid">
                <div>
                  <span>Amount</span>
                  <strong>
                    {formatAmount(
                      proposal.amount,
                      proposal.currency
                    )}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{proposal.status}</strong>
                </div>

                <div>
                  <span>Estimated Days</span>
                  <strong>
                    {proposal.estimated_days
                      ? `${proposal.estimated_days} days`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Sent</span>
                  <strong>{formatDate(proposal.sent_at)}</strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>{formatDate(proposal.created_at)}</strong>
                </div>

                <div>
                  <span>Updated</span>
                  <strong>{formatDate(proposal.updated_at)}</strong>
                </div>
              </div>
            </section>

            {/* CLIENT */}
            <section className="proposal-details-card">
              <h2>Client</h2>

              {proposal.client_id ? (
                <div className="proposal-details-grid">
                  <div>
                    <span>Name</span>
                    <strong>{proposal.client_name}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{proposal.client_email}</strong>
                  </div>

                  <div>
                    <span>Company</span>
                    <strong>{proposal.client_company || "—"}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{proposal.client_phone || "—"}</strong>
                  </div>
                </div>
              ) : (
                <p>No client associated.</p>
              )}
            </section>

            {/* DESCRIPTION */}
            <section className="proposal-details-card">
              <h2>Description</h2>
              <p className="proposal-description">
                {proposal.description || "No description."}
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}