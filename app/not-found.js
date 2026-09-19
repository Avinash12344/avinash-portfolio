import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page__inner">
        <span className="error-page__code">404</span>

        <h1>Page not found.</h1>

        <p>
          The page you're looking for doesn't exist — it
          may have moved, or the link might be broken.
        </p>

        <div className="error-page__actions">
          <Link href="/" className="error-page__button">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}