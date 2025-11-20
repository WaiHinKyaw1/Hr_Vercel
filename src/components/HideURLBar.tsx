"use client";

import { useEffect } from "react";

export default function HideURLBar() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running in standalone/TWA mode
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      window.location.search.includes("standalone=true");

    if (!isStandalone) return;

    // Method 1: Scroll to hide URL bar on mobile
    const hideURLBar = () => {
      window.scrollTo(0, 1);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    };

    // Method 2: Set viewport height to hide URL bar
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Method 3: Add CSS to hide any visible URL bars
    const style = document.createElement("style");
    style.textContent = `
      /* Hide URL bar in TWA/Standalone mode */
      @media (display-mode: standalone) {
        body {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
        html {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
      }
      
      /* Hide address bar area */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: env(safe-area-inset-top, 0px);
        background: #1976d2;
        z-index: 9999;
        display: ${isStandalone ? "block" : "none"};
      }
    `;
    document.head.appendChild(style);

    // Initial calls
    hideURLBar();
    setViewportHeight();

    // Handle resize events
    const handleResize = () => {
      hideURLBar();
      setViewportHeight();
    };

    // Handle orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        hideURLBar();
        setViewportHeight();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Cleanup
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return null;
}

