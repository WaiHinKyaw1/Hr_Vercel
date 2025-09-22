"use client";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { useEffect, useState } from "react";
import { usePWAInstall } from "hooks/usePWAInstall";
import { Button } from "@mui/material";

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
  //     if (!inStandalone && !isInstalled && deferredPrompt) {
  //     setShowButton(true);
  //   } else {
  //     setShowButton(false);
  //   }
  // }, [isInstalled, deferredPrompt]);

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
    <Button
      variant="outlined"
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 15px",
        fontSize: "14px",
        fontWeight: 500,
        borderRadius: "10px",
        border: "2px solid #3b82f6", 
        backgroundColor: "transparent",
        color: "#000000",
        "&:hover": {
          backgroundColor: "rgba(59,130,246,0.1)",
          borderColor: "#3b82f6",
        },
      }}
    >
      <ArrowCircleDownIcon /> Install App
    </Button>
  );
}
