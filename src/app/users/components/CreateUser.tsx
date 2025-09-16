import {
  Autocomplete,
  FormControl,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  PositionAPI,
  PositionListAPIRes,
  UserAPI,
  UserDetailAPIRes,
} from "api";
import {
  FormDialog,
  FormLabel,
  Loading,
  SnackbarDataType,
} from "components";
import { Genders, UserRoles } from "data";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { isValidNumberOnly } from "utils";

interface IFormInput {
  name: string;
  userName: string;
  email: string;
  password: string;
  gender: { label: string; value: string };
  userRole: { label: string; value: string };
  position: Position;
  address: string;
  phone: string;
  dob: Date;
  startJoinDate: Date;
  bankAccounts: string;
}

interface CreateUserProps {
  open?: boolean;
  onClose?: () => void;
  onCreateSuccess?: (data: UserDetailAPIRes) => void;
}

const CreateUser = ({ open, onClose, onCreateSuccess }: CreateUserProps) => {
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

  const { data: positions, isLoading } = useSWR("/api/positions", () => {
    return new Promise<PositionListAPIRes[]>(async (resolve, reject) => {
      try {
        const response = await PositionAPI.getList();
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    });
  });

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      if (formData.name) {
        setOpenOverlayLoading(true);
        const res = await UserAPI.create({
          name: formData.name,
          username: formData.userName,
          email: formData.email,
          password: formData.password,
          user_role: formData.userRole.value,
          position_id: formData.position?.id,
          address: formData.address,
          phone: formData.phone,
          is_active: true,
          gender: formData.gender.value,
          dob: dayjs(formData.dob).format("YYYY-MM-DD"),
          start_join_date: dayjs(formData.startJoinDate).format("YYYY-MM-DD"),
          bank_accounts: formData.bankAccounts,
        });
        const res2 = await UserAPI.getById(res.data.id);
        onCreateSuccess?.(res2.data);
        setOpenOverlayLoading(false);
        setSnackbar({
          open: true,
          text: res.data.message,
          type: "success",
        });
        reset();
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

  if (isLoading) {
    return <Loading open={true} />;
  }

  return (
    <FormDialog
      title="Create User"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      open={open}
    >
      <Stack spacing={1}>
        {/* Name */}
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
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* User Name */}
        <FormControl error={!!errors["userName"]}>
          <FormLabel>User Name</FormLabel>
          <Controller
            control={control}
            name="userName"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["userName"]}
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Email */}
        <FormControl error={!!errors["email"]}>
          <FormLabel>Email</FormLabel>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["email"]}
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Password */}
        <FormControl error={!!errors["password"]}>
          <FormLabel>Password</FormLabel>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                type="password"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["password"]}
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
                autoFocus={false}
              />
            )}
          />
        </FormControl>

        {/* Date of Birth */}
        <FormControl error={!!errors["dob"]}>
          <FormLabel>Date of Birth</FormLabel>
          <Controller
            name="dob"
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
                    sx: {
                      backgroundColor: 'grey.50',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.300',
                      },
                    }
                  },
                }}
                format="DD/MM/YYYY"
              />
            )}
          />
        </FormControl>

        {/* User Role */}
        <FormControl error={!!errors["userRole"]}>
          <FormLabel>User Role</FormLabel>
          <Controller
            name="userRole"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(_, item) => {
                  field.onChange(item);
                }}
                value={field.value || null}
                getOptionLabel={(option) => option?.label ?? ""}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                options={UserRoles}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.label}>
                      {option.label}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors["userRole"]}
                    variant="outlined"
                    size="small"
                    placeholder="Please choose user role"
                    sx={{
                      backgroundColor: 'grey.50',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.300',
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

        {/* Position */}
        <FormControl error={!!errors["position"]}>
          <FormLabel>Position</FormLabel>
          <Controller
            name="position"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                options={positions || []}
                value={field.value || null}
                getOptionLabel={(option) => option.name}
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.position}
                    placeholder="Select Choose station"
                    size="small"
                    sx={{
                      backgroundColor: 'grey.50',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.300',
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* Start Join Date */}
        <FormControl error={!!errors["startJoinDate"]}>
          <FormLabel>Start Join Date</FormLabel>
          <Controller
            name="startJoinDate"
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
                      backgroundColor: 'grey.50',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.300',
                      },
                    }
                  },
                }}
                format="DD/MM/YYYY"
              />
            )}
          />
        </FormControl>

        {/* Gender */}
        <FormControl error={!!errors["gender"]}>
          <FormLabel>Gender</FormLabel>
          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(_, item) => {
                  field.onChange(item);
                }}
                value={field.value || null}
                getOptionLabel={(option) => option?.label ?? ""}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                options={Genders}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.label}>
                      {option.label}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors["gender"]}
                    variant="outlined"
                    placeholder="Please choose gender"
                    size="small"
                    sx={{
                      backgroundColor: 'grey.50',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey.300',
                      },
                    }}
                  />
                )}
                clearIcon
              />
            )}
          />
        </FormControl>

        {/* Address */}
        <FormControl error={!!errors["address"]}>
          <FormLabel>Address</FormLabel>
          <Controller
            control={control}
            name="address"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["address"]}
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Phone */}
        <FormControl error={!!errors["phone"]}>
          <FormLabel>Phone</FormLabel>
          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (isValidNumberOnly(inputValue)) {
                    field.onChange(inputValue);
                  }
                }}
                error={!!errors["phone"]}
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Bank Account */}
        <FormControl error={!!errors["bankAccounts"]}>
          <FormLabel >
              Bank Account <span className="optional">(Optional)</span>
          </FormLabel>

          <Controller
            control={control}
            name="bankAccounts"
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["bankAccounts"]}
                size="small"
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey.300',
                  },
                }}
              />
            )}
          />
        </FormControl>
      </Stack>
    </FormDialog>
  );
};

export default CreateUser;
