import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { Color } from "style";

//Form Save Button
const SaveButton: React.FC<ButtonProps> = ({children ,...props}) => {
  return (
    <Button
      variant="text"
      sx={{
        height: 45,
        bgcolor: Color.primary,
        color: "#fff",
        width: "100%",
        paddingY: 1,
        borderRadius: 3,
        ":hover": {
          bgcolor: Color.primary,
          opacity: 0.9,
        },
      }}
      {...props}
    >
      {children || "Save"}
    </Button>
  );
};

export default SaveButton;
