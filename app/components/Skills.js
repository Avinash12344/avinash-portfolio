"use client";

import "../styles/Skills.css";

function groupByCategory(skills) {
  const grouped = new Map();

  for (const skill of skills) {
    const cat = (skill.category || "Other").trim();
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(skill.name);
  }

  return Array.from(grouped.entries()).map(([category, items]) => ({
    category,
    skills: items,
  }));
}

export default function Skills({ skills }) {
  const activeSkills = Array.isArray(skills)
    ? skills.filter((s) => s && s.is_active !== false)
    : [];

  if (activeSkills.length === 0) return null;

  const groups = groupByCategory(activeSkills);

  return (
    <section id="skills" className="skills" aria-labelledby="skills-title">
      <div className="container skills__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="skills__label">Stack</p>

        {/* ----------------------------------------
            HEADER
            ---------------------------------------- */}

        <div className="skills__top">
          <h2 id="skills-title" className="skills__heading">
            Tools I <em>reach for.</em>
          </h2>

          <p className="skills__aside">
            Technologies I use day to day. Depth is better judged
            from the work above.
          </p>
        </div>

        {/* ----------------------------------------
            GROUPS
            ---------------------------------------- */}

        <dl className="skills__groups">
          {groups.map((group) => (
            <div className="skill-group" key={group.category}>
              <dt className="skill-group__label">
                {group.category.toUpperCase()}
              </dt>

              <dd className="skill-group__items">
                {group.skills.map((name) => (
                  <span key={name} className="skill-group__item">
                    {name}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}