"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import "../styles/AdminLayout.css";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

 useEffect(() => {
  if (pathname === "/admin/login") {
    setCheckingAuth(false);
    return;
  }

  const token = localStorage.getItem("admin_token");
  const storedUser = localStorage.getItem("admin_user");

  if (!token) {
    router.replace("/admin/login");
    return;
  }

  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("admin_user");
    }
  }

  setCheckingAuth(false);
}, [pathname, router]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    router.replace("/admin/login");
  }

  if (checkingAuth) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Loading admin...</p>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">
            AV
          </span>

          <div>
            <strong>
              Avinash
            </strong>

            <span>
              Portfolio Admin
            </span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">

          <p className="admin-sidebar__label">
            MANAGEMENT
          </p>

          <AdminNavItem
            href="/admin/dashboard"
            label="Dashboard"
            icon="⌂"
            active={
              pathname ===
              "/admin/dashboard"
            }
          />

          <AdminNavItem
            href="/admin/clients"
            label="Clients"
            icon="◉"
            active={
              pathname.startsWith(
                "/admin/clients"
              )
            }
          />

          <AdminNavItem
            href="/admin/enquiries"
            label="Enquiries"
            icon="✉"
            active={
              pathname.startsWith(
                "/admin/enquiries"
              )
            }
          />

          <AdminNavItem
            href="/admin/projects"
            label="Projects"
            icon="▣"
            active={
              pathname.startsWith(
                "/admin/projects"
              )
            }
          />

          <AdminNavItem
            href="/admin/proposals"
            label="Proposals"
            icon="▤"
            active={
              pathname.startsWith(
                "/admin/proposals"
              )
            }
          />

          <p className="admin-sidebar__label admin-sidebar__label--secondary">
            PORTFOLIO
          </p>

          <AdminNavItem
            href="/admin/profile"
            label="Profile"
            icon="◎"
            active={
              pathname.startsWith(
                "/admin/profile"
              )
            }
          />

          <AdminNavItem
            href="/admin/services"
            label="Services"
            icon="◆"
            active={
              pathname.startsWith(
                "/admin/services"
              )
            }
          />

          <AdminNavItem
            href="/admin/skills"
            label="Skills"
            icon="◇"
            active={
              pathname.startsWith(
                "/admin/skills"
              )
            }
          />

          <AdminNavItem
            href="/admin/reviews"
            label="Reviews"
            icon="★"
            active={
              pathname.startsWith(
                "/admin/reviews"
              )
            }
          />

        </nav>

        <div className="admin-sidebar__bottom">

          <div className="admin-user">

            <div className="admin-user__avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div className="admin-user__info">
              <strong>
                {user?.name || "Admin"}
              </strong>

              <span>
                {user?.email || "Administrator"}
              </span>
            </div>

          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <span className="admin-topbar__section">
              ADMIN PANEL
            </span>

            <h1>
              {getPageTitle(pathname)}
            </h1>
          </div>

          <div className="admin-topbar__status">
            <span />
            System Online
          </div>

        </header>

        <div className="admin-content">
          {children}
        </div>

      </main>

    </div>
  );
}


/* --------------------------------
   NAV ITEM
-------------------------------- */

function AdminNavItem({
  href,
  label,
  icon,
  active,
}) {
  return (
    <a
      href={href}
      className={`admin-nav-item ${
        active
          ? "admin-nav-item--active"
          : ""
      }`}
    >
      <span className="admin-nav-item__icon">
        {icon}
      </span>

      <span>
        {label}
      </span>
    </a>
  );
}


/* --------------------------------
   PAGE TITLE
-------------------------------- */

function getPageTitle(pathname) {
  if (pathname === "/admin/dashboard") {
    return "Dashboard";
  }

  if (pathname.startsWith("/admin/clients")) {
    return "Clients";
  }

  if (
    pathname.startsWith("/admin/enquiries")
  ) {
    return "Enquiries";
  }

  if (
    pathname.startsWith("/admin/projects")
  ) {
    return "Projects";
  }

  if (
    pathname.startsWith("/admin/proposals")
  ) {
    return "Proposals";
  }

  if (
    pathname.startsWith("/admin/profile")
  ) {
    return "Profile";
  }

  if (
    pathname.startsWith("/admin/services")
  ) {
    return "Services";
  }

  if (
    pathname.startsWith("/admin/skills")
  ) {
    return "Skills";
  }

  if (
    pathname.startsWith("/admin/reviews")
  ) {
    return "Reviews";
  }

  return "Admin";
}