"use client";
import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { useRouter, usePathname } from "next/navigation";

export default function AppSystemBarMimic() {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState(1);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  useEffect(() => {
    const previous = sessionStorage.getItem("lastVisited");
    if (previous && previous !== pathname) setLastVisited(previous);
    sessionStorage.setItem("lastVisited", pathname);

    if (pathname === "/") setTab(1);
    else setTab(0);
  }, [pathname]);

  const handleNavigation = (index: number) => {
    switch (index) {
      case 0:
        router.back();
        break;
      case 1:
        router.push("/");
        break;
      case 2:
        if (lastVisited && lastVisited !== pathname) router.push(lastVisited);
        else router.push("/");
        break;
    }
    setTab(index);
  };
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999
      }}
      elevation={3}
    >
      <BottomNavigation
        value={tab}
        onChange={(_, newValue) => handleNavigation(newValue)}
        showLabels
      >
        <BottomNavigationAction label="Back" icon={<ArrowBackIcon />} />
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Recent" icon={<WidgetsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
