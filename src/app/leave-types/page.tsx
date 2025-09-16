/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  TableCell,
  TableRow,
  Box,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import {
  AddButton,
  PageContentHeaderBar,
  PageContentHeaderText,
  PageContentWrapper,
  PageHeading,
  SnackbarDataType,
  Table,
  TableHeaderDataType,
  ThreeDotMenu,
} from "components";
import {
  LeaveTypeAPI,
  LeaveTypeListAPIRes,
  CreateLeaveTypeAPIReq,
  UpdateLeaveTypeAPIReq,
} from "api/LeaveType";
import { getTableRowNo, paginateArr } from "utils";
import PageWrapper from "components/Page/PageWrapper";
import { ThreeDotMenuOptionType } from "components";
import SearchIcon from "@mui/icons-material/Search";
import CreateLeaveType from "./components/CreateLeaveType";
import UpdateLeaveType from "./components/UpdateLeaveType";
import { errorHandler } from "utils/ErrorHandler";
import { DeleteConfirmation } from "components/Confirmation";

const LeaveTypeThreeDotOptions = (): ThreeDotMenuOptionType[] => [
  {
    key: "edit",
    label: "Edit",
    iconSrc: "/icons/edit.png",
  },
  {
    key: "activation",
    label: "Delete",
    iconSrc: "/icons/delete.png",
  },
];

const tableHeaderData: TableHeaderDataType[] = [
  {
    text: "No.",
    style: { textAlign: "right", width: "5%" },
  },
  {
    text: "Types of Leave",
    style: { width: "90%" },
  },
  {
    text: "Action",
    style: { width: "30%" },
  },
];

const LeaveTypeList = () => {
  const [createForm, setCreateForm] = useState<{ open: boolean }>({
    open: false,
  });
  const [updateForm, setUpdateForm] = useState<{
    open: boolean;
    id?: number | null;
  }>({ open: false });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openOverlayLoading, setOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: number | null;
  }>({
    open: false,
  });

  const {
    data: leaveTypes,
    isLoading: gettingLeaveTypes,
    mutate,
  } = useSWR("/api/leave-types", async () => {
    const response = await LeaveTypeAPI.getList();
    return response.data as LeaveTypeListAPIRes;
  });

  const tableData = useMemo(() => {
    if (!leaveTypes) return [];
    const keyword = search.toLowerCase();
    return leaveTypes.filter(
      (leaveType) =>
        leaveType &&
        typeof leaveType.leave_type === "string" &&
        leaveType.leave_type.toLowerCase().includes(keyword)
    );
  }, [leaveTypes, search]);

  const paginatedData = useMemo(
    () => paginateArr({ data: tableData || [], pageNo: page }),
    [tableData, page]
  );

  const handleOnClickMenuItem = async (key: string, id: number) => {
    if (key === "edit") {
      setUpdateForm({ open: true, id });
    }
    if (key === "activation") {
      setDeleteDialog({ open: true, id });
      // setOverlayLoading(true);
      // const previous = leaveTypes;
      // await mutate((data) => data?.filter((d) => d.id !== id), {
      //   revalidate: false,
      // });
      // try {
      //   await LeaveTypeAPI.deleteById(id);
      //   setSnackbar({
      //     open: true,
      //     text: "Deleted successfully.",
      //     type: "success",
      //   });
      // } catch (error) {
      //   await mutate(previous, { revalidate: false });
      //   setSnackbar({
      //     open: true,
      //     text: "Delete failed.",
      //     type: "error",
      //   });
      // } finally {
      //   setOverlayLoading(false);
      // }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    setOverlayLoading(true);
    const previous = leaveTypes;
    setDeleteDialog({ open: false, id: null });
    await mutate((data) => data?.filter((d) => d.id !== deleteDialog.id), {
      revalidate: false,
    });
    try {
      await LeaveTypeAPI.deleteById(deleteDialog.id);
      setSnackbar({
        open: true,
        text: "Deleted successfully.",
        type: "success",
      });
    } catch (error) {
      await mutate(previous, { revalidate: false });
      setSnackbar({
        open: true,
        text: "Delete failed.",
        type: "error",
      });
    } finally {
      setOverlayLoading(false);
    }
  };

  const handleOnCreateSuccess = async (created: LeaveType) => {
    setOverlayLoading(true);
    try {
      await mutate((data) => (data ? [...data, created] : [created]), {
        revalidate: false,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setOverlayLoading(false);
    }
  };

  const handleOnUpdateSuccess = async (updated: LeaveType) => {
    setOverlayLoading(true);
    try {
      await mutate(
        (data) => data?.map((d) => (d.id === updated.id ? updated : d)),
        { revalidate: false }
      );
      setUpdateForm({ open: false, id: null });
    } catch (error) {
      errorHandler(error);
    } finally {
      setOverlayLoading(false);
    }
  };

  return (
    <PageWrapper
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      <PageHeading title="Leave Types" />
      <Box>
        <PageContentWrapper>
          <PageContentHeaderBar>
            <PageContentHeaderText>Leave Types Listing</PageContentHeaderText>
            <AddButton onClick={() => setCreateForm({ open: true })} />
          </PageContentHeaderBar>
          <Box sx={{ width: "250px", mb: 2 }}>
            <OutlinedInput
              fullWidth
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </Box>
          <Table
            headerData={tableHeaderData}
            totalLength={tableData?.length}
            openLoading={gettingLeaveTypes}
            page={page}
            onChangePage={(newPage: number) => setPage(newPage)}
            scrollHeight="60vh"
          >
            {paginatedData.map((rowData, index) => (
              <TableRow key={rowData.id}>
                <TableCell align="right" sx={{ py: 1 }}>
                  {getTableRowNo(page, index)}
                </TableCell>
                <TableCell sx={{ py: 1 }}>{rowData.leave_type}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <ThreeDotMenu
                    options={LeaveTypeThreeDotOptions()}
                    onClickMenuItem={(key) =>
                      handleOnClickMenuItem(key, rowData.id)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </PageContentWrapper>
      </Box>

      <CreateLeaveType
        open={createForm.open}
        onClose={() => setCreateForm({ open: false })}
        onCreateSuccess={handleOnCreateSuccess}
      />

      <UpdateLeaveType
        id={updateForm.id}
        open={updateForm.open}
        onClose={() => setUpdateForm({ open: false })}
        onUpdateSuccess={(updated) => {
          handleOnUpdateSuccess(updated);
          mutate();
        }}
      />

      {deleteDialog.open && (
        <DeleteConfirmation
          text="Are you sure you want to delete this leave type?"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteDialog({ open: false, id: null })}
        />
      )}
    </PageWrapper>
  );
};

export default LeaveTypeList;
