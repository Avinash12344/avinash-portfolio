"use client";

import "../styles/Services.css";

const expertiseGroups = [
  {
    number: "01",
    title: "Software",
    accent: "Development",
    keywords: [
      "software",
      "backend",
      "api",
      "node",
      "express",
      "database",
      "development",
    ],
  },
  {
    number: "02",
    title: "Frontend",
    accent: "Development",
    keywords: [
      "frontend",
      "front-end",
      "react",
      "next",
      "javascript",
      "website",
      "web",
    ],
  },
  {
    number: "03",
    title: "E-commerce",
    accent: "& Shopify",
    keywords: [
      "shopify",
      "ecommerce",
      "e-commerce",
      "store",
      "commerce",
    ],
  },
];

function getSearchText(service) {
  return [
    service?.title,
    service?.description,
    service?.technologies,
    service?.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findServicesForGroup(group, services) {
  const matches = services.filter((service) => {
    const text = getSearchText(service);

    return group.keywords.some((keyword) =>
      text.includes(keyword)
    );
  });

  return matches;
}

function getGroupDescription(groupServices) {
  const descriptions = groupServices
    .map((service) => service?.description)
    .filter(Boolean);

  if (descriptions.length === 0) {
    return "Building practical digital solutions around real business requirements.";
  }

  return descriptions.slice(0, 2).join(" ");
}

function getTechnologies(groupServices) {
  const technologies = groupServices
    .map((service) => service?.technologies)
    .filter(Boolean);

  if (technologies.length === 0) {
    return "Modern technologies · Clean architecture";
  }

  return [...new Set(technologies)].join(" · ");
}

export default function Services({ services }) {
  const activeServices = Array.isArray(services)
    ? services.filter(
        (service) => service && service.is_active !== false
      )
    : [];

  return (
    <section
      id="services"
      className="services"
      aria-labelledby="services-title"
    >
      <div className="services__code-background" aria-hidden="true">
        <span>{"<section>"}</span>
        <span>{"<div className=\"expertise\">"}</span>
        <span>{"<h3>What I do</h3>"}</span>
        <span>{"<p>Building digital products</p>"}</span>
        <span>{"</div>"}</span>
        <span>{"</section>"}</span>
      </div>

      <div className="container">
        <div className="services__header">
          <p className="services__eyebrow">
            02
          </p>

          <h2 id="services-title">
            My Expertise
          </h2>
        </div>

        <div className="services__grid">
          {expertiseGroups.map((group) => {
            const groupServices = findServicesForGroup(
              group,
              activeServices
            );

            return (
              <article
                className="expertise"
                key={group.number}
              >
                <div className="expertise__top">
                  <span className="expertise__number">
                    {group.number}
                  </span>

                  <span
                    className="expertise__icon"
                    aria-hidden="true"
                  >
                    {group.number === "01" && "◉"}
                    {group.number === "02" && "◌"}
                    {group.number === "03" && "◇"}
                  </span>
                </div>

                <div className="expertise__content">
                  <h3>
                    {group.title}
                    <br />
                    <span>{group.accent}</span>
                  </h3>

                  <div className="expertise__code">
                    {"<h3>"}
                  </div>

                  <p>
                    {getGroupDescription(groupServices)}
                  </p>

                  <div className="expertise__code expertise__code--bottom">
                    {"</h3>"}
                  </div>

                  <div className="expertise__technologies">
                    {getTechnologies(groupServices)}
                  </div>

                  {groupServices.length > 0 && (
                    <div className="expertise__services">
                      {groupServices.map((service) => (
                        <span key={service.id}>
                          {service.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        
      </div>
    </section>
  );
}