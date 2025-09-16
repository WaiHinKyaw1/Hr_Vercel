import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import SideMenu from "../SideMenu";
import { LogoutConfirmation } from "../Confirmation";
import { logout } from "api/Auth/AuthAPI";
import { signOut } from "next-auth/react";
import { errorHandler } from "utils";
import { useRouter } from "next/navigation";
import { FormDialog, FormLabel } from "../Form";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SnackbarDataType } from "../Message";
import { AuthAPI } from "api/Auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Profile from "../Profile";
import { OverlayLoading } from "../Loading";
import { usePWAInstall } from "hooks/usePWAInstall";
interface PageHeaderProps {
  children?: ReactNode;
  title?: string;
  visibleBack?: boolean;
  onClickBack?: () => void;
}
type IFormInput = {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
};
const OPTIONS = [
  { label: "Profile", key: "profile", icon: "images/profile.png" },
  {
    label: "Change Password",
    key: "change_password",
    icon: "images/change_pass.png",
  },
  { label: "Logout", key: "logout", icon: "images/logout.png" },
  { label: "Install", key: "install", icon: "images/download.png" },
];
const ITEM_HEIGHT = 48;
const PageHeading = ({
  children,
  title,
  visibleBack = false,
  onClickBack,
}: PageHeaderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isInstalled, triggerInstall } = usePWAInstall();
  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const {
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((prev) => !prev);
  const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const closeMenu = () => {
    setAnchorEl(null);
  };
  const handleLogOut = async () => {
    try {
      setLogoutConfirm(false);
      setOpenOverlayLoading(true);
      await logout();
      await signOut({ redirect: false });
      router.replace("/login");
    } catch (err) {
      errorHandler(err);
    } finally {
      setOpenOverlayLoading(false);
    }
  };
  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      setOpenOverlayLoading(true);
      const reqData = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        password_confirmation: formData.passwordConfirmation,
      };

      const res = await AuthAPI.changePassword(reqData);
      setOpenOverlayLoading(false);
      setSnackbar({
        open: true,
        text: res.data.message,
        type: "success",
      });
      reset({
        currentPassword: "",
        newPassword: "",
        passwordConfirmation: "",
      });
      await logout();
      await signOut({ redirect: false });
      router.replace("/login");
    } catch (error: any) {
      setOpenOverlayLoading(false);
      setSnackbar({
        open: true,
        text: JSON.stringify(error?.response?.data?.message || error),
        type: "error",
      });
    }
  };
  if (openOverlayLoading) {
    return <OverlayLoading />;
  }
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      sx={{ backgroundColor: "#fff" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <IconButton onClick={() => setOpenSideMenu(true)}>
          <Box
            sx={{
              width: { lg: 30, md: 25, sm: 20, xs: 20 },
              height: { lg: 30, md: 25, sm: 20, xs: 20 },
              borderRadius: "100px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/burger-bar.png"
              style={{
                borderRadius: "100px",
                width: "100%",
                height: "100%",
                objectFit: "fill",
              }}
              alt="sidebar"
              width={30}
              height={30}
            />
          </Box>
          {/* <Image
            src="/images/burger-bar.png"
            alt="sidebar"
            width={30}
            height={30}
          /> */}
        </IconButton>

        {visibleBack && (
          <IconButton onClick={onClickBack}>
            <Image
              src="/icons/back.png"
              alt="Back Icon"
              width={20}
              height={20}
            />
          </IconButton>
        )}

        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          {title}
        </Typography>

        {children}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <Box
          sx={{
            width: { lg: 30, md: 25, sm: 20, xs: 20 },
            height: { lg: 30, md: 25, sm: 20, xs: 20 },
            borderRadius: "100px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/icons/notification.png"
            style={{
              borderRadius: "100px",
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
            alt="Notification icon"
            width={30}
            height={30}
          />
        </Box>

        <Button onClick={handleToggle}>
          <Box
            sx={{
              width: { lg: 40, md: 35, sm: 30, xs: 30 },
              height: { lg: 40, md: 35, sm: 30, xs: 30 },
              borderRadius: "100px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                borderRadius: "100px",
                width: "100%",
                height: "100%",
                objectFit: "fill",
              }}
              src={"/images/logo.png"}
              alt="User Photo"
              width={50}
              height={50}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                color: theme.palette.primary.dark,
                mb: "5px",
                fontWeight: "bold",
              }}
            >
              {/* {user?.name} */}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.primary.dark,
                fontSize: "13px",
                opacity: 0.5,
              }}
            >
              {/* {user?.role} */}
            </Typography>
          </Box>
          <Image
            src="/icons/dropdown.png"
            alt="Dropdown Icon"
            width={15}
            height={15}
            style={{
              padding: 0,
              transition: "transform 0.2s ease-in-out",
              transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
              marginLeft: 15,
            }}
          />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          PaperProps={{
            style: { maxHeight: ITEM_HEIGHT * 4.5, width: "20ch" },
          }}
        >
          {OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => {
                closeMenu();
                if (option.key === "logout") setLogoutConfirm(true);
                if (option.key === "profile") setProfile(true);
                if (option.key === "change_password") setChangePassword(true);
                if (option.key === "install") {
                  if (!isInstalled) triggerInstall();
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Image
                  src={`/${option.icon}`}
                  width={17}
                  height={17}
                  alt={option.icon}
                />
                <Typography style={{ fontSize: 15 }}>{option.label}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <SideMenu open={openSideMenu} setOpen={setOpenSideMenu} />
      {logoutConfirm && (
        <LogoutConfirmation
          open={logoutConfirm}
          handleOnClose={() => setLogoutConfirm(false)}
          handleLogout={handleLogOut}
        />
      )}
      {changePassword && (
        <FormDialog
          title="Change your password"
          onSubmit={handleSubmit(onSubmit)}
          handleOnClose={() => setChangePassword(false)}
          openOverlayLoading={openOverlayLoading}
          snackbar={snackbar}
          handleOnCloseSnackbar={() => setSnackbar({ open: false })}
          formType="create"
          open={true}
          updateButtonText="Change Password"
        >
          <Stack spacing={1}>
            <FormControl error={!!errors.currentPassword}>
              <FormLabel>Current Password</FormLabel>
              <Controller
                control={control}
                name="currentPassword"
                rules={{ required: true }}
                render={({ field }) => (
                  <OutlinedInput
                    type={showCurrentPassword ? "text" : "password"}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={!!errors["currentPassword"]}
                    placeholder="Enter Current Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowCurrentPassword}
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
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
                        <IconButton
                          onClick={handleClickShowNewPassword}
                          edge="end"
                        >
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
                    val === getValues("newPassword") ||
                    "Passwords do not match",
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
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
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
      )}
      {profile && (
        <Profile
          open={profile}
          handleOnClose={() => setProfile(false)}
          title={"Profile Information"}
        />
      )}
    </Stack>
  );
};

export default PageHeading;
