"use client";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { useEffect, useState } from "react";
import { usePWAInstall } from "hooks/usePWAInstall";

export default function InstallPWAButton() {
  const { isInstalled, deferredPrompt, triggerInstall } = usePWAInstall();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const inStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (!inStandalone && !isInstalled) {
      setShowButton(true);
    }
  }, [isInstalled]);

  if (!showButton) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      const result = await triggerInstall();
      if (!result) {
        alert(
          "Open this app in Chrome or Edge to install it.\nIf you previously uninstalled, use browser menu → Add to Home Screen"
        );
      }
    } else {
      alert(
        "Open this app in Chrome or Edge to install it.\nIf you previously uninstalled, use browser menu → Add to Home Screen"
      );
    }
  };
  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 15px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        borderRadius: "999px",
        border: "none",
        background: "linear-gradient(90deg, #1d3d63, #3b82f6)",
        color: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      <ArrowCircleDownIcon /> Install App
    </button>
  );
}
