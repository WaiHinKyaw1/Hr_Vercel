import { FormControl, OutlinedInput, Stack, Typography } from "@mui/material";
import { UserAPI, UserDetailAPIRes } from "api";
import { Loading } from "components";
import ViewDialog from "components/Dialog/ViewDialog";
import dayjs from "dayjs";
import useSWR from "swr";

interface UserDetailProps {
  id?: number | null;
  open?: boolean;
  onClose?: () => void;
}

const UserDetail = ({ id, open, onClose }: UserDetailProps) => {
  const { data: user, isLoading: isLoadingUser } = useSWR(
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

  if (isLoadingUser) return <Loading />;

  return (
    <ViewDialog title="User Detail" open={open} onClose={onClose}>
      <Stack spacing={1}>
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Name
          </Typography>
          <OutlinedInput
            disabled
            value={user?.name || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* User Name */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            User Name
          </Typography>
          <OutlinedInput
            disabled
            value={user?.username || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Email */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Email
          </Typography>
          <OutlinedInput
            disabled
            value={user?.email || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Password */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Password
          </Typography>
          <OutlinedInput
            disabled
            value="••••••••"
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Date of Birth */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Date of Birth
          </Typography>
          <OutlinedInput
            disabled
            value={user?.dob ? dayjs(user.dob).format("DD/MM/YYYY") : "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* User Role */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            User Role
          </Typography>
          <OutlinedInput
            disabled
            value={user?.user_role || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Position */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Position
          </Typography>
          <OutlinedInput
            disabled
            value={user?.position?.name || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Start Join Date */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Start Join Date
          </Typography>
          <OutlinedInput
            disabled
            value={
              user?.start_join_date
                ? dayjs(user.start_join_date).format("DD/MM/YYYY")
                : "-"
            }
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Gender */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Gender
          </Typography>
          <OutlinedInput
            disabled
            value={user?.gender || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Address */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Address
          </Typography>
          <OutlinedInput
            disabled
            value={user?.address || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Phone */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
          >
            Phone
          </Typography>
          <OutlinedInput
            disabled
            value={user?.phone || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>

        {/* Bank Account */}
        <FormControl>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
          >
            Bank Account
          </Typography>
          <OutlinedInput
            disabled
            value={user?.bank_accounts || "-"}
            size="small"
            sx={{
              backgroundColor: "grey.50",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
            }}
          />
        </FormControl>
      </Stack>
    </ViewDialog>
  );
};

export default UserDetail;