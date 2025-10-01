"use client";

import { useEffect, useState } from "react";
import { Button, Typography, Box, Divider } from "@mui/material";
import { AttendanceAPI, type AttendanceDetailsAPIRes } from "api";
import useSWR from "swr";
import {
  Loading,
  PageContentWrapper,
  PageHeading,
  PageWrapper,
  SnackbarDataType,
  SnackbarMessage,
} from "components";
import dayjs from "dayjs";
import { formatTime } from "utils";

export default function AttendancePage() {
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });
  const [status, setStatus] = useState({
    checkInDone: false,
    checkOutDone: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarDataType>({
    open: false,
  });

  const {
    data: todayAttendance,
    error,
    mutate,
    isLoading
  } = useSWR("/api/attendances/today", () => {
    return new Promise<AttendanceDetailsAPIRes[]>(async (resolve, reject) => {
      try {
        const response = await AttendanceAPI.getToday();
        resolve(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        reject(err);
      }
    });
  });

  useEffect(() => {
    if (Array.isArray(todayAttendance) && todayAttendance.length > 0) {
      const checkIn = todayAttendance.find((att) => att.type === "check_in");
      const checkOut = todayAttendance.find((att) => att.type === "check_out");

      setStatus({
        checkInDone: !!checkIn,
        checkOutDone: !!checkOut,
      });
    } else if (error) {
      setStatus({ checkInDone: false, checkOutDone: false });
    }
  }, [todayAttendance, error]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (error: GeolocationPositionError) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true, // GPS Accuracy
          timeout: 5000, // getting location timeout
          maximumAge: 0, // not use cache data
        }
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  }, []);
  const handleAttendance = async (type: "check_in" | "check_out") => {
    if (!location.lat || !location.lng) {
      return alert("Location not available");
    }
    setLoading(true);
    try {
      const res = await AttendanceAPI.create({
        type,
        latitude: location.lat,
        longitude: location.lng,
      });
      setSnackbar({
        open: true,
        text: (res.data as any)?.message,
        type: "success",
      });
      mutate();
    } catch (err: any) {
      setSnackbar({
        open: true,
        text: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const checkInTime = todayAttendance?.find((a) => a.type === "check_in")?.time;
  const checkOutTime = todayAttendance?.find(
    (a) => a.type === "check_out"
  )?.time;

  return (
    <PageWrapper>
      <PageHeading title="Attendance" />
      <PageContentWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            p: "5px",
            m: "5px",
          }}
        >
        
          <Box
            sx={{
              maxWidth: "400px",
              minHeight: "450px",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 0px 10px 0px #00000040",
              p: "5px",
            }}
          >
           {
            isLoading ? (
              <Loading open={true}/>
            ): (
              <>
               <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: "24px", mb: 1, mt: 2 }}
            >
              Attendacnce
            </Typography>
            <Divider
              sx={{ border: "1px solid #FE5A1780", mb: 3, width: "85%" }}
            />
            <Box
              sx={{
                width: "75%",
                p: "5px",
                boxShadow: "0px 0px 10px 0px #00000040",
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 2, textAlign: "center", fontWeight: 600, mt: "20px" }}
              >
                {dayjs(new Date().toLocaleDateString("en-US")).format(
                  "MMMM D, YYYY"
                )}
              </Typography>
              <Typography
                variant="body1"
                color="#000000"
                sx={{ fontWeight: 400, fontSize: "16px", textAlign: "center" }}
              >
                Please check in or out for today.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  mx: "15px",
                  gap: 2,
                  my: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => handleAttendance("check_in")}
                    disabled={status.checkInDone || loading}
                    sx={{
                      width: { xs: 70, sm: 88 },
                      height: { xs: 70, sm: 88 },
                      borderRadius: "50%",
                      background: "#1F3DB4",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                      "&:hover": {
                        background: "#1936aaff",
                        transform: "scale(1.05)",
                        boxShadow: "0px 6px 12px rgba(0,0,0,0.3)",
                      },
                      "&:disabled": {
                        background: "#b4b5b9ff",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        borderRadius: "50%",
                        background: "#DCDFED",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow:
                          "inset 0px 4px 4px 0px #0000001A, 4px 4px 4px 0px #00000040",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: "14px", sm: "18px" },
                          color: "#000000",
                        }}
                      >
                        In
                      </Typography>
                    </Box>
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#333", fontSize: "14px" }}
                  >
                    {status.checkInDone ? formatTime(checkInTime) : "---"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => handleAttendance("check_out")}
                    disabled={
                      !status.checkInDone || status.checkOutDone || loading
                    }
                    sx={{
                      width: { xs: 70, sm: 88 },
                      height: { xs: 70, sm: 88 },
                      borderRadius: "50%",
                      background: "#A41C1C",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                      "&:hover": {
                        background: "#A41C1C",
                        transform: "scale(1.05)",
                        boxShadow: "0px 6px 12px rgba(0,0,0,0.3)",
                      },
                      "&:disabled": {
                        background: "#b4b5b9ff",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        borderRadius: "50%",
                        background: "#DCDFED",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow:
                          "inset 0px 4px 4px 0px #0000001A, 4px 4px 4px 0px #00000040",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: "14px", sm: "18px" },
                          color: "#000000",
                        }}
                      >
                        Out
                      </Typography>
                    </Box>
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#333", fontSize: "14px" }}
                  >
                    {status.checkOutDone ? formatTime(checkOutTime) : "----"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "center", my: 2 }}>
                {status.checkInDone && !status.checkOutDone && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#000000",
                      }}
                    >
                      Latest Action: Check in at : {formatTime(checkInTime)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000000",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      Remember to check out before leaving.
                    </Typography>
                  </>
                )}
                {status.checkOutDone && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#000000",
                      }}
                    >
                      Latest Action: Check Out at :{formatTime(checkOutTime)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#28a745",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    >
                      Attendance completed for today.
                    </Typography>
                  </>
                )}
                {!status.checkInDone && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#000000", fontSize: "12px", fontWeight: 400 }}
                  >
                    Ready to start your day? Please check in.
                  </Typography>
                )}
              </Box>
            </Box>
            <Divider
              sx={{ border: "1px solid #FE5A1780", my: 3, width: "85%" }}
            />
              </>
            )
           }
          </Box>
          <Box>
            <SnackbarMessage
              snackbar={snackbar}
              handleOnClose={() => setSnackbar({ open: false })}
            />
          </Box>
        </Box>
      </PageContentWrapper>
    </PageWrapper>
  );
}
