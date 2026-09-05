"use client";

import { useEffect, useState } from "react";
import "../styles/Skills.css";
import { getSkills } from "../lib/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSkills() {
      try {
        const response = await getSkills();

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        const activeSkills = data.filter(
          (skill) =>
            skill &&
            skill.is_active !== false
        );

        if (mounted) {
          setSkills(activeSkills);
        }
      } catch (error) {
        console.error(
          "Failed to load skills:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="skills"
      className="skills"
      aria-labelledby="skills-title"
    >
      <div className="container">

        <p className="eyebrow">
          03. Skills
        </p>

        <div className="skills__header">

          <h2
            id="skills-title"
            className="section-title"
          >
            Technologies I{" "}
            <span>work with.</span>
          </h2>

          <p className="skills__intro">
            Technologies and tools I use to build
            reliable applications and solve real
            engineering problems.
          </p>

        </div>

        {loading ? (
          <div
            className="skills__state"
            role="status"
            aria-live="polite"
          >
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="skills__state">
            No skills available.
          </div>
        ) : (
          <div className="skills__grid">

            {skills.map((skill) => {

              const proficiency =
                skill.proficiency !== null &&
                skill.proficiency !== undefined
                  ? Math.min(
                      Math.max(
                        Number(skill.proficiency) || 0,
                        0
                      ),
                      100
                    )
                  : null;

              return (
                <article
                  className="skill-card"
                  key={skill.id}
                >

                  <div className="skill-card__top">

                    <h3>
                      {skill.name}
                    </h3>

                    {proficiency !== null && (
                      <span>
                        {proficiency}%
                      </span>
                    )}

                  </div>

                  {skill.category && (
                    <p className="skill-card__category">
                      {skill.category}
                    </p>
                  )}

                  {proficiency !== null && (
                    <div
                      className="skill-card__bar"
                      role="progressbar"
                      aria-valuenow={proficiency}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`${skill.name} proficiency`}
                    >
                      <span
                        style={{
                          width: `${proficiency}%`,
                        }}
                      />
                    </div>
                  )}

                </article>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
}