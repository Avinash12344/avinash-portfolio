"use client";

import "../styles/Reviews.css";

export default function Reviews({ reviews }) {
  const reviewList = Array.isArray(reviews)
    ? reviews.filter((r) => r && r.is_published !== false)
    : [];

  // Hide entire section when no published reviews exist
  if (reviewList.length === 0) return null;

  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <div className="container reviews__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="reviews__label">Testimonials</p>

        {/* ----------------------------------------
            HEADER
            ---------------------------------------- */}

        <div className="reviews__top">
          <h2 id="reviews-title" className="reviews__heading">
            What clients <em>say.</em>
          </h2>

          <p className="reviews__aside">
            Feedback from people I&rsquo;ve worked with on real
            projects and long-term engagements.
          </p>
        </div>

        {/* ----------------------------------------
            LIST
            ---------------------------------------- */}

        <div className="reviews__grid">
          {reviewList.map((review, index) => {
            const rating = Math.min(
              Math.max(Number(review.rating) || 0, 0),
              5
            );

            return (
              <article
                className="review"
                key={review.id || `review-${index}`}
              >
                <div className="review__rating" aria-label={`${rating} out of 5`}>
                  <span aria-hidden="true">
                    {"★".repeat(rating)}
                    <span className="review__rating-empty">
                      {"★".repeat(5 - rating)}
                    </span>
                  </span>
                </div>

                <blockquote className="review__quote">
                  {review.testimonial}
                </blockquote>

                <div className="review__author">
                  <strong className="review__name">
                    {review.client_name}
                  </strong>

                  {review.project_name && (
                    <span className="review__project">
                      {review.project_name}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}