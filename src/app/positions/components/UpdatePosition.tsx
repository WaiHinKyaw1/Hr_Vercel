import {
  FormControl,
  OutlinedInput,
  Stack,
} from "@mui/material";
import {
  PositionAPI,
  PositionDetailsAPIRes,
  UpdatePositionAPIReq,
} from "api";
import { FormDialog, FormLabel, SnackbarDataType } from "components";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

interface IFormInput {
  name: string;
}

interface UpdatePositionProps {
  id?: number | null;
  open?: boolean;
  onClose?: () => void;
  onUpdateSuccess?: (data: PositionDetailsAPIRes) => void;
}

const UpdatePosition = ({
  id,
  open,
  onClose,
  onUpdateSuccess,
}: UpdatePositionProps) => {
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({
    open: false,
  });

  
  const {
    data: position,
    isLoading: isLoadingPosition,
    mutate,
  } = useSWR(
    id ? `/api/positions/${id}` : null,
    id
      ? () =>
          new Promise<PositionDetailsAPIRes>(async (resolve, reject) => {
            try {
              const response = await PositionAPI.getById(id);
              resolve(response.data);
            } catch (error) {
              reject(error);
            }
          })
      : null
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  
  useEffect(() => {
    if (position) {
      reset({ name: position.name });
    }
  }, [position, reset]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      if (formData.name && id) {
        setOpenOverlayLoading(true);

        const reqData: UpdatePositionAPIReq = {
          name: formData.name,
          is_active: position?.is_active ?? true, 
        };

        const res = await PositionAPI.update(id, reqData);
        const res2 = await PositionAPI.getById(id);
        setOpenOverlayLoading(false);
        setSnackbar({
          open: true,
          text: res.data.message,
          type: "success",
        });

        await mutate();
        onUpdateSuccess?.(res2.data);
        onClose?.();
      }
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
      title="Update Position"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      formType="update"
      open={open}
      openLoading={isLoadingPosition}
    >
      <Stack spacing={1}>
        <FormControl>
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

export default UpdatePosition;
