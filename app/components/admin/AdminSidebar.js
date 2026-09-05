"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "⌂",
  },
  {
    label: "Enquiries",
    href: "/admin/enquiries",
    icon: "✉",
  },
  {
    label: "Clients",
    href: "/admin/clients",
    icon: "♙",
  },
  {
    label: "Proposals",
    href: "/admin/proposals",
    icon: "▤",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: "▦",
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: "★",
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: "◆",
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: "◇",
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: "●",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    router.replace("/admin/login");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">
          AV
        </div>

        <div>
          <h2>Avinash</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        <p className="admin-sidebar__label">
          MANAGEMENT
        </p>

        {navigation.map((item) => {
          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "admin-sidebar__link admin-sidebar__link--active"
                  : "admin-sidebar__link"
              }
            >
              <span className="admin-sidebar__icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar__bottom">
        <Link
          href="/"
          className="admin-sidebar__website"
        >
          ↗ View Portfolio
        </Link>

        <button
          onClick={handleLogout}
          className="admin-sidebar__logout"
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}