"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import {
  AddButton,
  PageContentHeaderBar,
  PageContentHeaderText,
  PageContentWrapper,
  PageHeading,
  SnackbarDataType,
  TablePagination,
} from "components";
import PageWrapper from "components/Page/PageWrapper";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";

// Leave status type
type LeaveStatus = "All" | "Approved" | "Waiting" | "Rejected";

// Leave data type
interface LeaveData {
  id: number;
  startDate: string;
  endDate?: string;
  leaveType: string;
  reason: string;
  status: "Approved" | "Waiting" | "Rejected";
  duration: string;
  isFullDay: boolean;
}

// Dummy data
const initialLeaves: LeaveData[] = [
  { id: 1, startDate: "2025-09-11", endDate: "2025-09-11", leaveType: "Sick", reason: "Medical appointment", status: "Waiting", duration: "Full Day", isFullDay: true },
  { id: 2, startDate: "2025-09-10", endDate: "2025-09-10", leaveType: "Casual", reason: "Personal work", status: "Approved", duration: "Half Day (Morning)", isFullDay: false },
  { id: 3, startDate: "2025-09-08", endDate: "2025-09-10", leaveType: "Casual", reason: "Family function", status: "Rejected", duration: "3 Days", isFullDay: true },
  { id: 4, startDate: "2025-09-07", endDate: "2025-09-07", leaveType: "Sick", reason: "Doctor visit", status: "Approved", duration: "Half Day (Afternoon)", isFullDay: false },
  { id: 5, startDate: "2025-09-05", endDate: "2025-09-06", leaveType: "Annual", reason: "Vacation", status: "Approved", duration: "2 Days", isFullDay: true },
  { id: 6, startDate: "2025-09-04", endDate: "2025-09-04", leaveType: "Emergency", reason: "Family emergency", status: "Waiting", duration: "Full Day", isFullDay: true },
  { id: 7, startDate: "2025-09-03", endDate: "2025-09-03", leaveType: "Casual", reason: "Personal matters", status: "Rejected", duration: "Full Day", isFullDay: true },
  { id: 8, startDate: "2025-09-02", endDate: "2025-09-02", leaveType: "Sick", reason: "Flu", status: "Approved", duration: "Full Day", isFullDay: true },
  { id: 9, startDate: "2025-09-01", endDate: "2025-09-01", leaveType: "Casual", reason: "Personal work", status: "Waiting", duration: "Half Day (Morning)", isFullDay: false },
  { id: 10, startDate: "2025-08-31", endDate: "2025-08-31", leaveType: "Sick", reason: "Medical checkup", status: "Approved", duration: "Full Day", isFullDay: true },
  { id: 11, startDate: "2025-08-30", endDate: "2025-08-30", leaveType: "Annual", reason: "Weekend trip", status: "Approved", duration: "Full Day", isFullDay: true },
  { id: 12, startDate: "2025-08-29", endDate: "2025-08-29", leaveType: "Emergency", reason: "Family matter", status: "Rejected", duration: "Full Day", isFullDay: true },
];

const MyLeaves = () => {
  const router = useRouter();
  const [leaves] = useState<LeaveData[]>(initialLeaves);
  const [selectedTab, setSelectedTab] = useState<LeaveStatus>("All");
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({ open: false });

  // Filter by status
  const filteredData = leaves.filter((leave) =>
    selectedTab === "All" ? true : leave.status === selectedTab
  );

  // Paginate
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * 10;
    return filteredData.slice(startIndex, startIndex + 10);
  }, [filteredData, page]);

  // Group by date
  const groupedLeaves = paginatedData.reduce((groups, leave) => {
    const dateKey = new Date(leave.startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(leave);
    return groups;
  }, {} as Record<string, LeaveData[]>);

  const getStatusChipProps = (status: string) => {
    const map: Record<string, { label: string; sx: any }> = {
      Approved: { label: "Approved", sx: { backgroundColor: "#4CAF50", color: "white" } },
      Waiting: { label: "Waiting", sx: { backgroundColor: "#FFC107", color: "white" } },
      Rejected: { label: "Rejected", sx: { backgroundColor: "#F44336", color: "white" } },
    };
    return map[status] || { label: status, sx: { backgroundColor: "#9E9E9E", color: "white" } };
  };

  const formatCardDate = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const dayName = start.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = start.getDate();
    const monthName = start.toLocaleDateString("en-US", { month: "short" });

    if (endDate && endDate !== startDate) {
      const end = new Date(endDate);
      const endDay = end.getDate();
      const endMonth = end.toLocaleDateString("en-US", { month: "short" });
      return `${dayName}, ${dayNumber} ${monthName} - ${endDay} ${endMonth}`;
    }

    return `${dayName}, ${dayNumber} ${monthName}`;
  };

  return (
    <PageWrapper
      snackbar={snackbar}
      handleOnCloseSnackbar={() => setSnackbar({ open: false })}
    >
      <PageHeading title="Leave" />
      <PageContentWrapper>
        <Box sx={{ position: "relative", height: "calc(100vh - 140px)", overflow: "hidden" }}>
          {/* Header */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              zIndex: 100,
              px: 2,
              py: 1,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <PageContentHeaderBar>
              <PageContentHeaderText>Leave Listing</PageContentHeaderText>
              <AddButton onClick={() => router.push("/leave-requests/create")} />
            </PageContentHeaderBar>

            {/* Tabs */}
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {(["All", "Approved", "Waiting", "Rejected"] as LeaveStatus[]).map((status) => (
                <Box
                  key={status}
                  onClick={() => {
                    setSelectedTab(status);
                    setPage(1);
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor: selectedTab === status ? "#4CAF50" : "#E0E0E0",
                    color: selectedTab === status ? "white" : "#666",
                  }}
                >
                  {status}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Scrollable Cards */}
          <Box
            sx={{
              position: "absolute",
              top: "150px",
              bottom: filteredData.length > 10 ? "80px" : "20px",
              left: 0,
              right: 0,
              overflow: "auto",
              px: 3,
            }}
          >
            {Object.entries(groupedLeaves).map(([date, leavesInGroup]) => (
              <Box key={date} sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: "#666", fontWeight: 500 }}>
                  {date}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {leavesInGroup.map((leave) => {
                    const chipProps = getStatusChipProps(leave.status);
                    return (
                      <Card
                        key={leave.id}
                        sx={{ cursor: "pointer", borderRadius: 2, boxShadow: 2 }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: "#666" }}>
                                {leave.duration}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formatCardDate(leave.startDate, leave.endDate)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#8B5CF6", fontWeight: 500 }}>
                                {leave.leaveType}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                              <Chip {...chipProps} size="small" sx={{ mb: 1, ...chipProps.sx }} />
                              <IconButton size="small">
                                <ChevronRightIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            ))}

            {/* Empty state */}
            {Object.keys(groupedLeaves).length === 0 && (
              <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
                <Typography variant="h6">No leave requests found</Typography>
                <Typography variant="body2">Start by creating your first leave request</Typography>
              </Box>
            )}
          </Box>

          {/* Pagination */}
          {filteredData.length > 10 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                borderTop: "1px solid #e0e0e0",
                py: 1,
                px: 1,
              }}
            >
              <TablePagination
                totalLength={filteredData.length}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
              />
            </Box>
          )}
        </Box>
      </PageContentWrapper>
    </PageWrapper>
  );
};

export default MyLeaves;
