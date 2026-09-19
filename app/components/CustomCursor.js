"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
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

    const handleMouseEnterInteractive = () => {
      follower.classList.add("custom-cursor__follower--active");
    };

    const handleMouseLeaveInteractive = () => {
      follower.classList.remove("custom-cursor__follower--active");
    };

    document.addEventListener("mousemove", handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener(
        "mouseenter",
        handleMouseEnterInteractive
      );

      element.addEventListener(
        "mouseleave",
        handleMouseLeaveInteractive
      );
    });

    animate();

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(animationFrame);

      interactiveElements.forEach((element) => {
        element.removeEventListener(
          "mouseenter",
          handleMouseEnterInteractive
        );

        element.removeEventListener(
          "mouseleave",
          handleMouseLeaveInteractive
        );
      });
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      aria-hidden="true"
    >
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