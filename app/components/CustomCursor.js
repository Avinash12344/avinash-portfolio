"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // Only enable on devices with a fine pointer (mouse/trackpad)
  // and when the user hasn't asked for reduced motion.
  useEffect(() => {
    const hasFinePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setEnabled(hasFinePointer && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let followerX = mouseX;
    let followerY = mouseY;

    let animationFrame;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.14;
      followerY += (mouseY - followerY) * 0.14;

      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

      animationFrame = requestAnimationFrame(animate);
    };

    // Event delegation — works for any element, now or later
    const INTERACTIVE_SELECTOR =
      "a, button, input, textarea, select, [role='button']";

    const handlePointerOver = (event) => {
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (target) {
        follower.classList.add("custom-cursor__follower--active");
      }
    };

    const handlePointerOut = (event) => {
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (target) {
        follower.classList.remove("custom-cursor__follower--active");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handlePointerOver);
    document.addEventListener("mouseout", handlePointerOut);

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseout", handlePointerOut);

      cancelAnimationFrame(animationFrame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span
        ref={cursorRef}
        className="custom-cursor__dot"
      />

      <span
        ref={followerRef}
        className="custom-cursor__follower"
      />
    </div>
  );
}