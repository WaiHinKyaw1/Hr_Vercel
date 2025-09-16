"use client";
import React from "react";
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

import Image from "next/image";
import useSWR from "swr";
import { UserAPI, UserDetailAPIRes } from "api";
import { SnackbarDataType, SnackbarMessage } from "./Message";
import { OverlayLoading } from "./Loading";
import { useSession } from "next-auth/react";
import ViewDialog from "./Dialog/ViewDialog";
import dayjs from "dayjs";

interface FormDialogProps {
  handleOnClose?: () => void;
  open?: boolean;
  title?: string;
  onSubmit?: () => void;
  openOverlayLoading?: boolean;
  handleOnCloseSnackbar?: () => void;
  style?: React.CSSProperties;
  snackbar?: SnackbarDataType;
  openLoading?: boolean;
}

export default function Profile({
    handleOnClose,
    openOverlayLoading = false,
    handleOnCloseSnackbar,
    snackbar,
    open = true,
}: FormDialogProps) {
    const { data: session } = useSession();
    const user = session?.user;
  const { id } = user;
  const { data: users } = useSWR(
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
  return (
    <>
      <ViewDialog
      title="Profile Information"
      open={open}
      onClose={handleOnClose}>
         <Stack direction="row" spacing={2}>
              <Box>
                <Image src="/images/profile.png" alt="" width={50} height={50} style={{ borderRadius: "50%" }} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography sx={{ fontWeight: 600 }} variant="h2" component="div">
                  {users?.name}
                </Typography>
                <Typography>{users?.position?.name || "-"}</Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <OutlinedInput disabled value={users?.name || "-"} />
              </FormControl>
              <FormControl>
                 <FormLabel>User Name</FormLabel>
                 <OutlinedInput disabled value={user?.username || "-"}></OutlinedInput>
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <OutlinedInput disabled value={users?.email || "-"} />
              </FormControl>
              <FormControl>
                 <FormLabel>Date of Birth</FormLabel>
                <OutlinedInput disabled value={user?.dob ? dayjs(user.dob).format("DD/MM/YYYY") : "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>User Role</FormLabel>
                <OutlinedInput disabled value={users?.user_role || "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>Position</FormLabel>
                <OutlinedInput disabled value={users?.position?.name || "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>Start Join Date</FormLabel>
                <OutlinedInput disabled value={user?.start_join_date
                                ? dayjs(user.start_join_date).format("DD/MM/YYYY")
                                : "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <OutlinedInput disabled value={users?.gender || "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <OutlinedInput disabled value={users?.address || "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <OutlinedInput disabled value={users?.phone || "-"} />
              </FormControl>
              <FormControl>
                <FormLabel>Bank Account</FormLabel>
                <OutlinedInput disabled value={users?.bank_accounts || "-"} />
              </FormControl>
            </Stack>
      </ViewDialog>
      {openOverlayLoading ? <OverlayLoading /> : null}
      <SnackbarMessage snackbar={snackbar} handleOnClose={handleOnCloseSnackbar} />
    </>
  );
}
