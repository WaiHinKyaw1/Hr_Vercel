"use client";
import { useState, useEffect, useCallback } from "react";

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // check if PWA is installed
  useEffect(() => {
    const checkInstalled = () => {
      // Android / desktop PWA
      if (window.matchMedia("(display-mode: standalone)").matches) return true;
      // iOS PWA
      if ((window.navigator as any).standalone) return true;
      return false;
    };

    setIsInstalled(checkInstalled());

    // listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // trigger install prompt
  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      // optional: manual guide if prompt not available
      alert(
        "Open this app in Chrome or Edge to install it.\nIf you previously uninstalled, use browser menu → Add to Home Screen"
      );
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return { isInstalled, deferredPrompt, triggerInstall };
};
