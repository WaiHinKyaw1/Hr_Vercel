import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface SearchButtonProps extends ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
// Page Top SearchButton
export default function SearchButton({ onClick, disabled = false, ...buttonProps }: SearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      type="button"
      disabled={disabled}
      sx={{
        width: "100px",
        ":hover": { opacity: 0.9 },
        alignItems: "center",
        backgroundColor: "red",
      }}
      variant="contained"
      {...buttonProps}
    >
      Search
    </Button>
  );
}
