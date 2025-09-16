import { Typography } from "@mui/material";
import React, { ReactNode } from "react";
interface Props {
  children?: ReactNode;
}
const PageContentHeaderText = ({ children }: Props) => {
  return <Typography style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{children}</Typography>;
};

export default PageContentHeaderText;
