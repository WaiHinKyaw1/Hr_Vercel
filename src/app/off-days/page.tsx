"use client";

import {
  TableCell,
  TableRow,
  Box,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import {
  AddButton,
  //   PageContentHeaderBar,
  //   PageContentHeaderText,
  PageContentWrapper,
  PageHeading,
  SnackbarDataType,
  Table,
  TableHeaderDataType,
  ThreeDotMenu,
} from "components";
import { getTableRowNo } from "utils";
import PageWrapper from "components/Page/PageWrapper";
import { ThreeDotMenuOptionType } from "components";
import SearchIcon from "@mui/icons-material/Search";
import CreateOffDay from "./components/CreateOffDay";
import UpdateOffDay from "./components/UpdateOffDay";
import dayjs from "dayjs";

// Dynamic OffDayThreeDotOptions function
const OffDayThreeDotOptions = (): ThreeDotMenuOptionType[] => [
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
    text: "Description",
    style: { width: "20%" },
  },
  {
    text: "Type",
    style: { width: "18%" },
  },
  {
    text: "Start Date",
    style: { width: "23%" },
  },
  {
    text: "End Date",
    style: { width: "24%" },
  },
  {
    text: "Action",
    style: { width: "20%" },
  },
];

const initialOffDays = [
  {
    id: 1,
    description: "Thadingyut Festival",
    type: "Holiday",
    startDate: "2025-10-10",
    endDate: "2025-10-12",
  },
  {
    id: 2,
    description: "Every Saturday",
    type: "Off Day",
    startDate: "",
    endDate: "",
  },
];

const OffDayList = () => {
  const [offDays, setOffDays] = useState(initialOffDays);

  const [createForm, setCreateForm] = useState<{ open: boolean }>({
    open: false,
  });
  const [updateForm, setUpdateForm] = useState<{
    open: boolean;
    id?: number | null;
  }>({ open: false });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

  const keyword = search.toLowerCase();
  const filteredData = offDays.filter(
    (offDay) =>
      offDay.description.toLowerCase().includes(keyword) ||
      offDay.type.toLowerCase().includes(keyword)
  );
  const paginatedData = filteredData.slice((page - 1) * 10, page * 10);

  const handleOnClickMenuItem = (key: string, id: number) => {
    if (key === "edit") {
      setUpdateForm({ open: true, id });
    }
  };

  const handleOnCreateSuccess = (newOffDay: any) => {
    setOffDays((prev) => [
      ...prev,
      {
        ...newOffDay,
        id: prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1,
      },
    ]);
    setSnackbar({ open: true, text: "Created successfully.", type: "success" });
  };

  const handleOnUpdateSuccess = (updated: any) => {
    setOffDays((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
    );
    setUpdateForm({ open: false, id: null });
  };

  const currentValue =
    updateForm.id != null
      ? offDays.find((d) => d.id === updateForm.id) || null
      : null;

  return (
    <PageWrapper
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      <PageHeading title="Holiday & OFF day Setup" />
      <Box>
        <PageContentWrapper>
          <Box
            sx={{
              width: "100%",
              mt: 5,
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
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
              sx={{ maxWidth: { lg: 250, md: 250, sm: 250, xs: 190 } }}
            />
            <Box sx={{ flex: 1 }} />
            <AddButton onClick={() => setCreateForm({ open: true })} />
          </Box>
          <Table
            headerData={tableHeaderData}
            page={page}
            onChangePage={(newPage: number) => setPage(newPage)}
            scrollHeight="60vh"
          >
            {paginatedData.map((rowData, index) => (
              <TableRow key={rowData.id}>
                <TableCell align="right" sx={{ py: 1 }}>
                  {getTableRowNo(page, index)}
                </TableCell>
                <TableCell sx={{ py: 1 }}>{rowData.description}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  {rowData.type
                    ? typeof rowData.type === "object" &&
                      "label" in rowData.type
                      ? (rowData.type as { label: string }).label
                      : rowData.type
                    : "-"}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {rowData.startDate
                    ? rowData.startDate === "-"
                      ? "-"
                      : dayjs(rowData.startDate).format("DD.MM.YYYY")
                    : "-"}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {rowData.endDate
                    ? rowData.endDate === "-"
                      ? "-"
                      : dayjs(rowData.endDate).format("DD.MM.YYYY")
                    : "-"}
                </TableCell>
                {/* <TableCell sx={{ py: 1 }}>
                  {rowData.startDate
                    ? dayjs(rowData.startDate).format("DD.MM.YYYY")
                    : ""}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {rowData.endDate
                    ? dayjs(rowData.endDate).format("DD.MM.YYYY")
                    : ""}
                </TableCell> */}
                <TableCell sx={{ py: 1 }}>
                  <ThreeDotMenu
                    options={OffDayThreeDotOptions()}
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

      <CreateOffDay
        open={createForm.open}
        onClose={() => setCreateForm({ open: false })}
        onCreateSuccess={handleOnCreateSuccess}
      />

      <UpdateOffDay
        id={updateForm.id}
        open={updateForm.open}
        onClose={() => setUpdateForm({ open: false })}
        onUpdateSuccess={handleOnUpdateSuccess}
        currentValue={currentValue}
      />
    </PageWrapper>
  );
};

export default OffDayList;
