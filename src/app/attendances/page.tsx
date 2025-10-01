"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Box, IconButton, Typography, Grid } from "@mui/material";
import useSWR from "swr";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { PageContentWrapper, PageHeading, SnackbarDataType } from "components";
import PageWrapper from "components/Page/PageWrapper";
import FilterDialog from "./components/DateRangePicker";
import { AttendanceAPI, UserAttListAPIRes } from "api";
import { calDiffTime, formatTime, paginateArr } from "utils";
import { useSession } from "next-auth/react";


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce((acc: Record<string, T[]>, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

type Filters = {
  startDate: { from: string | null; to: string | null };
};

const AttendanceList = () => {
  const session = useSession();
  const userId = session.data?.user.id;

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    startDate: { from: null, to: null },
  });
  const [openOverlayLoading, setOverlayLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

  const { data: attendances, isLoading: gettingAttendances } = useSWR<
    UserAttListAPIRes[]
  >("/api/users/{id}/attendances", async () => {
    if (!userId) return [];
    const response = await AttendanceAPI.getAttListByUserId(userId);
    return response.data;
  });

  useEffect(() => {
    setOverlayLoading(gettingAttendances);
  }, [gettingAttendances]);

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    setFilters({ startDate: { from: today, to: today } });
  }, []);

  const filteredData = useMemo(() => {
    if (!attendances) return [];

    return attendances.filter((attendance) => {
      const date = dayjs(attendance.date).startOf("day");

      const startFrom = filters.startDate.from
        ? dayjs(filters.startDate.from).startOf("day")
        : null;
      const startTo = filters.startDate.to
        ? dayjs(filters.startDate.to).startOf("day")
        : null;

      if (startFrom && date.isBefore(startFrom)) return false;
      if (startTo && date.isAfter(startTo)) return false;

      return true;
    });
  }, [attendances, filters]);

  const paginatedData = useMemo(
    () => paginateArr({ data: filteredData, pageNo: page }),
    [filteredData, page]
  );

  const groupedData = useMemo(() => {
    if (!paginatedData || paginatedData.length === 0) return [];
    const grouped = groupBy(paginatedData, "date");
    return Object.entries(grouped).map(([date, records]) => ({
      date,
      times: records.map((r) => r.time),
    }));
  }, [paginatedData]);

  const hasData = groupedData.some((g) => g.times.length > 0);

  // Handle filter changes
  const handleApplyFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <PageWrapper
      openOverlayLoading={openOverlayLoading}
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      <PageHeading title="Attendances" />
      <PageContentWrapper>
        <FilterDialog onApplyFilter={handleApplyFilter} />

        {!hasData ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="text.secondary">
              No Data for this selected date.
            </Typography>
          </Box>
        ) : (
          groupedData.map((data, index) => (
            <Box
              key={`${data.date}-${index}`}
              maxWidth="sm"
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                mt: 2,
                boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              <Box sx={{ backgroundColor: "#F3F8FC", borderRadius: 3 }}>
                {/* Date box  */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton sx={{ ml: "10px", mt: "15px" }}>
                    <Image
                      src="/icons/attendanceList/date.png"
                      alt="date"
                      // style={{ width: 24, height: 24 }}
                      width={24}
                      height={24}
                    />
                  </IconButton>
                  <Typography sx={{ mt: 0.7 }}>{data.date}</Typography>
                </Box>

                {/* Grid Two Box  */}
                <Grid
                  container
                  spacing="12px"
                  sx={{ mt: "12px", px: "15px", pb: "16px" }}
                >
                  <Grid
                    size={6}
                    sx={{
                      backgroundColor: "#F8F9FA",
                      borderRadius: 1,
                      pb: 3,
                      boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        textAlign: "start",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          pl: "6px",
                          mt: "10px",
                        }}
                      >
                        <Image
                          src="/icons/attendanceList/total_working_hour.png"
                          alt="working hour"
                          width={24}
                          height={24}
                          // style={{ width: 24, height: 24 }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          pt: "10px",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.8rem", mb: 1 }}>
                          Total Working Hour
                        </Typography>
                        {data.times.length > 0 && (
                          <Typography>
                            {calDiffTime({
                              startTime: data.times[0],
                              endTime: data.times[data.times.length - 1],
                            })}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid
                    size={6}
                    sx={{
                      backgroundColor: "#F8F9FA",
                      borderRadius: 1,
                      pb: 3,
                      boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          ml: "6px",
                          mt: "10px",
                        }}
                      >
                        <Image
                          src="/icons/attendanceList/scan_time.png"
                          alt="scan_time"
                          width={24}
                          height={24}
                          // style={{ width: 24, height: 24 }}
                        />
                      </Box>
                      <Box
                        sx={{ display: "flex", flexDirection: "column", ml: 1 }}
                      >
                        <Typography
                          sx={{ fontSize: "0.8rem", mb: 1, mt: "10px" }}
                        >
                          Scan Time
                        </Typography>
                        {data.times.map((time, idx) => (
                          <Typography key={`${time}-${idx}`} sx={{ mb: "4px" }}>
                            {formatTime(time)}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))
        )}
      </PageContentWrapper>
    </PageWrapper>
  );
};

export default AttendanceList;
