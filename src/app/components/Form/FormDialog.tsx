"use client";
import React from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { DialogContent, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

import { Color } from "style";
import { SnackbarDataType, SnackbarMessage } from "components/Message";
import { Loading, OverlayLoading } from "components/Loading";
import { CancelButton, CloseButton, SaveButton, UpdateButton } from "components/Button";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type FormDialogFormType = "create" | "update";
interface FormDialogProps {
  children?: React.ReactNode;
  handleOnClose?: () => void;
  open?: boolean;
  title?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  saveButtonText?: string;
  updateButtonText?: string;
  openOverlayLoading?: boolean;
  handleOnCloseSnackbar?: () => void;
  style?: React.CSSProperties;
  formType?: FormDialogFormType;
  snackbar?: SnackbarDataType;
  contentWrapperStyle?: React.CSSProperties | null;
  openLoading?: boolean;
  disabledSaveBtn?: boolean;
}
export default function FormDialog({
  handleOnClose,
  children,
  title,
  onSubmit,
  formType = "create",
  openOverlayLoading = false,
  handleOnCloseSnackbar,
  snackbar,
  saveButtonText,
  style,
  open = true,
  contentWrapperStyle,
  openLoading = false,
  disabledSaveBtn = false,
}: FormDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md")); 
  return (
    <React.Fragment>
      <Dialog
        open={open}
        fullScreen={fullScreen}
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
                margin: 0,
                bottom: 0,
                borderRadius: 0,
                pb: 2
              },
        }}
        TransitionComponent={Transition}
        scroll="paper"
        aria-describedby="alert-dialog-slide-description"
        aria-labelledby="scroll-dialog-title"
        style={style}
        onClose={handleOnClose}
      >
        <div
          style={{
            ...contentWrapperStyle,
          }}
        >
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
            <Typography style={{ fontSize: "1.3rem", fontWeight: 700, color: Color.primary, ...style }}>
              {title}
            </Typography>
            <CloseButton onClick={handleOnClose} />
          </Stack>
          {openLoading ? (
            <Loading style={{ height: 200 }} open={true} />
          ) : (
            <DialogContent style={{ padding: 0 }}>
              <form onSubmit={onSubmit} style={{ paddingLeft: 50, paddingRight: 50 }}>
                {children}
                <Stack mt={3} alignItems="center" direction="row" justifyContent="center" spacing={1}>
                  {formType == "create" ? (
                    <SaveButton disabled={disabledSaveBtn} type="submit" >  {saveButtonText || "Save"}</SaveButton>
                  ) : (
                    <UpdateButton disabled={disabledSaveBtn} type="submit" />
                  )}
                  <CancelButton onClick={handleOnClose} />
                </Stack>
              </form>
            </DialogContent>
          )}
        </div>
      </Dialog>
      {openOverlayLoading ? <OverlayLoading /> : null}
      <SnackbarMessage snackbar={snackbar} handleOnClose={handleOnCloseSnackbar} />
    </React.Fragment>
  );
}
