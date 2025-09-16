import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface PageContentHeaderBarProps {
  children?: ReactNode;
}

export default function PageContentHeaderBar({ children }: PageContentHeaderBarProps) {
  return (
    <Stack
      mb={1}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      position={"sticky"}
      top={0}
      zIndex={1000}
      bgcolor={"transparent"}
      py={1}
    >
      {children}
    </Stack>
  );
}
