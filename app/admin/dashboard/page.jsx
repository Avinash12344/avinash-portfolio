"use client";

import "../../styles/admin/Admin.css";

import { useEffect, useState } from "react";
import { getDashboard } from "../../lib/api";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
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
      await getDashboard(token);

    setDashboard(response.data);
  } catch (error) {
    console.error(
      "Failed to load dashboard:",
      error
    );

    setError(
      error.message ||
        "Failed to load dashboard."
    );
  } finally {
    setLoading(false);
  }
}

  return (
   <div className="admin-dashboard">

  <div className="dashboard-header">
    <div>
      <h1>Dashboard</h1>

      <p>
        Overview of your portfolio business.
      </p>
    </div>

    <button
      type="button"
      onClick={loadDashboard}
    >
      Refresh
    </button>
  </div>


  {loading && (
    <div className="page-loading">
      Loading dashboard...
    </div>
  )}


  {error && (
    <div className="page-error">
      {error}
    </div>
  )}


  {!loading &&
    !error &&
    dashboard && (
      <>
        {/* ==================================
            STAT CARDS
        ================================== */}

        <div className="dashboard-stats">

          <div className="dashboard-card">
            <span>Clients</span>

            <strong>
              {
                dashboard.counts
                  .total_clients
              }
            </strong>
          </div>


          <div className="dashboard-card">
            <span>Enquiries</span>

            <strong>
              {
                dashboard.counts
                  .total_enquiries
              }
            </strong>
          </div>


          <div className="dashboard-card">
            <span>Proposals</span>

            <strong>
              {
                dashboard.counts
                  .total_proposals
              }
            </strong>
          </div>


          <div className="dashboard-card">
            <span>Projects</span>

            <strong>
              {
                dashboard.counts
                  .total_projects
              }
            </strong>
          </div>


          <div className="dashboard-card">
            <span>Reviews</span>

            <strong>
              {
                dashboard.counts
                  .total_reviews
              }
            </strong>
          </div>


          <div className="dashboard-card">
            <span>Published Reviews</span>

            <strong>
              {
                dashboard.counts
                  .published_reviews
              }
            </strong>
          </div>

        </div>

        {/* ==================================
    ANALYTICS
================================== */}

<div className="dashboard-analytics">

  {/* ENQUIRIES BY STATUS */}

  <section className="dashboard-section">

    <div className="section-header">
      <h2>Enquiries by Status</h2>
    </div>

    {dashboard.enquiryStatus.length === 0 ? (
      <p className="empty-state">
        No enquiry data available.
      </p>
    ) : (
      <div className="analytics-list">

        {dashboard.enquiryStatus.map(
          (item) => (
            <div
              className="analytics-row"
              key={item.status}
            >
              <div className="analytics-label">
                <span>
                  {item.status}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-bar-fill"
                  style={{
                    width: `${
                      Math.min(
                        100,
                        (
                          Number(item.count) /
                          Math.max(
                            ...dashboard.enquiryStatus.map(
                              (item) =>
                                Number(item.count)
                            )
                          )
                        ) * 100
                      )
                    }%`,
                  }}
                />
              </div>
            </div>
          )
        )}

      </div>
    )}

  </section>


  {/* PROJECTS BY STATUS */}

  <section className="dashboard-section">

    <div className="section-header">
      <h2>Projects by Status</h2>
    </div>

    {dashboard.projectStatus.length === 0 ? (
      <p className="empty-state">
        No project data available.
      </p>
    ) : (
      <div className="analytics-list">

        {dashboard.projectStatus.map(
          (item) => (
            <div
              className="analytics-row"
              key={item.status}
            >
              <div className="analytics-label">
                <span>
                  {item.status}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-bar-fill"
                  style={{
                    width: `${
                      Math.min(
                        100,
                        (
                          Number(item.count) /
                          Math.max(
                            ...dashboard.projectStatus.map(
                              (item) =>
                                Number(item.count)
                            )
                          )
                        ) * 100
                      )
                    }%`,
                  }}
                />
              </div>
            </div>
          )
        )}

      </div>
    )}

  </section>

</div>


        {/* ==================================
            RECENT ENQUIRIES
        ================================== */}

        <section className="dashboard-section">

          <div className="section-header">
            <h2>
              Recent Enquiries
            </h2>
          </div>

          {dashboard.recentEnquiries
            .length === 0 ? (
            <p className="empty-state">
              No enquiries yet.
            </p>
          ) : (
            <div className="dashboard-list">

              {dashboard.recentEnquiries.map(
                (enquiry) => (
                  <div
                    className="dashboard-list-row"
                    key={enquiry.id}
                  >

                    <div>
                      <strong>
                        {enquiry.client_name}
                      </strong>

                      <span>
                        {enquiry.project_type}
                      </span>
                    </div>

                    <span
                      className={`status-badge ${enquiry.status.toLowerCase()}`}
                    >
                      {enquiry.status}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </section>


        {/* ==================================
            RECENT PROJECTS
        ================================== */}

        <section className="dashboard-section">

          <div className="section-header">
            <h2>
              Recent Projects
            </h2>
          </div>

          {dashboard.recentProjects
            .length === 0 ? (
            <p className="empty-state">
              No projects yet.
            </p>
          ) : (
            <div className="dashboard-list">

              {dashboard.recentProjects.map(
                (project) => (
                  <div
                    className="dashboard-list-row"
                    key={project.id}
                  >

                    <div>
                      <strong>
                        {project.name}
                      </strong>

                      <span>
                        {project.client_name ||
                          "Portfolio Project"}
                      </span>
                    </div>

                    <span
                      className={`status-badge ${project.status.toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </section>


<section className="dashboard-section">

  <div className="section-header">

    <div>
      <h2>
        Monthly Activity
      </h2>

      <p>
        Last 6 months
      </p>
    </div>

  </div>


  <div className="monthly-analytics">

    {/* ENQUIRIES */}

    <div className="monthly-card">

      <h3>Enquiries</h3>

      <div className="monthly-bars">

        {dashboard.monthlyEnquiries.map(
          (item) => (
            <div
              className="monthly-bar-item"
              key={item.month}
            >

              <div className="monthly-bar-wrapper">

                <div
                  className="monthly-bar"
                  style={{
                    height: `${
                      Math.max(
                        8,
                        (
                          Number(item.count) /
                          Math.max(
                            1,
                            ...dashboard.monthlyEnquiries.map(
                              (item) =>
                                Number(item.count)
                            )
                          )
                        ) * 160
                      )
                      }px`,
                  }}
                  title={`${item.count} enquiries`}
                />

              </div>

              <span>
                {item.month.slice(5)}
              </span>

              <strong>
                {item.count}
              </strong>

            </div>
          )
        )}

      </div>

    </div>


    {/* PROPOSALS */}

    <div className="monthly-card">

      <h3>Proposals</h3>

      <div className="monthly-bars">

        {dashboard.monthlyProposals.map(
          (item) => (
            <div
              className="monthly-bar-item"
              key={item.month}
            >

              <div className="monthly-bar-wrapper">

                <div
                  className="monthly-bar"
                  style={{
                    height: `${
                      Math.max(
                        8,
                        (
                          Number(item.count) /
                          Math.max(
                            1,
                            ...dashboard.monthlyProposals.map(
                              (item) =>
                                Number(item.count)
                            )
                          )
                        ) * 160
                      )
                      }px`,
                    
                    }}
                  title={`${item.count} proposals`}
                />

              </div>

              <span>
                {item.month.slice(5)}
              </span>

              <strong>
                {item.count}
              </strong>

            </div>
          )
        )}

      </div>

    </div>

  </div>

</section>


        {/* ==================================
            RECENT REVIEWS
        ================================== */}

        <section className="dashboard-section">

          <div className="section-header">
            <h2>
              Recent Reviews
            </h2>
          </div>

          {dashboard.recentReviews
            .length === 0 ? (
            <p className="empty-state">
              No reviews yet.
            </p>
          ) : (
            <div className="dashboard-list">

              {dashboard.recentReviews.map(
                (review) => (
                  <div
                    className="dashboard-list-row"
                    key={review.id}
                  >

                    <div>
                      <strong>
                        {review.client_name ||
                          "Unknown Client"}
                      </strong>

                      <span>
                        {review.project_name ||
                          "Unknown Project"}
                      </span>
                    </div>

                    <strong>
                      {"★".repeat(
                        review.rating
                      )}
                    </strong>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </>
    )}

</div>
  );
}