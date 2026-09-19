"use client";

import "../styles/Stats.css";

export default function Stats({ stats }) {
  const averageRating =
    stats?.averageRating !== null &&
    stats?.averageRating !== undefined
      ? Number(stats.averageRating).toFixed(1)
      : "0.0";

  const items = [
    {
      number: "01",
      value: stats?.totalProjects ?? 0,
      label: "Projects",
      description: "Total projects",
    },
    {
      number: "02",
      value: stats?.completedProjects ?? 0,
      label: "Completed",
      description: "Successfully delivered",
    },
    {
      number: "03",
      value: stats?.activeProjects ?? 0,
      label: "Active",
      description: "Currently in progress",
    },
    {
      number: "04",
      value: stats?.totalReviews ?? 0,
      label: "Reviews",
      description: "Client feedback",
    },
    {
      number: "05",
      value: `${averageRating}/5`,
      label: "Rating",
      description: "Average client rating",
    },
  ];

  return (
    <section
      className="stats"
      aria-labelledby="stats-title"
    >
      <div className="container">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="stats__header">

          <div>
            <p className="eyebrow">
              06. Track Record
            </p>

            <h2
              id="stats-title"
              className="section-title"
            >
              By the{" "}
              <span>numbers.</span>
            </h2>
          </div>

          <p className="stats__intro">
            A simple look at the projects,
            client feedback and work currently
            represented in my portfolio.
          </p>

        </div>

        {/* =================================================
            STATISTICS
            ================================================= */}

        <div className="stats__grid">

          {items.map((item) => (
            <article
              className="stat"
              key={item.number}
            >

              <div className="stat__top">

                <span className="stat__number">
                  {item.number}
                </span>

                <span
                  className="stat__symbol"
                  aria-hidden="true"
                >
                  +
                </span>

              </div>

              <div className="stat__content">

                <strong className="stat__value">
                  {item.value}
                </strong>

                <h3 className="stat__label">
                  {item.label}
                </h3>

                <p className="stat__description">
                  {item.description}
                </p>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}