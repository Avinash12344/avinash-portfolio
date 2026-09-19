"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClients } from "../../lib/api";
import "./clients.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClients() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("admin_token");

        if (!token) {
          throw new Error(
            "Authentication required."
          );
        }

        const response =
          await getClients(token);

        setClients(
          response.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load clients:",
          error
        );

        setError(
          error.message ||
            "Failed to load clients."
        );
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  if (loading) {
    return (
      <div className="clients-page">
        <div className="clients-loading">
          Loading clients...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clients-page">
        <div className="clients-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="clients-page">

      <div className="clients-header">
        <div>
          <p className="clients-eyebrow">
            CLIENT MANAGEMENT
          </p>

          <h1>Clients</h1>

          <p>
            Manage your clients and their
            enquiries and projects.
          </p>
        </div>

        <div className="clients-count">
          <span>{clients.length}</span>
          <small>Total Clients</small>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="clients-empty">
          <h2>No clients yet</h2>

          <p>
            Clients will appear here when
            someone submits an enquiry.
          </p>
        </div>
      ) : (
        <div className="clients-table-wrapper">
          <table className="clients-table">

            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Enquiries</th>
                <th>Projects</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>

                  <td>
                   <Link
  href={`/admin/clients/${client.id}`}
  className="client-name client-name--link"
>
  {client.name}
</Link>
                  </td>

                  <td>
                    {client.company || "—"}
                  </td>

                  <td>
                    {client.email}
                  </td>

                  <td>
                    {client.phone || "—"}
                  </td>

                  <td>
                    <span className="client-count">
                      {client.enquiry_count}
                    </span>
                  </td>

                  <td>
                    <span className="client-count">
                      {client.project_count}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      client.created_at
                    ).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}