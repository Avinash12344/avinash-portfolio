"use client";

import "../styles/Skills.css";

const fallbackSkills = [
  {
    id: "fallback-1",
    name: "JavaScript",
    category: "Frontend / Backend",
    proficiency: 85,
  },
  {
    id: "fallback-2",
    name: "React",
    category: "Frontend",
    proficiency: 85,
  },
  {
    id: "fallback-3",
    name: "Node.js",
    category: "Backend",
    proficiency: 80,
  },
  {
    id: "fallback-4",
    name: "PostgreSQL",
    category: "Database",
    proficiency: 75,
  },
];

export default function Skills({ skills }) {
  const activeSkills =
    Array.isArray(skills)
      ? skills.filter(
          (skill) =>
            skill &&
            skill.is_active !== false
        )
      : [];

  const skillList =
    activeSkills.length > 0
      ? activeSkills
      : fallbackSkills;

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

        <div className="skills__grid">
          {skillList.map((skill, index) => {
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
                key={skill.id || index}
              >
                <div className="skill-card__top">
                  <h3>{skill.name}</h3>

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
      </div>
    </section>
  );
}