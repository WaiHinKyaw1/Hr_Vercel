import { FormLabel as MUIFormLabel } from "@mui/material";
import React from "react";

interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
}
export default function FormLabel({ children, required = true }: FormLabelProps) {
  return (
    <MUIFormLabel sx={{color: "black"}}>
      {children}
      {required == false ? <span style={{ color: "#A0AEC0" }}>{" (Optional)"}</span> : ""}
    </MUIFormLabel>
  );
}
