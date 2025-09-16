import {
  FormControl,
  OutlinedInput,
  Stack,
} from "@mui/material";
import {
  PositionAPI,
  PositionDetailsAPIRes,
} from "api";
import {
  FormDialog,
  FormLabel,
  SnackbarDataType,
} from "components";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  name: string;
}

interface CreatePositionProps {
  open?: boolean;
  onClose?: () => void;
  onCreateSuccess?: (data: PositionDetailsAPIRes) => void;
}

const CreatePosition = ({ open, onClose, onCreateSuccess }: CreatePositionProps) => {
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({
    open: false,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      setOpenOverlayLoading(true);
      const res = await PositionAPI.create({
        name: formData.name,
        is_active: true,
      });
      const res2 = await PositionAPI.getById(res.data.id);
      onCreateSuccess?.(res2.data);

      setOpenOverlayLoading(false);
      setSnackbar({
        open: true,
        text: res.data.message,
        type: "success",
      });
      reset();
      onClose?.();
    } catch (error: any) {
      setOpenOverlayLoading(false);
      setSnackbar({
        open: true,
        text: JSON.stringify(error?.response?.data?.message || error),
        type: "error",
      });
    }
  };

  return (
    <FormDialog
      title="Create Position"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      open={open}
    >
      <Stack spacing={1}>
        <FormControl error={!!errors["name"]}>
          <FormLabel>Name</FormLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["name"]}
              />
            )}
          />
        </FormControl>
      </Stack>
    </FormDialog>
  );
};

export default CreatePosition;
