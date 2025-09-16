import { Box } from "@mui/material";
import { ReactNode } from "react";

interface PageContentWrapperProps {
  children?: ReactNode;
}

export default function PageContentWrapper({ children }: PageContentWrapperProps) {
  return (
    <Box
      padding={0}
      sx={{
        height: "85vh",
        margin: 1,
        borderRadius: 1,
        overflow: "auto",
        // border: "1px solid #989898",
        backgroundColor: "#fff",
        boxShadow: 3, // Levels 0–24
        px: 2,
        pb: 1,
      }}
    >
      {children}
    </Box>
  );
}
