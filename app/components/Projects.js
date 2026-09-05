"use client";

import { useEffect, useState } from "react";
import "../styles/Projects.css";
import { getProjects } from "../lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const response = await getProjects();

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        if (mounted) {
          setProjects(data);
        }
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="work"
      className="projects"
      aria-labelledby="projects-title"
    >
      <div className="container">

        <p className="eyebrow">
          04. Selected Work
        </p>

        <div className="projects__header">

          <h2
            id="projects-title"
            className="section-title"
          >
            Things I've{" "}
            <span>built.</span>
          </h2>

          <p className="projects__intro">
            A selection of applications and
            systems built to solve practical
            business and technical problems.
          </p>

        </div>


        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (
          <div
            className="projects__state"
            role="status"
            aria-live="polite"
          >
            Loading projects...
          </div>
        )}


        {/* ====================================
            EMPTY
        ==================================== */}

        {!loading &&
          projects.length === 0 && (
            <div className="projects__state">
              No projects available.
            </div>
          )}


        {/* ====================================
            PROJECTS
        ==================================== */}

        {!loading &&
          projects.length > 0 && (
            <div className="projects__grid">

              {projects.map(
                (project, index) => (
                  <article
                    className="project-card"
                    key={project.id}
                  >

                    {/* TOP */}

                    <div className="project-card__top">

                      <span
                        className="project-card__number"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>


                      <div className="project-card__links">

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} GitHub repository`}
                          >
                            GitHub ↗
                          </a>
                        )}

                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} live website`}
                          >
                            Live ↗
                          </a>
                        )}

                      </div>

                    </div>


                    {/* TITLE */}

                    <h3>
                      {project.name}
                    </h3>


                    {/* DESCRIPTION */}

                    {project.description && (
                      <p>
                        {project.description}
                      </p>
                    )}


                    {/* META */}

                    <div className="project-card__meta">

                      {project.type && (
                        <span>
                          {project.type}
                        </span>
                      )}

                      {project.status && (
                        <span>
                          {project.status
                            .replace(
                              /_/g,
                              " "
                            )}
                        </span>
                      )}

                    </div>

                  </article>
                )
              )}

            </div>
          )}

      </div>
    </section>
  );
}