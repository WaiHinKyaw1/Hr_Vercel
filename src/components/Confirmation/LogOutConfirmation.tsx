"use client";

import React from "react";
import {
  Dialog,
  Slide,
  DialogTitle,
  Box,
  Button,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface LogoutConfirmationProps {
  open?: boolean;
  handleOnClose?: () => void;
  handleLogout: () => void;
}

export default function LogoutConfirmation({
  open = false,
  handleOnClose,
  handleLogout,
}: LogoutConfirmationProps) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleOnClose}
      scroll="paper"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Image
          src="/images/logout.png"
          alt="Logout Icon"
          width={25}
          height={25}
          priority
        />
        <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
          Logout Confirmation
        </Typography>
      </DialogTitle>

      <Box sx={{ px: 3, pb: 5, pt: 2, textAlign: "center", fontSize: 15 }}>
        <Typography color="textSecondary">
          Are you sure you want to log out from the system?
        </Typography>
      </Box>

      <Divider />

      <Stack
        direction="row"
        sx={{ justifyContent: "center", py: 2, px: 3 }}
        spacing={2}
      >
        <Button
          onClick={handleLogout}
          sx={{
            minWidth: 120,
            color: "#fff",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "red",
            bgcolor: "red",
            "&:hover": { bgcolor: "red" },
          }}
        >
          Log Out
        </Button>
        <Button
          onClick={handleOnClose}
          sx={{
            minWidth: 120,
            color: "#000",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "red",
            bgcolor: "#fff",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Dialog>
  );
}
