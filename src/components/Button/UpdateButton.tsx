import { Button, ButtonProps } from "@mui/material";
import React from "react";

const UpdateButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      variant="text"
      sx={{
        height: 45,
        bgcolor: "#87CEEB",
        color: "black",
        width: "100%",
        paddingY: 1,
        borderRadius: 3,
        ":hover": {
          bgcolor: "#87CEEB",
          opacity: 0.8,
        },
      }}
      {...props}
    >
      Update
    </Button>
  );
};

export default UpdateButton;
