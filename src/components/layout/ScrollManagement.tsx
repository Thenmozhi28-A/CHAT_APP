import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollManagement component ensures that:
 * 1. The page starts at the top (0,0) on navigations to new routes.
 * 2. Hash fragments (e.g., #features) trigger smooth scrolling to the target element.
 */
export default function ScrollManagement() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration to prevent jumps to middle sections on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If no hash is present, or if it's the initial load of the home page, start at the top.
    if (!hash || (pathname === '/' && !window.location.hash)) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // If a hash is present (meaning a link was clicked), scroll to that section.
    else {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [pathname, hash]);

  return null;
}
