"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  FormControl,
  OutlinedInput,
  Typography,
  FormHelperText,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { SnackbarDataType, SnackbarMessage } from "components/Message";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { OverlayLoading } from "components/Loading";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InstallPWAButton from "components/InstallPWAButton";
import Image from "next/image";

interface IFormInput {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [openOverlayLoading, setOpenOverlayLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      if (formData.username && formData.password) {
        setOpenOverlayLoading(true);
        const res = await signIn("credentials", {
          username: formData.username,
          password: formData.password,
          callbackUrl: "/",
          redirect: false,
        });
        if (res?.ok) {
          setOpenOverlayLoading(false);
          router.replace("/");
        } else {
          setOpenOverlayLoading(false);
          setSnackbar({
            open: true,
            text: res?.error || "Incorrect User Name & Password ",
            type: "error",
          });
        }
      }
    } catch (error) {
      setOpenOverlayLoading(false);
      console.log(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      {/* Background Image */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/images/login_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          px: { xs: 2, sm: 3, md: 0 },
          py: { xs: 2, sm: 3, md: 0 },
          margin: 0,
          padding: 0,
        }}
      >
        <Box 
          sx={{ 
            position: "absolute", 
            top: { xs: 12, sm: 16 }, 
            right: { xs: 12, sm: 16 },
            zIndex: 10
          }}
        >
          <InstallPWAButton />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
            p: { md:6, xs: 3, sm: 4 },
            width: {
              xs: "100%",
              sm: "400px",
              md: "680px"
            },
            maxWidth: { xs: "300px", sm: "480px" },
            backgroundColor: "#EFFFDB",
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            zIndex: 1,
          }}
        >
          {/* Logo Section */}
          <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Ultimate Solutions Logo"
                width={isMobile ? 60 : 100}
                height={isMobile ? 45 : 80}
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "16px" },
                letterSpacing: "0.5px",
              }}
            >
              Ultimate Solutions Co.,Ltd
            </Typography>
          </Box>

          {/* Username Field */}
          <FormControl error={!!errors["username"]}>
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OutlinedInput
                  placeholder="Username"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors["username"]}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: 2,
                    fontSize: { xs: "14px", sm: "16px" },
                    "& .MuiOutlinedInput-input": {
                      padding: { xs: "12px 14px", sm: "16.5px 14px" },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(224, 224, 224, 0.6)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#169B0E",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#169B0E",
                    },
                  }}
                />
              )}
            />
            {errors.username && (
              <FormHelperText sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                Username is required
              </FormHelperText>
            )}
          </FormControl>

          {/* Password Field */}
          <FormControl error={!!errors["password"]}>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors["password"]}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: 2,
                    fontSize: { xs: "14px", sm: "16px" },
                    "& .MuiOutlinedInput-input": {
                      padding: { xs: "12px 14px", sm: "16.5px 14px" },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(224, 224, 224, 0.6)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#169B0E",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#169B0E",
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleClickShowPassword} 
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                Password is required
              </FormHelperText>
            )}
          </FormControl>

          {/* Remember Me Checkbox */}
          <FormControlLabel
            control={
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value || false}
                    sx={{
                      color: "#169B0E",
                      "&.Mui-checked": {
                        color: "#169B0E",
                      },
                      transform: isMobile ? "scale(0.8)" : "scale(0.9)",
                    }}
                  />
                )}
              />
            }
            label={
              <Typography sx={{ fontSize: { xs: "13px", sm: "14px" }, color: "#666" }}>
                Remember
              </Typography>
            }
            sx={{ alignSelf: "flex-start", mt: -0.5 }}
          />

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#169B0E",
              color: "white",
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(22, 155, 14, 0.3)",
              "&:hover": {
                backgroundColor: "#0f7a0b",
                boxShadow: "0 6px 16px rgba(22, 155, 14, 0.4)",
              },
              mt: { xs: 0.5, sm: 1 },
              mb: {xs: 2, sm: 4 , md:6}
            }}
          >
            Log In
          </Button>
        </Box>

        {/* Footer positioned at bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 12, sm: 20 },
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            px: 2,
            zIndex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ 
              color: "rgba(0, 0, 0, 0.6)", 
              fontSize: { xs: "13px", sm: "14px", md: "16px"  },
              textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
              lineHeight: 1.2,
              fontWeight: 500
            }}
          >
            © 2025, Made with ❤️ by{" "}
            <span style={{ color: "#169B0E", fontWeight: 700 }}>
              Ultimate Solutions Co., Ltd.
            </span>
          </Typography>
        </Box>

        {openOverlayLoading ? <OverlayLoading /> : null}
        <Box>
          <SnackbarMessage
            snackbar={snackbar}
            handleOnClose={() => setSnackbar({ open: false })}
          />
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
