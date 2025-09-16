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
import { PositionAPI, PositionDetailsAPIRes, PositionListAPIRes } from "api";
import { getTableRowNo, paginateArr } from "utils";
import PageWrapper from "components/Page/PageWrapper";
import { ThreeDotMenuOptionType } from "components";
import SearchIcon from "@mui/icons-material/Search";
import CreatePosition from "./components/CreatePosition";
import UpdatePosition from "./components/UpdatePosition";
import { errorHandler } from "utils/ErrorHandler";
import Image from "next/image";

// Dynamic PositionThreeDotOptions function - exactly like User
const PositionThreeDotOptions = (
  isActive: boolean
): ThreeDotMenuOptionType[] => [
  {
    key: "edit",
    label: "Edit",
    iconSrc: "/icons/edit.png",
  },
  {
    key: "activation",
    label: isActive ? "Inactive" : "Active",
    iconSrc: isActive ? "/icons/inactive.png" : "/icons/active.png",
  },
];

const tableHeaderData: TableHeaderDataType[] = [
  {
    text: "No.",
    style: {
      textAlign: "right",
      width: 45,
    },
  },
  {
    text: "Position",
    style: {
      width: "60%",
    },
  },
  {
    text: "Status",
    style: {
      width: "30%",
    },
  },
  {
    text: "Action",
    style: {
      width: "10%",
    },
  },
];

const PositionList = () => {
  const [createForm, setCreateForm] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const [updateForm, setUpdateForm] = useState<{
    open: boolean;
    id?: number | null;
  }>({ open: false });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openOverlayLoading, setOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({
    open: false,
  });

  const {
    data: positions,
    isLoading: gettingPositions,
    mutate,
  } = useSWR("/api/positions", () => {
    return new Promise<PositionListAPIRes[]>(async (resolve, reject) => {
      try {
        const response = await PositionAPI.getList();
        return resolve(response.data);
      } catch (error) {
        return reject(error);
      }
    });
  });

  const tableData = useMemo(() => {
    if (!positions) return [];
    const keyword = search.toLowerCase();
    return positions.filter((position) =>
      position.name.toLowerCase().includes(keyword)
    );
  }, [positions, search]);

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
        const response = await PositionAPI.toggleStatus(id, !isActive);
        await mutate(
          (data) =>
            data?.map((p) =>
              p.id === id ? { ...p, is_active: !p.is_active } : p
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
    }
  };

  const handleOnCreateSuccess = async (newPosition: PositionDetailsAPIRes) => {
    setOverlayLoading(true);
    try {
      await mutate((data) => (data ? [...data, newPosition] : [newPosition]), {
        revalidate: false,
      });
    } catch (error) {
      errorHandler(error);
    } finally {
      setOverlayLoading(false);
    }
  };

  const handleOnUpdateSuccess = async (
    updatedPosition: PositionDetailsAPIRes
  ) => {
    try {
      await mutate(
        (data) =>
          data?.map((d) => (d.id == updatedPosition.id ? updatedPosition : d)),
        { revalidate: false }
      );
    } catch (error) {
      errorHandler(error);
    }
  };

  const paginatedData: PositionListAPIRes[] = useMemo(
    () => paginateArr({ data: tableData || [], pageNo: page }),
    [tableData, page]
  );

  const showTableLoading = gettingPositions;

  return (
    <PageWrapper
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      <PageHeading title="Position"></PageHeading>
      <Box
      // sx={{
      //   minHeight: "100vh",
      //   display: "flex",
      //   flexDirection: "column",
      //   bgcolor: "primary.main",
      //   position: "fixed"
      // }}
      >
        {/* <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}> */}
        <PageContentWrapper>
          <PageContentHeaderBar>
            <PageContentHeaderText>Position Listing</PageContentHeaderText>
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
          {/* <Box sx={{height: "70vh", overflow: "auto", bgcolor: "secondary.main" }}> */}
            <Table
              headerData={tableHeaderData}
              totalLength={tableData?.length}
              openLoading={showTableLoading}
              page={page}
              onChangePage={(newPage: number) => setPage(newPage)}
              scrollHeight="60vh"
            >
              {paginatedData.map((rowData, index) => (
                <TableRow key={rowData.id}>
                  <TableCell align="right" sx={{py: 1}}>
                    {getTableRowNo(page, index)}
                  </TableCell>
                  <TableCell sx={{py: 1}}>{rowData.name}</TableCell>
                  <TableCell sx={{py: 1}}>
                    {rowData.is_active ? (
                      <Image
                        src="/icons/active.png"
                        alt="Active"
                        width={20}
                        height={20}
                      />
                    ) : (
                      <Image
                        src="/icons/inactive.png"
                        alt="Inactive"
                        width={20}
                        height={20}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{py: 1}}>
                    <ThreeDotMenu
                      options={PositionThreeDotOptions(rowData.is_active)}
                      onClickMenuItem={(key) =>
                        handleOnClickMenuItem(
                          key,
                          rowData.id,
                          rowData.is_active
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          {/* </Box> */}
        </PageContentWrapper>
      </Box>

      <CreatePosition
        open={createForm.open}
        onClose={() => setCreateForm({ open: false })}
        onCreateSuccess={handleOnCreateSuccess}
      />

      <UpdatePosition
        id={updateForm.id}
        open={updateForm.open}
        onClose={() => setUpdateForm({ open: false })}
        onUpdateSuccess={handleOnUpdateSuccess}
      />
    </PageWrapper>
  );
};

export default PositionList;
