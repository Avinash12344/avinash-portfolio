"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminLogin } from "../../lib/api";
import "./login.css";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await adminLogin(
        email,
        password
      );

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      const { token, user } =
        response.data;

      localStorage.setItem(
        "admin_token",
        token
      );

      localStorage.setItem(
        "admin_user",
        JSON.stringify(user)
      );

      router.push(
        "/admin/dashboard"
      );
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login__card">

        <p className="admin-login__eyebrow">
          Portfolio Admin
        </p>

        <h1 className="admin-login__title">
          Admin Login
        </h1>

        <p className="admin-login__subtitle">
          Sign in to manage your portfolio,
          projects, enquiries and content.
        </p>

        <form
          className="admin-login__form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="admin-login__field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="admin-login__field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* ERROR */}

          {error && (
            <p
              className="admin-login__error"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="admin-login__button"
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : "Sign In →"}
          </button>

        </form>

        <p className="admin-login__footer">
          Authorized access only
        </p>

      </div>
    </main>
  );
}