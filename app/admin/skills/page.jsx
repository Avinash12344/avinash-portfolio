"use client";

import { useEffect, useState } from "react";
import {
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../lib/api";
import "./skills.css";

const EMPTY_FORM = {
  name: "",
  category: "",
  proficiency: 80,
  displayOrder: 0,
  isActive: true,
};

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminSkills();
      setSkills(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(skill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name || "",
      category: skill.category || "",
      proficiency: skill.proficiency ?? 80,
      displayOrder: skill.display_order ?? 0,
      isActive: skill.is_active !== false,
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
        await updateSkill(editingId, form);
      } else {
        await createSkill(form);
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
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      await load();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  }

  return (
    <div className="skills-page">
      <div className="skills-header">
        <div>
          <p className="skills-eyebrow">PORTFOLIO CONTENT</p>
          <h1>Skills</h1>
          <p>Technologies shown in your Skills section.</p>
        </div>
        <div className="skills-count">
          <span>{skills.length}</span>
          <small>Total</small>
        </div>
      </div>

      {error && <div className="skills-error">{error}</div>}

      <form className="skills-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Skill" : "Add Skill"}</h2>

        <div className="skills-form-grid">
          <label>
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              maxLength={60}
              placeholder="e.g. React"
            />
          </label>

          <label>
            <span>Category</span>
            <input
              type="text"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              maxLength={60}
              placeholder="e.g. Frontend"
            />
          </label>

          <label>
            <span>Proficiency (0-100)</span>
            <input
              type="number"
              value={form.proficiency}
              onChange={(e) =>
                setForm({
                  ...form,
                  proficiency: Number(e.target.value),
                })
              }
              min={0}
              max={100}
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

          <label className="skills-checkbox">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <span>Active</span>
          </label>
        </div>

        <div className="skills-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="skills-form-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="skills-state">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="skills-state">No skills yet.</div>
      ) : (
        <div className="skills-table-wrapper">
          <table className="skills-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>{s.display_order ?? 0}</td>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td>{s.category || "—"}</td>
                  <td>{s.proficiency ?? "—"}</td>
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
                    <div className="skills-table-actions">
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="skills-danger"
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