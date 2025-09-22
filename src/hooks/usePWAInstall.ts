"use client";
import { useState, useEffect, useCallback } from "react";

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); 
  const [isInstalled, setIsInstalled] = useState(false); 

  useEffect(() => {
    const checkInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone
      );
    };

    setIsInstalled(checkInstalled());

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

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

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      alert(
        "Please open the app in Chrome or Edge and use 'Add to Home Screen' from the browser menu."
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
