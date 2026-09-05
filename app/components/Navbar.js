"use client";

import { useState } from "react";
import "../styles/Navbar.css";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavigation() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <a
          href="#top"
          className="navbar__logo"
          onClick={handleNavigation}
        >
          AV
        </a>

        <nav
          className={`navbar__links ${
            menuOpen
              ? "navbar__links--open"
              : ""
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavigation}
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="navbar__cta"
            onClick={handleNavigation}
          >
            Hire Me
          </a>
        </nav>

        <button
          type="button"
          className={`navbar__toggle ${
            menuOpen
              ? "navbar__toggle--open"
              : ""
          }`}
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}