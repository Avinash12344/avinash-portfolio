"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getReviews,
  getClients,
  getProjectsAdmin,
  createReview,
  updateReview,
  updateReviewApproval,
  updateReviewPublishStatus,
  deleteReview,
} from "@/lib/api";
import "./reviews.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] =
  useState(false);

const [editingReview, setEditingReview] =
  useState(null);

const [clients, setClients] =
  useState([]);

const [projects, setProjects] =
  useState([]);

const [saving, setSaving] =
  useState(false);

const [form, setForm] = useState({
  clientId: "",
  projectId: "",
  rating: 5,
  testimonial: "",
  isApproved: false,
  isPublished: false,
});

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadFormData() {
  try {
    const [clientsResponse, projectsResponse] = await Promise.all([
      getClients(),
      getProjectsAdmin(),   // ← was getProjects()
    ]);

    setClients(clientsResponse.data || []);
    setProjects(projectsResponse.data || []);
  } catch (error) {
    console.error("Failed to load review form data:", error);
    alert(error.message || "Failed to load clients and projects.");
  }
}


function handleCreateReview() {
  setEditingReview(null);

  setForm({
    clientId: "",
    projectId: "",
    rating: 5,
    testimonial: "",
    isApproved: false,
    isPublished: false,
  });

  loadFormData();

  setShowForm(true);
}

function handleEditReview(review) {
  setEditingReview(review);

  setForm({
    clientId:
      review.client_id || "",
    projectId:
      review.project_id || "",
    rating:
      review.rating || 5,
    testimonial:
      review.testimonial || "",
    isApproved:
      review.is_approved || false,
    isPublished:
      review.is_published || false,
  });

  loadFormData();

  setShowForm(true);
}

function handleFormChange(
  event
) {
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

async function handleSaveReview(event) {
  event.preventDefault();

  try {
    setSaving(true);

    if (!form.clientId) {
      throw new Error("Please select a client.");
    }

    if (!form.projectId) {
      throw new Error("Please select a project.");
    }

    if (!form.testimonial.trim()) {
      throw new Error("Testimonial is required.");
    }

    if (Number(form.rating) < 1 || Number(form.rating) > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    if (form.isPublished && !form.isApproved) {
      throw new Error("A review must be approved before publishing.");
    }

    // Approval + publish are NOT part of create/update payloads.
    // They're separate endpoints. Send only what the schema accepts.
    const payload = {
      clientId: form.clientId,
      projectId: form.projectId,
      rating: Number(form.rating),
      testimonial: form.testimonial.trim(),
    };

    let savedReview;

    if (editingReview) {
      const response = await updateReview(editingReview.id, payload);
      savedReview = response.data;

      // Approval changed? Call the dedicated endpoint.
      if (form.isApproved !== editingReview.is_approved) {
        const approvalRes = await updateReviewApproval(
          editingReview.id,
          form.isApproved
        );
        savedReview = approvalRes.data;
      }

      // Publish changed? Same deal.
      if (form.isPublished !== editingReview.is_published) {
        const publishRes = await updateReviewPublishStatus(
          editingReview.id,
          form.isPublished
        );
        savedReview = publishRes.data;
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === editingReview.id
            ? { ...review, ...savedReview }
            : review
        )
      );
    } else {
      const response = await createReview(payload);
      savedReview = response.data;

      // New reviews always come back unapproved + unpublished.
      // Apply the admin's intent immediately.
      if (form.isApproved) {
        const approvalRes = await updateReviewApproval(
          savedReview.id,
          true
        );
        savedReview = approvalRes.data;
      }

      if (form.isPublished && form.isApproved) {
        const publishRes = await updateReviewPublishStatus(
          savedReview.id,
          true
        );
        savedReview = publishRes.data;
      }

      setReviews((current) => [savedReview, ...current]);
    }

    setShowForm(false);
    setEditingReview(null);
  } catch (error) {
    console.error("Failed to save review:", error);
    alert(error.message || "Failed to save review.");
  } finally {
    setSaving(false);
  }
}
  // ============================================
  // LOAD REVIEWS
  // ============================================

  async function loadReviews() {
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
        await getReviews(token);

      setReviews(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error
      );

      setError(
        error.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // APPROVAL
  // ============================================

  async function handleApprovalChange(
    id,
    isApproved
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
        await updateReviewApproval(
          id,
          isApproved,
          token
        );

      const updatedReview =
        response.data;

      setReviews((current) =>
        current.map((review) =>
          review.id === id
            ? {
                ...review,
                ...updatedReview,
              }
            : review
        )
      );
    } catch (error) {
      console.error(
        "Failed to update approval:",
        error
      );

      alert(
        error.message ||
          "Failed to update approval."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // ============================================
  // PUBLISH
  // ============================================

  async function handlePublishChange(
    id,
    isPublished
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

      const review =
        reviews.find(
          (item) => item.id === id
        );

      // Cannot publish unapproved review
      if (
        isPublished &&
        !review?.is_approved
      ) {
        alert(
          "A review must be approved before publishing."
        );

        return;
      }

      const response =
        await updateReviewPublishStatus(
          id,
          isPublished,
          token
        );

      const updatedReview =
        response.data;

      setReviews((current) =>
        current.map((review) =>
          review.id === id
            ? {
                ...review,
                ...updatedReview,
              }
            : review
        )
      );
    } catch (error) {
      console.error(
        "Failed to update publish status:",
        error
      );

      alert(
        error.message ||
          "Failed to update publish status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // ============================================
  // DELETE
  // ============================================

  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
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

      await deleteReview(id, token);

      setReviews((current) =>
        current.filter(
          (review) =>
            review.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete review:",
        error
      );

      alert(
        error.message ||
          "Failed to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ============================================
  // FILTER
  // ============================================

  const filteredReviews = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        !query ||
        review.client_name
          ?.toLowerCase()
          .includes(query) ||
        review.client_email
          ?.toLowerCase()
          .includes(query) ||
        review.project_name
          ?.toLowerCase()
          .includes(query) ||
        review.testimonial
          ?.toLowerCase()
          .includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filter === "APPROVED") {
        return review.is_approved;
      }

      if (filter === "PENDING") {
        return !review.is_approved;
      }

      if (filter === "PUBLISHED") {
        return review.is_published;
      }

      if (filter === "UNPUBLISHED") {
        return !review.is_published;
      }

      return true;
    });
  }, [reviews, search, filter]);

  // ============================================
  // STATS
  // ============================================

  const totalReviews =
    reviews.length;

  const approvedReviews =
    reviews.filter(
      (review) =>
        review.is_approved
    ).length;

  const publishedReviews =
    reviews.filter(
      (review) =>
        review.is_published
    ).length;

  const pendingReviews =
    reviews.filter(
      (review) =>
        !review.is_approved
    ).length;

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="page-loading">
          Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="reviews-header">

        <div>
          <div className="breadcrumb">
            ADMIN / REVIEWS
          </div>

          <h1>Reviews</h1>

          <p>
            Manage client testimonials,
            approvals and published reviews.
          </p>

          <button
  type="button"
  className="add-review-button"
  onClick={handleCreateReview}
>
  + Add Review
</button>
        </div>

        <div className="reviews-total">
          <strong>
            {totalReviews}
          </strong>

          <span>
            Total Reviews
          </span>
        </div>

      </div>


      {/* ======================================
          STATS
      ====================================== */}

      <div className="review-stats">

        <div className="review-stat-card">
          <span>Total</span>
          <strong>
            {totalReviews}
          </strong>
        </div>

        <div className="review-stat-card">
          <span>Pending</span>
          <strong>
            {pendingReviews}
          </strong>
        </div>

        <div className="review-stat-card">
          <span>Approved</span>
          <strong>
            {approvedReviews}
          </strong>
        </div>

        <div className="review-stat-card">
          <span>Published</span>
          <strong>
            {publishedReviews}
          </strong>
        </div>

      </div>


      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="reviews-toolbar">

        <input
          type="text"
          placeholder="Search client, project or testimonial..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>


      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="review-filters">

        {[
          ["ALL", "All"],
          ["PENDING", "Pending"],
          ["APPROVED", "Approved"],
          ["PUBLISHED", "Published"],
          ["UNPUBLISHED", "Unpublished"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={
              filter === value
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(value)
            }
          >
            {label}
          </button>
        ))}

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="review-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadReviews}
          >
            Try Again
          </button>
        </div>
      )}

{showForm && (
  <div className="review-form-overlay">

    <div className="review-form-card">

      <div className="review-form-header">

        <div>
          <h2>
            {editingReview
              ? "Edit Review"
              : "Create Review"}
          </h2>

          <p>
            Manage the client testimonial
            and publishing status.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(false)
          }
        >
          ×
        </button>

      </div>


      <form
        onSubmit={handleSaveReview}
      >

        {/* CLIENT */}

        <div className="form-group">

          <label>
            Client
          </label>

          <select
            name="clientId"
            value={form.clientId}
            onChange={
              handleFormChange
            }
          >
            <option value="">
              Select client
            </option>

            {clients.map(
              (client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                  {client.company
                    ? ` — ${client.company}`
                    : ""}
                </option>
              )
            )}
          </select>

        </div>


        {/* PROJECT */}

        <div className="form-group">

          <label>
            Project
          </label>

          <select
            name="projectId"
            value={form.projectId}
            onChange={
              handleFormChange
            }
          >
            <option value="">
              Select project
            </option>

            {projects.map(
              (project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              )
            )}
          </select>

        </div>


        {/* RATING */}

        <div className="form-group">

          <label>
            Rating
          </label>

          <select
            name="rating"
            value={form.rating}
            onChange={
              handleFormChange
            }
          >
            <option value={5}>
              5 — Excellent
            </option>

            <option value={4}>
              4 — Very Good
            </option>

            <option value={3}>
              3 — Good
            </option>

            <option value={2}>
              2 — Poor
            </option>

            <option value={1}>
              1 — Very Poor
            </option>
          </select>

        </div>


        {/* TESTIMONIAL */}

        <div className="form-group">

          <label>
            Testimonial
          </label>

          <textarea
            name="testimonial"
            value={
              form.testimonial
            }
            onChange={
              handleFormChange
            }
            placeholder="Enter client testimonial..."
            rows={6}
          />

        </div>


        {/* STATUS */}

        <div className="review-form-status">

          <label className="checkbox-row">

            <input
              type="checkbox"
              name="isApproved"
              checked={
                form.isApproved
              }
              onChange={
                handleFormChange
              }
            />

            <span>
              Approved
            </span>

          </label>


          <label className="checkbox-row">

            <input
              type="checkbox"
              name="isPublished"
              checked={
                form.isPublished
              }
              disabled={
                !form.isApproved
              }
              onChange={
                handleFormChange
              }
            />

            <span>
              Published
            </span>

          </label>

        </div>


        {!form.isApproved && (
          <p className="publish-warning">
            The review must be approved
            before it can be published.
          </p>
        )}


        {/* ACTIONS */}

        <div className="review-form-actions">

          <button
            type="button"
            onClick={() =>
              setShowForm(false)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-review-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingReview
                ? "Update Review"
                : "Create Review"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}
      {/* ======================================
          REVIEWS
      ====================================== */}

      {!error && (
        <div className="reviews-card">

          {filteredReviews.length === 0 ? (
            <div className="reviews-empty">
              <h2>
                No reviews found
              </h2>

              <p>
                There are no reviews matching
                your current filters.
              </p>
            </div>
          ) : (
            <div className="reviews-list">

              {filteredReviews.map(
                (review) => (
                  <article
                    key={review.id}
                    className="review-item"
                  >

                    {/* TOP */}

                    <div className="review-top">

                      <div>
                        <h2>
                          {review.client_name ||
                            "Unknown Client"}
                        </h2>

                        <p className="review-company">
                          {review.client_company ||
                            review.client_email ||
                            "No company"}
                        </p>
                      </div>

                      <div className="review-rating">
                        {"★".repeat(
                          Number(
                            review.rating
                          )
                        )}

                        <span>
                          {review.rating}/5
                        </span>
                      </div>

                    </div>


                    {/* TESTIMONIAL */}

                    <div className="testimonial">
                      “{review.testimonial}”
                    </div>


                    {/* PROJECT */}

                    <div className="review-project">

                      <span>
                        Project
                      </span>

                      <strong>
                        {review.project_name ||
                          "No project"}
                      </strong>

                    </div>


                    {/* STATUS */}

                    <div className="review-statuses">

                      <span
                        className={
                          review.is_approved
                            ? "status approved"
                            : "status pending"
                        }
                      >
                        {review.is_approved
                          ? "Approved"
                          : "Pending Approval"}
                      </span>

                      <span
                        className={
                          review.is_published
                            ? "status published"
                            : "status unpublished"
                        }
                      >
                        {review.is_published
                          ? "Published"
                          : "Unpublished"}
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="review-actions">

<button
  type="button"
  onClick={() =>
    handleEditReview(review)
  }
>
  Edit
</button>
                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          review.id
                        }
                        onClick={() =>
                          handleApprovalChange(
                            review.id,
                            !review.is_approved
                          )
                        }
                      >
                        {review.is_approved
                          ? "Reject"
                          : "Approve"}
                      </button>


                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          review.id ||
                          !review.is_approved
                        }
                        onClick={() =>
                          handlePublishChange(
                            review.id,
                            !review.is_published
                          )
                        }
                      >
                        {review.is_published
                          ? "Unpublish"
                          : "Publish"}
                      </button>


                      <button
                        type="button"
                        className="delete-button"
                        disabled={
                          deletingId ===
                          review.id
                        }
                        onClick={() =>
                          handleDelete(
                            review.id
                          )
                        }
                      >
                        {deletingId ===
                        review.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}