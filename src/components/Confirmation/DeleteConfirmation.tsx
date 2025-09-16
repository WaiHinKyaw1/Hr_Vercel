import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface DeleteConfirmationProps {
  children?: React.ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
  text?: string | null;
}
const DeleteConfirmation = ({ text, onConfirm, onClose }: DeleteConfirmationProps) => {
  return (
    <Box>
      <Dialog
        open={true}
        fullWidth={false} // Don't stretch to container
        maxWidth={false}
      >
        <Box sx={{ backgroundColor: "white", pb: 4, pt: 4 }}>
          <DialogTitle>
            <Box
              display="flex"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                mb: 5,
              }}
            >
              {/* <Typography style={{ fontWeight: "bold", fontSize: "1rem", color: "#fff" }}>Alert Message</Typography> */}
              <Image src={"/icons/delete.png"} alt="Delete Confirmation" width={60} height={60} />
              {/* <CloseButton onClick={onClose} style={{ position: "absolute", right: 10 }} iconColor="white" /> */}
            </Box>
          </DialogTitle>
          <DialogContent sx={{ paddingX: 5 }}>
            <Stack alignItems="center">
              <Typography color="#000000" textAlign={"center"}>
                {text}
              </Typography>
              <Typography color="#000000" textAlign={"center"} mt={1}>
                {"This action can't be undone!"}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                bgcolor: "white",
                color: "#000000",
                width: 250,
                paddingY: 1,
                borderRadius: 3,
                fontWeight: "bold",
                border: "1px solid #CBD0D7",
                ":hover": { bgcolor: "rgba(242, 238, 238, 0.91)" },
              }}
              onClick={onClose}
            >
              No, Cancel.
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "red",
                color: "#fff",
                width: 250,
                paddingY: 1,
                borderRadius: 3,
                fontWeight: "bold",
                ":hover": { opacity: 0.5 },
              }}
              onClick={onConfirm}
            >
              Yes, Delete it now.
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DeleteConfirmation;
