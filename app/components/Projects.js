"use client";

import { useMemo, useState } from "react";
import "../styles/Projects.css";

const FILTERS = [
  "All",
  "Web Development",
  "Backend",
  "Shopify",
];

function getProjectImage(project) {
  return (
    project?.image_url ||
    project?.imageUrl ||
    project?.image ||
    project?.thumbnail_url ||
    project?.thumbnail ||
    null
  );
}

/*
|--------------------------------------------------------------------------
| Convert any backend project type into one of our frontend categories
|--------------------------------------------------------------------------
*/

function getProjectCategory(project) {
  const type = String(
    project?.type || ""
  )
    .trim()
    .toLowerCase();

  const name = String(
    project?.name || ""
  )
    .trim()
    .toLowerCase();

  const description = String(
    project?.description || ""
  )
    .trim()
    .toLowerCase();

  const searchableText =
    `${type} ${name} ${description}`;

  /* Shopify / E-commerce */

  if (
    searchableText.includes("shopify") ||
    searchableText.includes("ecommerce") ||
    searchableText.includes("e-commerce") ||
    searchableText.includes("online store") ||
    searchableText.includes("storefront")
  ) {
    return "Shopify";
  }

  /* Backend */

  if (
    searchableText.includes("backend") ||
    searchableText.includes("back-end") ||
    searchableText.includes("api") ||
    searchableText.includes("node.js") ||
    searchableText.includes("nodejs") ||
    searchableText.includes("express") ||
    searchableText.includes("postgresql") ||
    searchableText.includes("database")
  ) {
    return "Backend";
  }

  /* Web Development */

  if (
    searchableText.includes("web") ||
    searchableText.includes("website") ||
    searchableText.includes("frontend") ||
    searchableText.includes("front-end") ||
    searchableText.includes("react") ||
    searchableText.includes("next.js") ||
    searchableText.includes("nextjs") ||
    searchableText.includes("javascript")
  ) {
    return "Web Development";
  }

  /*
  |--------------------------------------------------------------------------
  | Fallback based on the original backend type
  |--------------------------------------------------------------------------
  */

  if (
    type.includes("shop")
  ) {
    return "Shopify";
  }

  if (
    type.includes("back")
  ) {
    return "Backend";
  }

  if (
    type.includes("web") ||
    type.includes("front")
  ) {
    return "Web Development";
  }

  return "Web Development";
}

function getProjectNumber(index) {
  return String(index + 1).padStart(2, "0");
}

export default function Projects({ projects }) {
  const projectList = Array.isArray(projects)
    ? projects
    : [];

  const [activeFilter, setActiveFilter] =
    useState("All");

  /*
  |--------------------------------------------------------------------------
  | Featured project
  |--------------------------------------------------------------------------
  */

  const featuredProject =
    projectList.length > 0
      ? projectList[0]
      : null;

  /*
  |--------------------------------------------------------------------------
  | Filter projects
  |--------------------------------------------------------------------------
  */

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projectList;
    }

    return projectList.filter(
      (project) =>
        getProjectCategory(project) ===
        activeFilter
    );
  }, [projectList, activeFilter]);

  /*
  |--------------------------------------------------------------------------
  | Cards below featured project
  |--------------------------------------------------------------------------
  */

  const gridProjects = useMemo(() => {
    return filteredProjects.filter(
      (project) =>
        project?.id !==
        featuredProject?.id
    );
  }, [
    filteredProjects,
    featuredProject,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter counts
  |--------------------------------------------------------------------------
  */

  const filterCounts = useMemo(() => {
    const counts = {
      All: projectList.length,
      "Web Development": 0,
      Backend: 0,
      Shopify: 0,
    };

    projectList.forEach((project) => {
      const category =
        getProjectCategory(project);

      if (counts[category] !== undefined) {
        counts[category] += 1;
      }
    });

    return counts;
  }, [projectList]);

  return (
    <section
      id="work"
      className="projects"
      aria-labelledby="projects-title"
    >
      <div className="container">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="projects__header">

          <div className="projects__title">
            <p className="eyebrow">
              03. My Work
            </p>

            <h2 id="projects-title">
              My
              <br />
              <span>Work.</span>
            </h2>
          </div>

          <div className="projects__intro">
            <p>
              A selection of applications,
              websites and systems I've built
              to solve practical business and
              technical problems.
            </p>

            <span className="projects__intro-line">
              SELECTED PROJECTS
            </span>
          </div>

        </div>

        {/* =================================================
            FEATURED PROJECT
            ================================================= */}

        {featuredProject && (
          <article className="projects__featured">

            <div className="projects__featured-visual">

              {getProjectImage(
                featuredProject
              ) ? (
                <img
                  src={getProjectImage(
                    featuredProject
                  )}
                  alt={
                    featuredProject.name ||
                    "Featured project"
                  }
                />
              ) : (
                <div
                  className="project-visual project-visual--featured"
                  aria-hidden="true"
                >
                  <span>
                    FEATURED
                  </span>

                  <strong>
                    01
                  </strong>

                  <div className="project-visual__grid" />
                </div>
              )}

              <div className="projects__featured-label">
                <span>
                  Featured Project
                </span>

                <span>
                  01
                </span>
              </div>

            </div>

            <div className="projects__featured-info">

              <p className="projects__project-type">
                {getProjectCategory(
                  featuredProject
                )}
              </p>

              <h3>
                {featuredProject.name}
              </h3>

              {featuredProject.description && (
                <p className="projects__featured-description">
                  {featuredProject.description}
                </p>
              )}

              <div className="projects__featured-meta">

                {featuredProject.status && (
                  <span>
                    {featuredProject.status.replace(
                      /_/g,
                      " "
                    )}
                  </span>
                )}

                <span>
                  PROJECT 01
                </span>

              </div>

              <div className="projects__featured-actions">

                {featuredProject.live_url && (
                  <a
                    href={
                      featuredProject.live_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <span>↗</span>
                  </a>
                )}

                {featuredProject.github_url && (
                  <a
                    href={
                      featuredProject.github_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                    <span>↗</span>
                  </a>
                )}

              </div>

            </div>

          </article>
        )}

        {/* =================================================
            FILTERS
            ================================================= */}

        <div className="projects__filter-row">

          <div className="projects__filter-label">
            <span>
              Filter by
            </span>
          </div>

          <div className="projects__filters">

            {FILTERS.map((filter) => {

              const count =
                filterCounts[filter] || 0;

              return (
                <button
                  type="button"
                  key={filter}
                  className={
                    activeFilter === filter
                      ? "projects__filter projects__filter--active"
                      : "projects__filter"
                  }
                  onClick={() =>
                    setActiveFilter(filter)
                  }
                  aria-pressed={
                    activeFilter === filter
                  }
                >
                  <span>
                    {filter}
                  </span>

                  <small>
                    {String(count).padStart(
                      2,
                      "0"
                    )}
                  </small>
                </button>
              );
            })}

          </div>

        </div>

        {/* =================================================
            PROJECT GRID
            ================================================= */}

        {gridProjects.length === 0 ? (

          <div className="projects__state">
            {activeFilter === "All"
              ? "No additional projects available."
              : `No ${activeFilter} projects available.`}
          </div>

        ) : (

          <div className="projects__grid">

            {gridProjects.map(
              (project, index) => {

                const image =
                  getProjectImage(
                    project
                  );

                return (
                  <article
                    className="project-card"
                    key={
                      project.id ||
                      `${project.name}-${index}`
                    }
                  >

                    {/* Project visual */}

                    <a
                      className="project-card__visual"
                      href={
                        project.live_url ||
                        project.github_url ||
                        "#"
                      }
                      target={
                        project.live_url ||
                        project.github_url
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        project.live_url ||
                        project.github_url
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={`View ${project.name}`}
                    >

                      {image ? (
                        <img
                          src={image}
                          alt={
                            project.name
                          }
                        />
                      ) : (
                        <div
                          className={`project-visual project-visual--${
                            (index % 3) + 1
                          }`}
                          aria-hidden="true"
                        >

                          <span>
                            PROJECT
                          </span>

                          <strong>
                            {String(
                              index + 2
                            ).padStart(
                              2,
                              "0"
                            )}
                          </strong>

                          <div className="project-visual__grid" />

                        </div>
                      )}

                      <div className="project-card__overlay">

                        <span>
                          Show Project
                        </span>

                        <strong>
                          ↗
                        </strong>

                      </div>

                    </a>

                    {/* Project information */}

                    <div className="project-card__content">

                      <div className="project-card__top">

                        <span className="project-card__number">
                          {getProjectNumber(
                            index + 1
                          )}
                        </span>

                        <span className="project-card__type">
                          {getProjectCategory(
                            project
                          )}
                        </span>

                      </div>

                      <h3>
                        {project.name}
                      </h3>

                      {project.description && (
                        <p>
                          {project.description}
                        </p>
                      )}

                      <div className="project-card__bottom">

                        {project.status && (
                          <span>
                            {project.status.replace(
                              /_/g,
                              " "
                            )}
                          </span>
                        )}

                        <div>

                          {project.github_url && (
                            <a
                              href={
                                project.github_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              GitHub ↗
                            </a>
                          )}

                          {project.live_url && (
                            <a
                              href={
                                project.live_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Live ↗
                            </a>
                          )}

                        </div>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </div>
    </section>
  );
}