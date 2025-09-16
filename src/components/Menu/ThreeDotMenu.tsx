import React, { CSSProperties } from "react";
import { Tooltip, IconButton, Menu, MenuItem, Typography, Divider } from "@mui/material";
import { Stack } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

export interface ThreeDotMenuOptionType {
  iconSrc?: any;
  label?: any;
  key: any;
  url?: string;
  disabled?: boolean;
}

type ThreeDotMenuProps = {
  options?: ThreeDotMenuOptionType[];
  onClickMenuItem?: (key: any) => void;
  style?: CSSProperties;
};

// const ITEM_HEIGHT = 48;

export default function ThreeDotMenu({ options = [], onClickMenuItem, style }: ThreeDotMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Menu">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Image src="/icons/vertical-threedot.png" width={20} height={20} alt="app bg icon" />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        PaperProps={{
          style: {
            //maxHeight: ITEM_HEIGHT * 4.5,
            width: "22ch",
            ...style,
          },
        }}
      >
        {options?.length > 0
          ? options.map((option) =>
              option.url ? (
                <Link
                  style={
                    option.disabled
                      ? {
                          pointerEvents: "none",
                          opacity: 0.5,
                          textDecoration: "none",
                        }
                      : {}
                  }
                  href={option.url}
                  key={option.label}
                  passHref
                >
                  <MenuItem
                    disabled={option.disabled}
                    onClick={() => {
                      if (!option.disabled) {
                        closeMenu();
                        if (onClickMenuItem) onClickMenuItem(option.key);
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {option.iconSrc ? (
                        <Image src={`${option.iconSrc}`} width={17} height={17} alt={option.iconSrc} />
                      ) : null}
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "black",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {option.label}
                      </Typography>
                    </Stack>
                  </MenuItem>
                  <Divider style={{marginTop: 0, marginBottom: 0}}/>
                </Link>
              ) : (
                <div key={option.key}>
                  <MenuItem
                    disabled={option.disabled}
                    onClick={() => {
                      if (!option.disabled) {
                        closeMenu();
                        if (onClickMenuItem) onClickMenuItem(option.key);
                      }
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {option.iconSrc ? (
                        <Image src={`${option.iconSrc}`} width={17} height={17} alt={option.iconSrc} />
                      ) : null}
                      <Typography style={{ fontSize: 14 }}>{option.label}</Typography>
                    </Stack>
                  </MenuItem>
                  <Divider />
                </div>
              )
            )
          : null}
      </Menu>
    </div>
  );
}
