"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-page__inner">
        <span className="error-page__code">500</span>

        <h1>Something went wrong.</h1>

        <p>
          An unexpected error occurred while loading this
          page. It's probably my fault, not yours.
        </p>

        <div className="error-page__actions">
          <button onClick={reset} className="error-page__button">
            Try again
          </button>

          <a href="/" className="error-page__link">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}