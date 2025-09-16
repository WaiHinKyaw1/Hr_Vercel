import {
  FormControl,
  OutlinedInput,
  Stack,
  TextField,
  Autocomplete,
} from "@mui/material";
import { FormDialog, FormLabel, SnackbarDataType } from "components";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { OffDayTypes } from "data";

interface IFormInput {
  description: string;
  type: { value: string; label: string } | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface CreateOffDayProps {
  open?: boolean;
  onClose?: () => void;
  onCreateSuccess?: (data: IFormInput) => void;
}

const CreateOffDay = ({
  open,
  onClose,
  onCreateSuccess,
}: CreateOffDayProps) => {
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      description: "",
      type: null,
      startDate: null,
      endDate: null,
    },
  });

  const onSubmit = (formData: IFormInput) => {
    setOpenOverlayLoading(true);
    setTimeout(() => {
      setOpenOverlayLoading(false);
      setSnackbar({
        open: true,
        type: "success",
        text: "Holiday/Off day created successfully (hardcoded).",
      });
      onCreateSuccess?.(formData);
      reset();
      onClose?.();
    }, 1000);
  };

  return (
    <FormDialog
      title="Create Holiday  & OFF day"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      open={open}
    >
      <Stack spacing={1}>
        {/* Description */}
        <FormControl error={!!errors["description"]}>
          <FormLabel>Description</FormLabel>
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                {...field}
                placeholder=""
                error={!!errors["description"]}
                size="small"
                sx={{
                  backgroundColor: "grey.50",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "grey.300",
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Type */}
        <FormControl error={!!errors["type"]}>
          <FormLabel>Type</FormLabel>
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(_, item) => field.onChange(item)}
                value={field.value}
                options={OffDayTypes}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors["type"]}
                    variant="outlined"
                    size="small"
                    placeholder="Please choose type"
                    sx={{
                      backgroundColor: "grey.50",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "grey.300",
                      },
                    }}
                  />
                )}
                clearIcon
                openOnFocus={false}
                onInputChange={() => {}}
                filterOptions={(options) => options}
                freeSolo={false}
                blurOnSelect={true}
              />
            )}
          />
        </FormControl>

        {/* Start Date */}
        <FormControl error={!!errors["startDate"]}>
          <FormLabel>Start Date</FormLabel>
          <Controller
            name="startDate"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                value={field.value ? dayjs(field.value) : null}
                onChange={(e) => field.onChange(e)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!error,
                    placeholder: "dd.mm.yy",
                    sx: {
                      backgroundColor: "grey.50",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "grey.300",
                      },
                    },
                  },
                }}
                format="DD/MM/YYYY"
              />
            )}
          />
        </FormControl>

        {/* End Date */}
        <FormControl error={!!errors["endDate"]}>
          <FormLabel>End Date</FormLabel>
          <Controller
            name="endDate"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                value={field.value ? dayjs(field.value) : null}
                onChange={(e) => field.onChange(e)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!error,
                    placeholder: "dd.mm.yy",
                    sx: {
                      backgroundColor: "grey.50",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "grey.300",
                      },
                    },
                  },
                }}
                format="DD/MM/YYYY"
              />
            )}
          />
        </FormControl>
      </Stack>
    </FormDialog>
  );
};

export default CreateOffDay;