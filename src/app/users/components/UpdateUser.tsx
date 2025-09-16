import {
  Autocomplete,
  FormControl,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  UserAPI,
  UserDetailAPIRes,
  UpdateUserAPIReq,
  PositionListAPIRes,
  PositionAPI,
} from "api";
import { FormDialog, FormLabel, SnackbarDataType } from "components";
import { Genders, UserRoles } from "data";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { isValidNumberOnly } from "utils";

interface IFormInput {
  name: string;
  userName: string;
  email: string;
  gender: { label: string; value: string };
  userRole: { label: string; value: string };
  position: Position;
  address: string;
  phone: string;
  dob: Date;
  startJoinDate: Date;
  bankAccounts: string;
}

interface UpdateUserProps {
  id?: number | null;
  open?: boolean;
  onClose?: () => void;
  onUpdateSuccess?: (data: UserDetailAPIRes) => void;
}

const UpdateUser = ({
  id,
  open,
  onClose,
  onUpdateSuccess,
}: UpdateUserProps) => {
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({
    open: false,
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    mutate,
  } = useSWR(
    `/api/users/${id}`,
    id
      ? () => {
          return new Promise<UserDetailAPIRes>(async (resolve, reject) => {
            try {
              const response = await UserAPI.getById(id);
              return resolve(response.data);
            } catch (error) {
              return reject(error);
            }
          });
        }
      : null
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { data: positions } = useSWR("/api/positions", () => {
    return new Promise<PositionListAPIRes[]>(async (resolve, reject) => {
      try {
        const response = await PositionAPI.getList();
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    });
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        userName: user.username,
        email: user.email,
        gender: Genders.find((gender) => gender.value === user.gender),
        userRole: UserRoles.find(
          (userRole) => userRole.value === user.user_role
        ),
        position: user.position,
        address: user.address,
        phone: user.phone,
        dob: user.dob,
        startJoinDate: user.start_join_date,
        bankAccounts: user.bank_accounts,
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      if (formData.name && id) {
        setOpenOverlayLoading(true);
        const reqData: UpdateUserAPIReq = {
          name: formData.name,
          username: formData.userName,
          email: formData.email,
          user_role: formData.userRole?.value,
          gender: formData.gender?.value,
          position_id: formData.position?.id,
          address: formData.address,
          phone: formData.phone,
          dob: dayjs(formData.dob).format("YYYY-MM-DD"),
          start_join_date: dayjs(formData.startJoinDate).format("YYYY-MM-DD"),
          bank_accounts: formData.bankAccounts,
        };

        const res = await UserAPI.update(id, reqData);
        const res2 = await UserAPI.getById(id);
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
      title="Update User"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      formType="update"
      open={open}
      openLoading={isLoadingUser}
    >
      <Stack spacing={1}>
        {/* Name */}
        <FormControl error={!!errors.name}>
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
        <FormControl error={!!errors.userName}>
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
                    placeholder="Please choose user role"
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

export default UpdateUser;
