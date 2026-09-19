"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../styles/Navbar.css";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__container">
        <Link
          href="/"
          className="navbar__brand"
          onClick={closeMenu}
          aria-label="Avinash Vishwakarma home"
        >
          Avinash<span className="navbar__brand-dot">.</span>
        </Link>

        <nav className="navbar__links" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="navbar__link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <a href="#contact" className="navbar__cta" onClick={closeMenu}>
            Hire me
          </a>
        </nav>

        <button
          type="button"
          className={`navbar__toggle ${
            menuOpen ? "navbar__toggle--open" : ""
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="navbar__mobile-nav" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            className="navbar__mobile-cta"
            onClick={closeMenu}
          >
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}