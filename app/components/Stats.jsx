"use client";

import { useEffect, useState } from "react";
import "../styles/Stats.css";
import { getStats } from "../lib/api";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const response = await getStats();

        if (mounted) {
          setStats(response?.data || {});
        }
      } catch (error) {
        console.error(
          "Failed to load stats:",
          error
        );
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  const averageRating =
    stats?.averageRating !== null &&
    stats?.averageRating !== undefined
      ? `${Number(stats.averageRating).toFixed(1)}/5`
      : "0.0/5";

  const items = [
    {
      value: stats?.totalProjects ?? 0,
      label: "Projects",
      description: "Built & delivered",
    },
    {
      value: stats?.completedProjects ?? 0,
      label: "Completed",
      description: "Successfully finished",
    },
    {
      value: stats?.activeProjects ?? 0,
      label: "Active",
      description: "Currently in progress",
    },
    {
      value: stats?.totalReviews ?? 0,
      label: "Reviews",
      description: "Client feedback",
    },
    {
      value: averageRating,
      label: "Rating",
      description: "Average client rating",
    },
  ];

  return (
    <section
      className="stats"
      aria-label="Professional statistics"
    >
      <div className="container">
        <div className="stats__header">
          <p className="eyebrow">
            06. Track Record
          </p>

          <p className="stats__intro">
            A quick look at the work,
            projects, and feedback behind
            my experience.
          </p>
        </div>

        <div className="stats__grid">
          {items.map((item, index) => (
            <article
              className="stat"
              key={item.label}
            >
              <div className="stat__top">
                <span className="stat__number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span
                  className="stat__mark"
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