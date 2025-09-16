import { Box } from "@mui/material";
import { ReactNode } from "react";
import { OverlayLoading } from "../Loading";
import { SnackbarDataType, SnackbarMessage } from "../Message";


interface PageWrapperProps {
  children?: ReactNode;
  openOverlayLoading?: boolean;
  snackbar?: SnackbarDataType;
  handleOnCloseSnackbar?: () => void;
}

export default function PageWrapper({
  children,
  openOverlayLoading,
  snackbar,
  handleOnCloseSnackbar,
}: PageWrapperProps) {
  return (
    <Box>
      {children}
      <SnackbarMessage snackbar={snackbar} handleOnClose={handleOnCloseSnackbar} />
      {openOverlayLoading ? <OverlayLoading /> : null}
    </Box>
  );
}
