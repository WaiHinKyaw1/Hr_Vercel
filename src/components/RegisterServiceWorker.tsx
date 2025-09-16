"use client";
import { useEffect } from "react";
export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "development") return;

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered with scope:", registration.scope);
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      });
    }
  }, []);

  return null;
}
