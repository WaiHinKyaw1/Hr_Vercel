// "use client";
// import { useState, useEffect, useCallback } from "react";

// // PWA install ကို handle လုပ်ပေးတဲ့ hook
// export const usePWAInstall = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // deferredPrompt ကို သိမ်းထားရန်
//   const [isInstalled, setIsInstalled] = useState(false); // app ရှိ/မရှိ စစ်ဆေးရန်

//   useEffect(() => {
//     // App တက်နေတဲ့နေရာကို စစ်ဆေးပေးတဲ့ function
//     const checkInstalled = () => {
//       return (
//         window.matchMedia("(display-mode: standalone)").matches ||
//         (window.navigator as any).standalone
//       );
//     };

//     setIsInstalled(checkInstalled());

//     const handleBeforeInstallPrompt = (e: any) => {
//       e.preventDefault(); // ပုံမှန် prompt ကို ပယ်ချိန်
//       setDeferredPrompt(e); // deferredPrompt ကို သိမ်းထား
//     };

//     const handleAppInstalled = () => {
//       setIsInstalled(true);
//       // setDeferredPrompt(null);
//     };
//     window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
//     window.addEventListener("appinstalled", handleAppInstalled);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
//       window.removeEventListener("appinstalled", handleAppInstalled);
//     };
//   }, []);

//   const triggerInstall = useCallback(async () => {
//     if (!deferredPrompt) {
//       alert(
//         "Please open the app in Chrome or Edge and use 'Add to Home Screen' from the browser menu."
//       );
//       return false;
//     }

//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;

//     if (outcome === "accepted") {
//       setIsInstalled(true);
//     }

//     setDeferredPrompt(null);
//     return outcome === "accepted";
//   }, [deferredPrompt]);

//   return { isInstalled, deferredPrompt, triggerInstall };
// };

"use client";
import { useState, useEffect, useCallback } from "react";

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed (display-mode: standalone)
    const checkInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone
      );
    };

    setIsInstalled(checkInstalled());

    // Check if app was installed previously
    const previouslyInstalled = localStorage.getItem("isAppInstalled");

    if (previouslyInstalled === "true") {
      setIsInstalled(true);
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent the default prompt from showing
      setDeferredPrompt(e); // Save the deferred prompt for later
      localStorage.setItem("deferredPrompt", JSON.stringify(e)); // Store deferredPrompt
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem("isAppInstalled", "true"); // Mark as installed
      setDeferredPrompt(null); // Clear deferredPrompt
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Trigger install prompt
  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      alert(
        "Please open this app in Chrome or Edge and use 'Add to Home Screen' from the browser menu."
      );
      return false;
    }

    deferredPrompt.prompt(); // Show the install prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true); // Mark app as installed
      localStorage.setItem("isAppInstalled", "true"); // Store install status
    }

    setDeferredPrompt(null); // Clear deferredPrompt
    return outcome === "accepted";
  }, [deferredPrompt]);

  return { isInstalled, deferredPrompt, triggerInstall };
};
