"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/Projects.css";

function getProjectImage(project) {
  return project?.thumbnailUrl || null;
}

function getProjectLink(project) {
  if (project.source === "portfolio" && project.slug) {
    return { type: "internal", href: `/work/${project.slug}` };
  }
  if (project.liveUrl) {
    return { type: "external", href: project.liveUrl };
  }
  if (project.githubUrl) {
    return { type: "external", href: project.githubUrl };
  }
  return null;
}

export default function Projects({ work }) {
  const workList = Array.isArray(work) ? work : [];

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTechs, setActiveTechs] = useState([]);

  /* ----------------------------------------
     DERIVED DATA
     ---------------------------------------- */

  const categories = useMemo(() => {
    const set = new Set();
    workList.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [workList]);

  const techOptions = useMemo(() => {
    const counts = new Map();
    workList.forEach((p) => {
      (p.techStack || []).forEach((tech) => {
        counts.set(tech, (counts.get(tech) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tech]) => tech);
  }, [workList]);

  const featuredProject = useMemo(() => {
    if (workList.length === 0) return null;
    return workList.find((p) => p.isFeatured) || workList[0];
  }, [workList]);

  const filteredWork = useMemo(() => {
    return workList.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesTech =
        activeTechs.length === 0 ||
        activeTechs.every((tech) => (p.techStack || []).includes(tech));
      return matchesCategory && matchesTech;
    });
  }, [workList, activeCategory, activeTechs]);

  const showFeatured =
    activeCategory === "All" && activeTechs.length === 0 && featuredProject;

  const gridItems = showFeatured
    ? filteredWork.filter((p) => p.id !== featuredProject.id)
    : filteredWork;

  /* ----------------------------------------
     EARLY RETURN
     ---------------------------------------- */

  if (workList.length === 0) return null;

  /* ----------------------------------------
     HANDLERS
     ---------------------------------------- */

  function toggleTech(tech) {
    setActiveTechs((current) =>
      current.includes(tech)
        ? current.filter((t) => t !== tech)
        : [...current, tech]
    );
  }

  function clearTechs() {
    setActiveTechs([]);
  }

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="container work__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="work__label">Work</p>

        {/* ----------------------------------------
            HEADER
            ---------------------------------------- */}

        <div className="work__top">
          <h2 id="work-title" className="work__heading">
            Selected <em>work.</em>
          </h2>

          <p className="work__aside">
            Personal projects and client work — everything I&rsquo;ve
            shipped, big and small.
          </p>
        </div>

        {/* ----------------------------------------
            FEATURED
            ---------------------------------------- */}

        {showFeatured && <FeaturedProject project={featuredProject} />}

        {/* ----------------------------------------
            FILTERS
            ---------------------------------------- */}

        {(categories.length > 1 || techOptions.length > 0) && (
          <div className="work__filters">
            {categories.length > 1 && (
              <div className="work__filter-row">
                <span className="work__filter-label">Filter</span>

                <div className="work__filter-chips">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    const count =
                      cat === "All"
                        ? workList.length
                        : workList.filter((p) => p.category === cat).length;

                    return (
                      <button
                        type="button"
                        key={cat}
                        className={
                          isActive
                            ? "work__chip work__chip--active"
                            : "work__chip"
                        }
                        onClick={() => setActiveCategory(cat)}
                        aria-pressed={isActive}
                      >
                        {cat}
                        <small>{String(count).padStart(2, "0")}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {techOptions.length > 0 && (
              <div className="work__filter-row">
                <span className="work__filter-label">Stack</span>

                <div className="work__filter-chips">
                  {techOptions.map((tech) => {
                    const isActive = activeTechs.includes(tech);
                    return (
                      <button
                        type="button"
                        key={tech}
                        className={
                          isActive
                            ? "work__chip work__chip--tech-active"
                            : "work__chip work__chip--tech"
                        }
                        onClick={() => toggleTech(tech)}
                        aria-pressed={isActive}
                      >
                        {tech}
                      </button>
                    );
                  })}

                  {activeTechs.length > 0 && (
                    <button
                      type="button"
                      className="work__chip-clear"
                      onClick={clearTechs}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------
            GRID
            ---------------------------------------- */}

        {gridItems.length === 0 ? (
          <div className="work__empty">
            <p>No projects match the current filters.</p>
          </div>
        ) : (
          <div className="work__grid">
            {gridItems.map((project, index) => (
              <ProjectTile
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ========================================
   FEATURED PROJECT
   ======================================== */

function FeaturedProject({ project }) {
  const image = getProjectImage(project);
  const link = getProjectLink(project);

  const content = (
    <>
      <div className="featured-project__visual">
        {image ? (
          <Image
            src={image}
            alt={project.name}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="featured-project__placeholder" aria-hidden="true">
            <span>Featured</span>
          </div>
        )}
      </div>

      <div className="featured-project__info">
        <div className="featured-project__badges">
          <span className="featured-project__badge featured-project__badge--accent">
            Featured
          </span>

          <span className="featured-project__badge">
            {project.source === "portfolio" ? "Personal" : "Client"}
          </span>
        </div>

        <h3 className="featured-project__title">{project.name}</h3>

        {(project.tagline || project.description) && (
          <p className="featured-project__tagline">
            {project.tagline || project.description}
          </p>
        )}

        {project.techStack?.length > 0 && (
          <div className="featured-project__stack">
            {project.techStack.slice(0, 6).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        )}

        {link && (
          <span className="featured-project__cta">
            {link.type === "internal" ? "View case study" : "View project"}
            <span className="featured-project__cta-arrow" aria-hidden="true">
              →
            </span>
          </span>
        )}
      </div>
    </>
  );

  const className = "featured-project";

  if (link?.type === "internal") {
    return (
      <Link href={link.href} className={className}>
        {content}
      </Link>
    );
  }

  if (link?.type === "external") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
}

/* ========================================
   PROJECT TILE
   ======================================== */

function ProjectTile({ project, index }) {
  const image = getProjectImage(project);
  const link = getProjectLink(project);

  const content = (
    <>
      <div className="project-tile__visual">
        {image ? (
          <Image
            src={image}
            alt={project.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="project-tile__placeholder" aria-hidden="true">
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
        )}
      </div>

      <div className="project-tile__info">
        <span className="project-tile__category">{project.category}</span>

        <h3 className="project-tile__title">{project.name}</h3>

        {project.tagline && (
          <p className="project-tile__tagline">{project.tagline}</p>
        )}

        {project.techStack?.length > 0 && (
          <div className="project-tile__stack">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        )}

        {link && (
          <span className="project-tile__cta">
            {link.type === "internal" ? "Case study" : "View"}
            <span className="project-tile__cta-arrow" aria-hidden="true">
              →
            </span>
          </span>
        )}
      </div>
    </>
  );

  const className = "project-tile";

  if (link?.type === "internal") {
    return (
      <Link href={link.href} className={className}>
        {content}
      </Link>
    );
  }

  if (link?.type === "external") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
}