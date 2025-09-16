import { FormControl, OutlinedInput, Stack } from "@mui/material";
import { LeaveTypeAPI } from "api/LeaveType";
import { FormDialog, FormLabel, SnackbarDataType } from "components";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  leave_type: string;
}

const CreateLeaveType = ({
  open,
  onClose,
  onCreateSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onCreateSuccess: (created: any) => void;
}) => {
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    if (!formData.leave_type || formData.leave_type.trim() === "") {
      setSnackbar({
        open: true,
        text: "Leave type is required.",
        type: "error",
      });
      return;
    }
    setOpenOverlayLoading(true);
    try {
      const response = await LeaveTypeAPI.create(formData);
      const created = response.data?.data;
      setSnackbar({
        open: true,
        text: response.data?.message || "Leave type created successfully.",
        type: "success",
      });
      if (created) {
        onCreateSuccess(created);
      }
      reset();
      onClose();
    } catch (error: any) {
      setSnackbar({
        open: true,
        text: error?.response?.data?.message || "Failed to create leave type.",
        type: "error",
      });
    } finally {
      setOpenOverlayLoading(false);
    }
  };

  return (
    <FormDialog
      title="Create Leave Type"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      open={open}
    >
      <Stack spacing={1}>
        <FormControl error={!!errors["leave_type"]}>
          <FormLabel>Type of Leave</FormLabel>
          <Controller
            control={control}
            name="leave_type"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["leave_type"]}
              />
            )}
          />
        </FormControl>
      </Stack>
    </FormDialog>
  );
};

export default CreateLeaveType;
