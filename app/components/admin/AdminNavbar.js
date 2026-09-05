"use client";

import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("admin_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <header className="admin-navbar">
      <div>
        <p className="admin-navbar__eyebrow">
          ADMINISTRATION
        </p>

        <h1>
          Portfolio Management
        </h1>
      </div>

      <div className="admin-navbar__user">
        <div className="admin-navbar__avatar">
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "A"}
        </div>

        <div>
          <strong>
            {user?.name || "Admin"}
          </strong>

          <span>
            {user?.role || "ADMIN"}
          </span>
        </div>
      </div>
    </header>
  );
}