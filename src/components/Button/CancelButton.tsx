import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface CancelButtonProps extends ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  buttonText?: string;
}

//Form CancelButton
export default function CancelButton(props: CancelButtonProps) {
  const { onClick, type = "button", ...buttonProps } = props;
  return (
    <Button
      onClick={onClick}
      type={type}
      variant="outlined"
      sx={{
        height: 45,
        bgcolor: "#fff",
        border: "1px solid #CBD0D7",
        borderRadius: 3,
        color: "black",
        width: "100%",
        paddingY: 1,
        ":hover": { opacity: 0.5 },
      }}
      {...buttonProps}
    >
      Cancel
    </Button>
  );
}
