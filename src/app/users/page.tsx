"use client";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  TableCell,
  TableRow,
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
import { UserAPI, UserDetailAPIRes, UserListAPIRes } from "api/User";
import { getTableRowNo, paginateArr } from "utils";
import PageWrapper from "components/Page/PageWrapper";
import { ThreeDotOptions } from "data";
import SearchIcon from "@mui/icons-material/Search";
import CreateUser from "./components/CreateUser";
import { errorHandler } from "utils/ErrorHandler";
import UpdateUser from "./components/UpdateUser";
import ResetPassword from "./components/ResetPassword";
import Image from "next/image";
import dayjs from "dayjs";
import UserDetail from "./components/UserDetail";

const tableHeaderData: TableHeaderDataType[] = [
  {
    text: "No.",
    style: {
      textAlign: "right",
      width: 45,
    },
  },
  {
    text: "Name",
    style: {
      width: "15%",
    },
  },
  {
    text: "User Name",
    style: {
      width: "15%",
    },
  },
  {
    text: "User Role",
    style: {
      width: "15%",
    },
  },
  {
    text: "Position",
    style: {
      width: "15%",
    },
  },
  {
    text: "Phone",
    style: {
      width: "15%",
    },
  },
  {
    text: "DOB",
    style: {
      width: "15%",
    },
  },
  {
    text: "Start Join Date",
    style: {
      width: "15%",
    },
  },
  {
    text: "Status",
    style: {
      width: "10%",
    },
  },
  {
    text: "Action",
    style: {
      width: "10%",
    },
  },
];

const UserList = () => {
  const [createForm, setCreateForm] = useState<{
    open: boolean;
  }>({
    open: false,
  });
  const [updateForm, setUpdateForm] = useState<{
    open: boolean;
    id?: number | null;
  }>({ open: false });
  const [userDetailForm, setUserDetailForm] = useState<{
    open: boolean;
    id?: number | null;
  }>({ open: false });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [resetPasswordForm, setResetPasswordForm] = useState<{
    open: boolean;
    id?: number | null;
  }>({ open: false });
  const [openOverlayLoading, setOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({
    open: false,
  });
  const {
    data: Users,
    isLoading: gettingUsers,
    mutate,
  } = useSWR("/api/users", () => {
    return new Promise<UserListAPIRes[]>(async (resolve, reject) => {
      try {
        const response = await UserAPI.getList();
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    });
  });

  const filteredData = useMemo(() => {
    if (!Users) return [];
    const keyword = search.toLowerCase();
    return Users.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword)
    );
  }, [Users, search]);

  const handleOnClickMenuItem = async (
    key: string,
    id: number,
    isActive: boolean
  ) => {
    if (key === "edit") {
      setUpdateForm({ open: true, id });
    } else if (key === "activation") {
      try {
        setOverlayLoading(true);
        const response = await UserAPI.toggleStatus(id, !isActive);
        await mutate(
          (data) =>
            data?.map((u) =>
              u.id === id ? { ...u, is_active: !u.is_active } : u
            ),
          { revalidate: false }
        );
        setSnackbar({
          open: true,
          text: response.data.message,
          type: "success",
        });
      } catch (error) {
        errorHandler(error);
      } finally {
        setOverlayLoading(false);
      }
    } else if (key === "reset-password") {
      setResetPasswordForm({ open: true, id });
    } else if (key === "view") {
      setUserDetailForm({ open: true, id });
    }
  };

  const handleOnCreateSuccess = async (newUser: UserDetailAPIRes) => {
    setOverlayLoading(true);
    try {
      await mutate((data) => (data ? [...data, newUser] : [newUser]), {
        revalidate: false,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setOverlayLoading(false);
    }
  };
  const handleOnUpdateSuccess = async (updatedUser: UserDetailAPIRes) => {
    try {
      await mutate(
        (data) => data?.map((d) => (d.id == updatedUser.id ? updatedUser : d)),
        { revalidate: false }
      );
    } catch (error) {
      errorHandler(error);
    }
  };
  const paginatedData: UserListAPIRes[] = useMemo(
    () => paginateArr({ data: filteredData || [], pageNo: page }),
    [filteredData, page]
  );

  const showTableLoading = gettingUsers;
  return (
    <PageWrapper
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      <PageHeading title="User"></PageHeading>
      <PageContentWrapper>
        <PageContentHeaderBar>
          <PageContentHeaderText>User Listing</PageContentHeaderText>
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
          totalLength={filteredData?.length}
          openLoading={showTableLoading}
          page={page}
          onChangePage={(newPage) => setPage(newPage)}
          scrollHeight="60vh"
        >
          {paginatedData.map((rowData, index) => (
            <TableRow key={rowData.id}>
              <TableCell align="right">{getTableRowNo(page, index)}</TableCell>
              <TableCell>{rowData.name}</TableCell>
              <TableCell>{rowData.username}</TableCell>
              <TableCell>{rowData.user_role}</TableCell>
              <TableCell>{rowData.position?.name}</TableCell>
              <TableCell>{rowData.phone}</TableCell>
              <TableCell>{dayjs(rowData.dob).format("DD/MM/YYYY")}</TableCell>
              <TableCell>
                {dayjs(rowData.start_join_date).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell align="center">
                {rowData.is_active ? (
                  <Image
                    src="/icons/active.png"
                    alt="active"
                    width={16}
                    height={16}
                  />
                ) : (
                  <Image
                    src="/icons/inactive.png"
                    alt="inActive"
                    width={16}
                    height={16}
                  />
                )}
              </TableCell>
              <TableCell>
                <ThreeDotMenu
                  options={ThreeDotOptions(rowData.is_active)}
                  onClickMenuItem={(key) =>
                    handleOnClickMenuItem(key, rowData.id, rowData.is_active)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </PageContentWrapper>
      <CreateUser
        open={createForm.open}
        onClose={() => setCreateForm({ open: false })}
        onCreateSuccess={handleOnCreateSuccess}
      />
      <UpdateUser
        id={updateForm.id}
        open={updateForm.open}
        onClose={() => setUpdateForm({ open: false })}
        onUpdateSuccess={handleOnUpdateSuccess}
      />
      <ResetPassword
        id={resetPasswordForm.id}
        open={resetPasswordForm.open}
        onClose={() => setResetPasswordForm({ open: false })}
        onUpdateSuccess={handleOnUpdateSuccess}
      />
      <UserDetail
        id={userDetailForm.id}
        open={userDetailForm.open}
        onClose={() => setUserDetailForm({ open: false })}
      />
    </PageWrapper>
  );
};

export default UserList;
