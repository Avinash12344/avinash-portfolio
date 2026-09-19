"use client";

import "../styles/Stats.css";

export default function Stats({ stats }) {
  const totalProjects = Number(stats?.totalProjects) || 0;
  const totalReviews = Number(stats?.totalReviews) || 0;
  const completedProjects = Number(stats?.completedProjects) || 0;
  const averageRating = Number(stats?.averageRating) || 0;

  // Hide entirely if there's nothing worth showing
  if (totalProjects === 0 && totalReviews === 0) {
    return null;
  }

  const items = [
    {
      value: totalProjects,
      label: "Projects",
      description: "Total shipped",
    },
    {
      value: completedProjects,
      label: "Delivered",
      description: "In production",
    },
    {
      value: totalReviews,
      label: "Reviews",
      description: "Client feedback",
    },
    {
      value: `${averageRating.toFixed(1)}`,
      suffix: "/5",
      label: "Rating",
      description: "Average across clients",
    },
  ];

  return (
    <section className="stats" aria-labelledby="stats-title">
      <div className="container stats__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="stats__label">Track record</p>

        {/* ----------------------------------------
            HEADER
            ---------------------------------------- */}

        <div className="stats__top">
          <h2 id="stats-title" className="stats__heading">
            By the <em>numbers.</em>
          </h2>

          <p className="stats__aside">
            A running count of everything represented in this
            portfolio — updated as new work ships.
          </p>
        </div>

        {/* ----------------------------------------
            GRID
            ---------------------------------------- */}

        <div className="stats__grid">
          {items.map((item, i) => (
            <div className="stat" key={i}>
              <div className="stat__value">
                {item.value}
                {item.suffix && (
                  <span className="stat__suffix">{item.suffix}</span>
                )}
              </div>

              <div className="stat__label">{item.label}</div>

              <div className="stat__description">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}