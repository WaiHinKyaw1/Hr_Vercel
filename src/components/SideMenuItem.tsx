import React, { Fragment } from "react";
import { List, ListItemButton, ListItemText, Collapse, alpha } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Color } from "style";


interface SubMenus {
  label: string;
  href: string;
}

interface Menu {
  label: string;
  src: string;
  active: string;
  href?: string;
  subMenus?: SubMenus[];
}

interface Props {
  menu: Menu;
  handleToggle: (value: string) => void;
  openMenu: Record<string, boolean>;
  setOpen: (value: boolean) => void;
}

const SideMenuItem = ({ menu, handleToggle, openMenu, setOpen }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const isDirectLinkActive = menu.href && pathname === menu.href;

  const isAnyChildActive = menu.subMenus?.some((sub) => sub.href && pathname === sub.href) ?? false;

  const isParentOrChildActive = isDirectLinkActive || isAnyChildActive;

  return (
    <Fragment key={menu.label}>
      <ListItemButton
        sx={{
          my: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: isParentOrChildActive ? alpha(Color.primary, 1) : Color.whiteless,
          width: "100%",
          height: "40px",
          paddingX: "20px",
          gap: "10px",
          "&:hover": isParentOrChildActive
            ? {
                backgroundColor: alpha(Color.primary, 0.8),
              }
            : {
                backgroundColor: alpha(Color.primary, 0.3),
              },
        }}
        component="a"
        href={menu.subMenus ? undefined : menu.href}
        onClick={(e) => {
          if (menu.subMenus) {
            e.preventDefault();
            handleToggle(menu.label);
          } else if (menu.href) {
            e.preventDefault();
            router.push(menu.href);
            setOpen(false);
          }
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Image src={isParentOrChildActive ? menu.active : menu.src} alt={menu.label} width={30} height={30} />
        </div>

        <ListItemText
          sx={{ color: isParentOrChildActive ? Color.whiteColor : Color.blackColor }}
          primary={menu.label}
          primaryTypographyProps={{
            noWrap: true,
          }}
        />
        {menu.subMenus && (
          <Image
            src="/icons/sidemenus/dropdown.png"
            width={15}
            height={15}
            alt="Dropdown"
            style={{
              transform: openMenu[menu.label] ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        )}
      </ListItemButton>

      {/* Collapse for children */}
      {menu.subMenus && (
        <Collapse in={openMenu[menu.label]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menu.subMenus.map((child) => {
              const isCurrentChild = child.href && pathname === child.href;
              return (
                <ListItemButton
                  component="a"
                  href={child.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(child.href);
                    setOpen(false);
                  }}
                  key={child.label}
                  sx={{
                    bgcolor: Color.whiteless,
                    width: "100%",
                    height: "35px",
                    pl: 4,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: alpha(Color.primary, 0.1),
                    },
                  }}
                >
                  <ListItemText
                    sx={{
                      color: isCurrentChild ? Color.primary : Color.blackColor,
                      ml: "20px",
                    }}
                    primaryTypographyProps={{ fontWeight: isCurrentChild ? "bold" : "normal" }}
                    primary={child.label}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
};

export default SideMenuItem;
