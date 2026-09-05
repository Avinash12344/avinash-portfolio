"use client";

import { useEffect, useState } from "react";
import "../styles/Reviews.css";
import { getReviews } from "../lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await getReviews();

        console.log("Reviews API response:", response);

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        if (mounted) {
          setReviews(data);
        }
      } catch (error) {
        console.error(
          "Failed to load reviews:",
          error
        );

        if (mounted) {
          setError(
            error.message ||
              "Unable to load reviews."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="reviews"
      className="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="container">

        <p className="eyebrow">
          05. Client Reviews
        </p>

        <div className="reviews__header">

          <h2
            id="reviews-title"
            className="section-title"
          >
            What clients{" "}
            <span>say.</span>
          </h2>

          <p className="reviews__intro">
            Feedback from clients I've worked
            with on real projects.
          </p>

        </div>


        {/* LOADING */}

        {loading && (
          <div
            className="reviews__state"
            role="status"
            aria-live="polite"
          >
            Loading reviews...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div
            className="reviews__state reviews__state--error"
            role="alert"
          >
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          reviews.length === 0 && (
            <div className="reviews__empty">

              <div
                className="reviews__empty-rating"
                aria-hidden="true"
              >
                ★★★★★
              </div>

              <p>
                No client reviews have been
                published yet.
              </p>

              <span>
                Reviews will appear here once
                they are approved and published.
              </span>

            </div>
          )}


        {/* REVIEWS */}

        {!loading &&
          !error &&
          reviews.length > 0 && (
            <div className="reviews__grid">

              {reviews.map((review) => {

                const rating = Math.min(
                  Math.max(
                    Number(review.rating) || 0,
                    0
                  ),
                  5
                );

                return (
                  <article
                    className="review-card"
                    key={review.id}
                  >

                    {/* RATING */}

                    <div
                      className="review-card__rating"
                      aria-label={`${rating} out of 5 stars`}
                    >
                      {"★".repeat(rating)}
                      {"☆".repeat(5 - rating)}
                    </div>


                    {/* TESTIMONIAL */}

                    <blockquote>
                      <p>
                        "{review.testimonial}"
                      </p>
                    </blockquote>


                    {/* CLIENT */}

                    <div className="review-card__client">

                      <strong>
                        {review.client_name ||
                          "Client"}
                      </strong>

                      {review.project_name && (
                        <span>
                          {review.project_name}
                        </span>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </div>
    </section>
  );
}