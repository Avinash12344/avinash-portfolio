import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getWorkBySlug } from "@/lib/api";

import "../../styles/work-detail.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await getWorkBySlug(slug);
    const project = response?.data;

    if (!project) return { title: "Project not found" };

    const description =
      project.tagline ||
      project.description?.slice(0, 155) ||
      "Project by Avinash Vishwakarma";

    return {
      title: project.name,
      description,
      alternates: { canonical: `/work/${project.slug}` },
      openGraph: {
        title: `${project.name} | Avinash Vishwakarma`,
        description,
        type: "article",
        images: project.thumbnailUrl
          ? [{ url: project.thumbnailUrl }]
          : undefined,
      },
    };
  } catch {
    return { title: "Project not found" };
  }
}

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;

  let project = null;

  try {
    const response = await getWorkBySlug(slug);
    project = response?.data || null;
  } catch (error) {
    console.error("Failed to load project:", error);
  }

  if (!project) notFound();

  return (
    <>
      <Navbar />

      <article className="detail">
        <div className="container detail__container">
          {/* ----------------------------------
              BACK
              ---------------------------------- */}

          <Link href="/#work" className="detail__back">
            <span aria-hidden="true">←</span> Back to Work
          </Link>

          {/* ----------------------------------
              HEADER
              ---------------------------------- */}

          <header className="detail__header">
            <div className="detail__meta">
              <span className="detail__category">{project.category}</span>

              <span className="detail__badge">
                {project.source === "portfolio" ? "Personal" : "Client"} Work
              </span>
            </div>

            <h1 className="detail__title">{project.name}</h1>

            {project.tagline && (
              <p className="detail__tagline">{project.tagline}</p>
            )}

            {(project.liveUrl || project.githubUrl) && (
              <div className="detail__actions">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail__action detail__action--primary"
                  >
                    Live site
                    <span aria-hidden="true">↗</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail__action"
                  >
                    View code
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </header>

          {/* ----------------------------------
              HERO IMAGE
              ---------------------------------- */}

          {project.thumbnailUrl && (
            <div className="detail__hero">
              <Image
                src={project.thumbnailUrl}
                alt={project.name}
                width={1600}
                height={900}
                style={{ width: "100%", height: "auto" }}
                priority
              />
            </div>
          )}

          {/* ----------------------------------
              OVERVIEW
              ---------------------------------- */}

          <section className="detail__section">
            <h2 className="detail__section-label">Overview</h2>

            {project.description ? (
              <div className="detail__prose">
                {project.description
                  .split("\n")
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
            ) : (
              <p className="detail__muted">No description provided.</p>
            )}
          </section>

          {/* ----------------------------------
              TECH STACK
              ---------------------------------- */}

          {project.techStack?.length > 0 && (
            <section className="detail__section">
              <h2 className="detail__section-label">Tech stack</h2>

              <div className="detail__stack">
                {project.techStack.map((tech) => (
                  <span key={tech} className="detail__stack-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ----------------------------------
              EXCEPTIONAL WORK
              ---------------------------------- */}

          {project.exceptionalWork?.length > 0 && (
            <section className="detail__section detail__section--highlight">
              <h2 className="detail__section-label detail__section-label--accent">
                What I did exceptionally
              </h2>

              <ul className="detail__wins">
                {project.exceptionalWork.map((win, i) => (
                  <li key={i} className="detail__win">
                    <span className="detail__win-marker" aria-hidden="true">
                      →
                    </span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ----------------------------------
              GALLERY
              ---------------------------------- */}

          {project.images?.length > 0 && (
            <section className="detail__section">
              <h2 className="detail__section-label">Gallery</h2>

              <div className="detail__gallery">
                {project.images.map((img, i) => (
                  <figure
                    key={img.id || i}
                    className="detail__gallery-item"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${project.name} — image ${i + 1}`}
                      width={1600}
                      height={1000}
                      style={{ width: "100%", height: "auto" }}
                    />

                    {img.caption && (
                      <figcaption className="detail__caption">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* ----------------------------------
              FOOTER CTA
              ---------------------------------- */}

         
        </div>
      </article>

      <Footer />
    </>
  );
}