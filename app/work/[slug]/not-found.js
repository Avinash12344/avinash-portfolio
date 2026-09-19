import Link from "next/link";

export default function WorkNotFound() {
  return (
    <div className="error-page">
      <div className="error-page__inner">
        <span className="error-page__code">404</span>

        <h1>Project not found.</h1>

        <p>
          This project doesn't exist or hasn't been published yet.
        </p>

        <div className="error-page__actions">
          <Link href="/#work" className="error-page__button">
            Back to Work
          </Link>
        </div>
      </div>
    </div>
  );
}