"use client";

import { useEffect, useState } from "react";
import {
  getAdminServices,
  createService,
  updateService,
  deleteService,
} from "../../lib/api";
import "./services.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  icon: "",
  displayOrder: 0,
  isActive: true,
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminServices();
      setServices(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(service) {
    setEditingId(service.id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      displayOrder: service.display_order ?? 0,
      isActive: service.is_active !== false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateService(editingId, form);
      } else {
        await createService(form);
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      await load();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <p className="services-eyebrow">PORTFOLIO CONTENT</p>
          <h1>Services</h1>
          <p>The offering list shown on your public portfolio.</p>
        </div>
        <div className="services-count">
          <span>{services.length}</span>
          <small>Total</small>
        </div>
      </div>

      {error && <div className="services-error">{error}</div>}

      <form className="services-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Service" : "Add Service"}</h2>

        <div className="services-form-grid">
          <label>
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
              maxLength={100}
            />
          </label>

          <label>
            <span>Icon (optional)</span>
            <input
              type="text"
              value={form.icon}
              onChange={(e) =>
                setForm({ ...form, icon: e.target.value })
              }
              maxLength={50}
              placeholder="e.g. web, server"
            />
          </label>

          <label className="services-form-grid--full">
            <span>Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              maxLength={500}
            />
          </label>

          <label>
            <span>Display Order</span>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) =>
                setForm({
                  ...form,
                  displayOrder: Number(e.target.value),
                })
              }
              min={0}
            />
          </label>

          <label className="services-checkbox">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <span>Active (visible on site)</span>
          </label>
        </div>

        <div className="services-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="services-form-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="services-state">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="services-state">No services yet.</div>
      ) : (
        <div className="services-table-wrapper">
          <table className="services-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>{s.display_order ?? 0}</td>
                  <td>
                    <strong>{s.title}</strong>
                  </td>
                  <td>{s.description}</td>
                  <td>
                    <span
                      className={
                        s.is_active !== false
                          ? "status status--active"
                          : "status status--inactive"
                      }
                    >
                      {s.is_active !== false ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="services-table-actions">
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="services-danger"
                      >
                        Delete
                      </button>
                    </div>
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