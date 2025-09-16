import React, { useState, useMemo } from "react";
import {
  Drawer,
  List,
  Box,
  Typography,
  Button,
  OutlinedInput, 
  InputAdornment,
} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import useUser from "hooks/useUser"; 
import { Color } from "style";
import { sideMenus } from "data";
import SideMenuItem from "./SideMenuItem";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SideMenu = ({ open, setOpen }: Props) => {
  const { user } = useUser(); 
  const userRole = user?.user_role; 
  
  const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const handleToggle = (label: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const filteredMenus = useMemo(() => {
    return sideMenus
      .filter((menu) => {
        if (!menu.allowedRoles || menu.allowedRoles.length === 0) {
          return true;
        }
        
        return userRole && menu.allowedRoles.includes(userRole);
      })
      .map((menu) => {
        const searchTerm = search.toLowerCase();
        const parentMatches = menu.label.toLowerCase().includes(searchTerm);

        const matchedSubMenus = menu.subMenus?.filter((sub) => {
          const roleAllowed = !sub.allowedRoles || 
            (userRole && sub.allowedRoles.includes(userRole));
          const searchMatches = sub.label.toLowerCase().includes(searchTerm);
          return roleAllowed && searchMatches;
        }) || [];

        if (parentMatches || matchedSubMenus.length > 0) {
          return {
            ...menu,
            subMenus: matchedSubMenus.length > 0 ? matchedSubMenus : menu.subMenus,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [search, userRole]); 

  return (
    <Drawer
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: "300px",
          height: "100vh",
          bgcolor: Color.whiteless,
        },
      }}
      open={open}
      variant="temporary"
    >
      <Box>
        {/* Logo */}
        <Box sx={{ marginX: "auto", width: "fit-content", mt:2, mb:1.5 }}>
          <Image src="/images/logo.png" alt="logo" width={80} height={80} />
        </Box>

        {/* Search Input */}
        <Box sx={{ px: 1.5, mb: 1 }}>
          <OutlinedInput
            fullWidth
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Box>

        {/* Menu Items */}
        <List
          style={{
            maxHeight: "65vh",
            overflow: "auto",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {filteredMenus.map((menu, index) => (
            menu ? (<SideMenuItem
              key={index}
              menu={menu}
              handleToggle={handleToggle}
              openMenu={openMenu}
              setOpen={setOpen}
            />) : null
          )
          )}
        </List>
      </Box>

      {/* Collapse Button */}
      <Button
        sx={{
          display: "flex",
          gap: "12px",
          mt: "auto",
          mb: 4,
          paddingLeft: "15px",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "left",
        }}
        onClick={() => setOpen(!open)}
      >
        <Image src="/icons/sidemenus/collapse.png" alt="Collapse Icon" width={20} height={20} />
        <Typography
          sx={{
            color: Color.blackColor,
            textTransform: "capitalize",
          }}
        >
          Collapse
        </Typography>
      </Button>
    </Drawer>
  );
};

export default SideMenu;
