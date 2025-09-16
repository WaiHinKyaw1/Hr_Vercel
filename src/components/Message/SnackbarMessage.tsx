import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export type SnackbarDataType = {
  open: boolean;
  text?: string;
  type?: AlertColor;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackbarMessageProps {
  snackbar?: SnackbarDataType;
  handleOnClose?: () => void;
}

export default function SnackbarMessage({ snackbar, handleOnClose }: SnackbarMessageProps) {
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    if (handleOnClose) handleOnClose();
  };
  if (!snackbar?.open) return null;
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={snackbar?.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleClose} severity={snackbar.type}  sx={{ width: "fit-content", display: "inline-flex" }}>
          {snackbar?.text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
