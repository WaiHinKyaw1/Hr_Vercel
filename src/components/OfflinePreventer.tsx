

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfflinePreventer() {
  const router = useRouter();

  useEffect(() => {
    const checkOfflineStatus = () => {
      if (!navigator.onLine) {
        alert("No internet connection. Please connect to the internet.");
        router.push("/");
      }
    };

    checkOfflineStatus();

    window.addEventListener("offline", checkOfflineStatus);
    window.addEventListener("online", checkOfflineStatus); 

    return () => {
      window.removeEventListener("offline", checkOfflineStatus);
      window.removeEventListener("online", checkOfflineStatus);
    };
  }, [router]);

  return null;
}