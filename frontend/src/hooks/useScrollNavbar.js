// src/hooks/useScrollNavbar.js
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function useScrollNavbar() {
  const mainNavRef = useRef(null);
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    const showNavbar = () => {
      if (!isVisible.current) {
        gsap.to(mainNavRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out"
        });
        isVisible.current = true;
      }
    };

    const hideNavbar = () => {
      if (isVisible.current) {
        gsap.to(mainNavRef.current, {
          y: -100,
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.out"
        });
        isVisible.current = false;
      }
    };

    const update = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY.current;

      if (delta > 10 && currentScroll > 150) {
        showNavbar(); // scroll down
      } else if (delta < -10) {
        hideNavbar(); // scroll up
      }

      lastScrollY.current = currentScroll;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { mainNavRef };
}
