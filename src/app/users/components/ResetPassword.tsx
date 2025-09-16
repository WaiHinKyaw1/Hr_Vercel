import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { ResetPasswordAPIReq, UserAPI, UserDetailAPIRes } from "api";
import { FormDialog, FormLabel, SnackbarDataType } from "components";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

interface IFormInput {
  name: string;
  newPassword: string;
  passwordConfirmation: string;
}
interface ResetPasswordProps {
  id?: number | null;
  open?: boolean;
  onClose?: () => void;
  onUpdateSuccess?: (data: UserDetailAPIRes) => void;
}
const ResetPassword = ({
  id,
  open,
  onClose,
  onUpdateSuccess,
}: ResetPasswordProps) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    getValues,
    formState: { errors },
  } = useForm<IFormInput>();
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      if (formData.newPassword && id) {
        setOpenOverlayLoading(true);
        const reqData: ResetPasswordAPIReq = {
          new_password: formData.newPassword,
        };

        const res = await UserAPI.resetPassword(id, reqData);
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
  const handleClickShowNewPassword = () => 
    setShowNewPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);
  return (
    <FormDialog
      title="Reset Password"
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
        <FormControl error={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: false }}
            render={({ field }) => (
              <OutlinedInput
                disabled
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["name"]}
              />
            )}
          />
        </FormControl>
        <FormControl error={!!errors.newPassword}>
          <FormLabel>New Password</FormLabel>
          <Controller
            control={control}
            name="newPassword"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                type={showNewPassword ? "text" : "password"}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["newPassword"]}
                placeholder="Enter New Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowNewPassword} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
        </FormControl>
        <FormControl error={!!errors.passwordConfirmation}>
          <FormLabel>Confirm Password</FormLabel>
          <Controller
            control={control}
            name="passwordConfirmation"
            rules={{
              required: true,
              validate: (val) =>
                val === getValues("newPassword") || "Passwords do not match",
            }}
            render={({ field }) => (
              <OutlinedInput
                type={showConfirmPassword ? "text" : "password"}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["passwordConfirmation"]}
                placeholder="Repeat New Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
          {errors.passwordConfirmation && (
            <FormHelperText>
              {errors.passwordConfirmation.message}
            </FormHelperText>
          )}
        </FormControl>
      </Stack>
    </FormDialog>
  );
};

export default ResetPassword;
