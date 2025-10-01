"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  Typography,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  OutlinedInput,
  Paper,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PageWrapper from "components/Page/PageWrapper";
import { PageContentWrapper, PageHeading, SnackbarDataType } from "components";
import { useState, useEffect, useMemo } from "react";
import FilterDialog from "./components/DateRangePicker";
import useSWR from "swr";
import { AttendanceAPI, EmployeeAttendanceListAPIRes } from "api";
import dayjs from "dayjs";
import { calDiffTime, formatTime, calcLateTime, formatLateTime } from "utils";
import Image from "next/image";
import ExportButton from "./components/ExportButton";

export default function StickyTwoColumnsTable() {
  const today = dayjs().format("YYYY-MM-DD");

  const [openOverlayLoading, setOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<{
    start_date: string | null;
    end_date: string | null;
  }>({
    start_date: today,
    end_date: today,
  });

  const handleApplyFilter = (filters: {
    selectedDate: { start_date: string | null; end_date: string | null };
  }) => {
    setSelectedDate(filters.selectedDate);
  };

  const queryParams = new URLSearchParams();
  if (selectedDate.start_date)
    queryParams.append("start_date", selectedDate.start_date);
  if (selectedDate.end_date)
    queryParams.append("end_date", selectedDate.end_date);

  const { data: attendances, isLoading } = useSWR<
    EmployeeAttendanceListAPIRes[]
  >(`/api/employee-attendances/${queryParams}`, async () => {
    const response = await AttendanceAPI.getEmployeeAttendances({
      start_date: selectedDate.start_date,
      end_date: selectedDate.end_date,
    });
    return response.data;
  });

  const filteredAttendances = useMemo(() => {
    if (!attendances) return [];
    if (!search) return attendances;
    return attendances.filter((e) =>
      e.employee.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendances, search]);

  useEffect(() => {
    setOverlayLoading(isLoading);
  }, [isLoading]);

  return (
    <PageWrapper
    openOverlayLoading={isLoading || openOverlayLoading}
    snackbar={snackbar}
    handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      
      <PageHeading title="Employee Attendances" />
      <PageContentWrapper>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 1.5,
            flexDirection: { xs: "column", md: "row" },
            position: "sticky",
            top: 0,
            // zIndex: 10,
            backgroundColor: "#fff",
            // overflow: "visible",
            // pb:1
          }}
        >
          <Box sx={{ width: 250 }}>
            <FilterDialog
              selectedDate={selectedDate}
              onApplyFilter={handleApplyFilter}
            />
          </Box>
          <Box
            sx={{
              width: 250,
              mt: { sm: 0, md: 2 },
              marginLeft: { sm: 0, md: 2 },
            }}
          >
            <OutlinedInput
              fullWidth
              placeholder="Search by employee name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ width: 18 }} />
                </InputAdornment>
              }
              size="medium"
              sx={{
                height: 36,
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "8px",
                },
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>
          <Box sx={{
            ml: {xs: 0, sm: "auto"},
            mr: {xs: "auto", sm: 0},
            mt: {sm: 0, md: 2}
          }}>
            <ExportButton
              filteredAttendances={filteredAttendances}
              selectedDateRange={selectedDate}
              calDiffTime={calDiffTime}
              formatTime={formatTime}
              calcLateTime={calcLateTime}
              formatLateTime={formatLateTime}
            />
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: "60vh", sm: "65vh", md: "65vh", lg: "70vh" },
            overflowX: "auto",
            width: "100%",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 700, textAlign: "center" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    fontWeight: "bold",
                    zIndex: 100,
                    width: 50,
                    maxWidth: 70,
                    minWidth: 50,
                    border: "1px solid #ddd",
                    verticalAlign: "middle",
                    textAlign: "center",
                    color: "primary.main",
                  }}
                >
                  No.
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    verticalAlign: "middle",
                    color: "primary.main",
                    textAlign: "center",
                    position: "sticky",
                    left: 35,
                    background: "#fff",
                    zIndex: 100,
                    fontWeight: "bold",
                    width: 180,
                    maxWidth: 200,
                    minWidth: 180,
                    border: "1px solid #ddd",
                  }}
                >
                  Employee Name
                </TableCell>
                {attendances?.[0]?.attendance_list
                  .filter((att: any) =>
                    dayjs(att.date).isSame(dayjs(), "month")
                  )
                  .map((att: any) => (
                    <TableCell
                      key={att.date}
                      align="center"
                      sx={{
                        minWidth: 120,
                        border: "1px solid #ddd",
                        color: "primary.main",
                        fontWeight: "bold",

                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                      colSpan={3}
                    >
                      {dayjs(att.date).format("MMM DD (ddd)")}
                    </TableCell>
                  ))}
              </TableRow>

              <TableRow>
                {filteredAttendances?.[0]?.attendance_list.map((att) => (
                  <React.Fragment key={att.date}>
                    <TableCell
                      align="center"
                      sx={{
                        border: "1px solid #ddd",
                        verticalAlign: "middle",
                        textAlign: "center",
                        color: "primary.main",
                        width: 120,
                        minWidth: 100,
                        maxWidth: 150,
                        fontWeight: "bold",
                      }}
                    >
                      Scan Time
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: "1px solid #ddd",
                        verticalAlign: "middle",
                        textAlign: "center",
                        color: "primary.main",
                        width: 100,
                        minWidth: 80,
                        maxWidth: 150,
                        fontWeight: "bold",
                      }}
                    >
                      Hour
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: "1px solid #ddd",
                        verticalAlign: "middle",
                        color: "primary.main",
                        textAlign: "center",
                        width: 160,
                        fontWeight: "bold",
                        minWidth: 150,
                        maxWidth: 200,
                      }}
                    >
                      Remark
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAttendances?.map((e) => (
                <TableRow key={e.employee.id}>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      background: "#fff",
                      zIndex: 1,
                      border: "1px solid #ddd",
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    {e.employee.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 35,
                      background: "#fff",
                      verticalAlign: "middle",
                      textAlign: "start",
                      zIndex: 1,
                      border: "1px solid #ddd",
                    }}
                  >
                    {e.employee.name}
                  </TableCell>

                  {/* 3 sub-columns */}
                  {e.attendance_list.map((att) => (
                    <React.Fragment key={att.date}>
                      {att.times.length === 0 ? (
                        <TableCell
                          sx={{
                            border: "1px solid #ddd",
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                          colSpan={3}
                        >
                          <Image
                            alt="absent"
                            src="/icons/absent.png"
                            width={28}
                            height={28}
                          />
                        </TableCell>
                      ) : (
                        <>
                          <TableCell
                            sx={{
                              border: "1px solid #ddd",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            <Typography>{formatTime(att.times[0])},</Typography>
                            {att.times[1] && (
                              <Typography>
                                {formatTime(att.times[1])}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ddd",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            {att.times.length > 0 && (
                              <Typography>
                                {calDiffTime({
                                  startTime: att.times[0],
                                  endTime: att.times[att.times.length - 1],
                                })}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ddd",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            {att.times[0] && (
                              <Typography sx={{ color: "red" }}>
                                {calcLateTime({
                                  startTime: "09:15",
                                  scanTime: formatLateTime(att.times[0]),
                                })}
                              </Typography>
                            )}
                          </TableCell>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContentWrapper>
    </PageWrapper>
  );
}



