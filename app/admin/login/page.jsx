"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { adminLogin } from "../../lib/api";
import "./login.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await adminLogin(email, password);
      const { token, user } = response.data;

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(user));

      // Respect the ?next= param set by the layout redirect.
      // Falls back to dashboard if absent.
      const next = searchParams.get("next") || "/admin/dashboard";

      // Guard against open-redirect: only allow internal paths
      const safeNext = next.startsWith("/") ? next : "/admin/dashboard";

      router.replace(safeNext);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Portfolio Admin</p>

        <h1 className="admin-login__title">Admin Login</h1>

        <p className="admin-login__subtitle">
          Sign in to manage your portfolio, projects, enquiries and content.
        </p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-login__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login__button"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In →"}
          </button>
        </form>

        <p className="admin-login__footer">Authorized access only</p>
      </div>
    </main>
  );
}

export default function AdminLogin() {
  return (
    <Suspense
      fallback={
        <main className="admin-login">
          <div className="admin-login__card">
            <p className="admin-login__subtitle">Loading...</p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}