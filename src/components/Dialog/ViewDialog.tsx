"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Color } from "style";
import { CloseButton } from "components/Button";
import { Loading } from "components/Loading";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ViewDialogProps {
  open?: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  contentWrapperStyle?: React.CSSProperties | null;
  openLoading?: boolean;
}

const ViewDialog = ({
  open = true,
  title,
  onClose,
  children,
  style,
  contentWrapperStyle,
  openLoading = false,
}: ViewDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      scroll="paper"
      TransitionComponent={Transition}
      style={style}
      PaperProps={{
        sx: fullScreen
          ? {}
          : {
              height: "100vh",
              maxHeight: "100vh",
              width: "50vw",
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              margin: 0,
              borderRadius: 0,
            },
      }}
    >
      <div style={{ ...contentWrapperStyle }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          pl={6}
          pr={6}
          alignItems="center"
          sx={{
            height: 70,
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1100,
          }}
        >
          <Typography
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: Color.primary,
              ...style,
            }}
          >
            {title}
          </Typography>
          <CloseButton onClick={onClose} />
        </Stack>
        {openLoading ? (
          <Loading style={{ height: 200 }} open={true} />
        ) : (
          <DialogContent style={{ paddingLeft: 50, paddingRight: 50,marginBottom:50 }}>
            {children}
          </DialogContent>
        )}
      </div>
    </Dialog>
  );
};

export default ViewDialog;
