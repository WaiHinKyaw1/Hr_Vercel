import { Dialog } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function OverlayLoading() {
  return (
    <Dialog
      open={true}
      fullWidth
      PaperProps={{
        sx: {
          px: 4,
          py: 4,
          borderRadius: 1,
        },
        style: {
          alignItems: "center",
          width: 150,
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <CircularProgress />
    </Dialog>
  );
}
