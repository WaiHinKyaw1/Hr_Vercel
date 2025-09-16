"use client";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { usePWAInstall } from "hooks/usePWAInstall";

export default function InstallPWAButton() {
  const { isInstalled, deferredPrompt, triggerInstall } = usePWAInstall();

  if (!deferredPrompt || isInstalled) return null;

  return (
    <button
      onClick={triggerInstall}
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
