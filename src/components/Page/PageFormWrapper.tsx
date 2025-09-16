import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

interface PageWrapperProps extends BoxProps {
  children?: ReactNode;
}

export default function PageWrapper({ children, ...boxProps }: PageWrapperProps) {
  return (
    <Box {...boxProps} sx={{ pl: 1, pr: 1, width: "60%", ...boxProps.sx }}>
      {children}
    </Box>
  );
}
