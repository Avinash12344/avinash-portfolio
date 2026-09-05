"use client";

import { useEffect, useState } from "react";
import "../styles/Services.css";
import { getServices } from "../lib/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const response = await getServices();

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        const activeServices = data.filter(
          (service) =>
            service &&
            service.is_active !== false
        );

        if (mounted) {
          setServices(activeServices);
        }
      } catch (error) {
        console.error(
          "Failed to load services:",
          error
        );

        if (mounted) {
          setError(
            "Unable to load services right now."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="services"
      className="services"
      aria-labelledby="services-title"
    >
      <div className="container">

        <p className="eyebrow">
          02. Services
        </p>

        <div className="services__header">

          <div>
            <h2
              id="services-title"
              className="section-title"
            >
              What I can build{" "}
              <span>for you.</span>
            </h2>
          </div>

          <p className="services__intro">
            From a new application to improving
            an existing system, I focus on
            building practical solutions around
            the problem you're trying to solve.
          </p>

        </div>


        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (
          <div
            className="services__state"
            role="status"
            aria-live="polite"
          >
            <span className="services__loader" />
            <span>
              Loading services...
            </span>
          </div>
        )}


        {/* ====================================
            ERROR
        ==================================== */}

        {!loading && error && (
          <div
            className="services__state services__state--error"
            role="alert"
          >
            {error}
          </div>
        )}


        {/* ====================================
            EMPTY
        ==================================== */}

        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="services__state">
              No services are available right now.
            </div>
          )}


        {/* ====================================
            SERVICES
        ==================================== */}

        {!loading &&
          !error &&
          services.length > 0 && (
            <div className="services__grid">

              {services.map(
                (service, index) => (
                  <article
                    className="service-card"
                    key={service.id}
                  >

                    <div className="service-card__top">

                      <span
                        className="service-card__number"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        className="service-card__arrow"
                        aria-hidden="true"
                      >
                        ↗
                      </span>

                    </div>


                    <h3>
                      {service.title}
                    </h3>


                    {service.description && (
                      <p>
                        {service.description}
                      </p>
                    )}


                    {service.icon && (
                      <span className="service-card__technologies">
                        {service.icon}
                      </span>
                    )}

                  </article>
                )
              )}

            </div>
          )}

      </div>
    </section>
  );
}