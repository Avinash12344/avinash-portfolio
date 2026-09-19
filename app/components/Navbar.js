"use client";

import { useState } from "react";
import "../styles/Navbar.css";

const navItems = [
  { number: "01", label: "home", href: "#top" },
  { number: "02", label: "expertise", href: "#services" },
  { number: "03", label: "work", href: "#work" },
  { number: "04", label: "testimonials", href: "#reviews" },
  { number: "05", label: "contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavigation() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a
          href="#top"
          className="navbar__logo"
          onClick={handleNavigation}
          aria-label="Avinash Vishwakarma home"
        >
          <span>Avinash</span>
          <strong>.</strong>
          <i>_</i>
        </a>

        <nav
          className={`navbar__links ${
            menuOpen ? "navbar__links--open" : ""
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavigation}
            >
              <small>{item.number}</small>

              <span>
                <b>//</b> {item.label}
              </span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`navbar__toggle ${
            menuOpen ? "navbar__toggle--open" : ""
          }`}
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={
            menuOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}