"use client";

import "../styles/Reviews.css";

export default function Reviews({ reviews }) {
  const reviewList = Array.isArray(reviews)
    ? reviews
    : [];

  return (
    <section
      id="reviews"
      className="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="container">

        {/* =================================================
            SECTION HEADER
            ================================================= */}

        <div className="reviews__header">

          <div className="reviews__title">
            <p className="eyebrow">
              04. Testimonials
            </p>

            <h2
              id="reviews-title"
              className="section-title"
            >
              What clients{" "}
              <span>say.</span>
            </h2>
          </div>

          <div className="reviews__intro">
            <p>
              Honest feedback from people I've
              worked with on real projects,
              products and technical solutions.
            </p>

            <span>
              CLIENT FEEDBACK
            </span>
          </div>

        </div>

        {/* =================================================
            REVIEWS
            ================================================= */}

        {reviewList.length === 0 ? (

          <div className="reviews__empty">

            <div
              className="reviews__empty-mark"
              aria-hidden="true"
            >
              “
            </div>

            <p>
              No client reviews have been
              published yet.
            </p>

            <span>
              Approved client feedback will
              appear here.
            </span>

          </div>

        ) : (

          <div className="reviews__grid">

            {reviewList.map((review, index) => {

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
                  key={
                    review.id ||
                    `review-${index}`
                  }
                >

                  {/* TOP */}

                  <div className="review-card__top">

                    <span className="review-card__number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div
                      className="review-card__rating"
                      aria-label={`${rating} out of 5 stars`}
                    >
                      {"★".repeat(rating)}
                      {"☆".repeat(5 - rating)}
                    </div>

                  </div>

                  {/* QUOTE */}

                  <div className="review-card__quote">

                    <span
                      className="review-card__quote-mark"
                      aria-hidden="true"
                    >
                      “
                    </span>

                    <blockquote>
                      {review.testimonial ||
                        "Great working experience."}
                    </blockquote>

                  </div>

                  {/* CLIENT */}

                  <div className="review-card__client">

                    <div>
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

                    <span
                      className="review-card__arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>

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