"use client";

import "../styles/Services.css";

export default function Services({ services }) {
  const activeServices = Array.isArray(services)
    ? services.filter((s) => s && s.is_active !== false)
    : [];

  if (activeServices.length === 0) return null;

  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="container services__container">
        {/* ----------------------------------------
            LABEL
            ---------------------------------------- */}

        <p className="services__label">Services</p>

        {/* ----------------------------------------
            HEADER
            ---------------------------------------- */}

        <div className="services__top">
          <h2 id="services-title" className="services__heading">
            What I <em>actually</em> do.
          </h2>

          <p className="services__aside">
            The work I take on and what each engagement typically
            involves.
          </p>
        </div>

        {/* ----------------------------------------
            LIST
            ---------------------------------------- */}

        <ol className="services__list">
          {activeServices.map((service, index) => (
            <li key={service.id} className="service">
              <div className="service__index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="service__body">
                <h3 className="service__title">{service.title}</h3>

                {service.description && (
                  <p className="service__description">{service.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}