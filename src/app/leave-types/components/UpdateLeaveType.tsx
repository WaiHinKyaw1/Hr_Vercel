import { FormControl, OutlinedInput, Stack } from "@mui/material";
import { LeaveTypeAPI } from "api/LeaveType";
import { FormDialog, FormLabel, SnackbarDataType } from "components";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

interface IFormInput {
  leave_type: string;
}

interface UpdateLeaveTypeProps {
  id?: number | null;
  open: boolean;
  onClose: () => void;
  onUpdateSuccess: (updated: any) => void;
}

const UpdateLeaveType = ({
  id,
  open,
  onClose,
  onUpdateSuccess,
}: UpdateLeaveTypeProps) => {
  const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

  // SWR for current leave type
  const {
    data: leaveType,
    isLoading: isLoadingLeaveType,
    mutate,
  } = useSWR(
    id ? `/api/leave-types/${id}` : null,
    id
      ? async () => {
          const response = await LeaveTypeAPI.getById(id);
          return response.data;
        }
      : null
  );

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // Only reset when new data arrives, like UpdatePosition
  useEffect(() => {
    if (leaveType && leaveType.leave_type !== undefined) {
      reset({ leave_type: leaveType.leave_type });
    }
  }, [leaveType, reset]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    if (!id) return;
    if (!formData.leave_type || formData.leave_type.trim() === "") {
      setSnackbar({
        open: true,
        text: "Leave type is required.",
        type: "error",
      });
      return;
    }
    setOpenOverlayLoading(true);
    try {
      await LeaveTypeAPI.update(id, { leave_type: formData.leave_type });
      const res2 = await LeaveTypeAPI.getById(id);
      setSnackbar({
        open: true,
        text: "Leave type updated successfully.",
        type: "success",
      });
      await mutate();
      onUpdateSuccess(res2.data);
      onClose();
    } catch (error: any) {
      setSnackbar({
        open: true,
        text: error?.response?.data?.message || "Failed to update leave type.",
        type: "error",
      });
    } finally {
      setOpenOverlayLoading(false);
    }
  };

  return (
    <FormDialog
      title="Update Leave Type"
      onSubmit={handleSubmit(onSubmit)}
      handleOnClose={onClose}
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
      formType="update"
      open={open}
      openLoading={isLoadingLeaveType}
    >
      <Stack spacing={1}>
        <FormControl error={!!errors["leave_type"]}>
          <FormLabel>Type of Leave</FormLabel>
          <Controller
            control={control}
            name="leave_type"
            rules={{ required: true }}
            render={({ field }) => (
              <OutlinedInput
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors["leave_type"]}
              />
            )}
          />
        </FormControl>
      </Stack>
    </FormDialog>
  );
};

export default UpdateLeaveType;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { FormControl, OutlinedInput, Stack } from "@mui/material";
// import { UpdateLeaveTypeAPIReq } from "api/LeaveType";
// import { FormDialog, FormLabel, SnackbarDataType } from "components";
// import React, { useEffect, useState } from "react";
// import { Controller, SubmitHandler, useForm } from "react-hook-form";

// interface IFormInput {
//   leave_type: string;
// }

// interface UpdateLeaveTypeProps {
//   id: number | null | undefined;
//   open: boolean;
//   onClose: () => void;
//   onUpdateSuccess: (
//     updated: UpdateLeaveTypeAPIReq & { id: number }
//   ) => Promise<void>;
//   currentValue: { name: string } | null;
// }

// const UpdateLeaveType = ({
//   id,
//   open,
//   onClose,
//   onUpdateSuccess,
//   currentValue,
// }: UpdateLeaveTypeProps) => {
//   const [openOverlayLoading, setOpenOverlayLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

//   const {
//     reset,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>({
//     defaultValues: { leave_type: "" },
//   });

//   // Set form value from currentValue prop
//   useEffect(() => {
//     if (open && currentValue) {
//       reset({ leave_type: currentValue.name || "" });
//     } else if (!open) {
//       reset({ leave_type: "" });
//     }
//   }, [open, currentValue, reset]);

//   const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
//     if (!id) return;

//     setOpenOverlayLoading(true);
//     try {
//       // Call the parent's success handler directly
//       await onUpdateSuccess({
//         id,
//         leave_type: formData.leave_type,
//       });

//       reset();
//       onClose();
//     } catch (error) {
//       console.error("Update failed:", error);
//       setSnackbar({
//         open: true,
//         text: "Failed to update leave type.",
//         type: "error",
//       });
//     } finally {
//       setOpenOverlayLoading(false);
//     }
//   };

//   return (
//     <FormDialog
//       openOverlayLoading={openOverlayLoading}
//       snackbar={snackbar}
//       handleOnCloseSnackbar={() => setSnackbar({ open: false })}
//       open={open}
//       handleOnClose={onClose} // Use handleOnClose instead of onClose
//       onSubmit={handleSubmit(onSubmit)}
//       title="Update Leave Type"
//     >
//       <Stack spacing={2}>
//         <FormControl>
//           <FormLabel>Type of Leave</FormLabel>
//           <Controller
//             name="leave_type"
//             control={control}
//             rules={{ required: "Leave type is required" }}
//             render={({ field }) => (
//               <OutlinedInput
//                 {...field}
//                 onChange={(e) => field.onChange(e.target.value)}
//                 error={!!errors["leave_type"]}
//                 size="small"
//                 fullWidth
//               />
//             )}
//           />
//         </FormControl>
//       </Stack>
//     </FormDialog>
//   );
// };

// export default UpdateLeaveType;
