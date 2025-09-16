type Attendance = {
  id: number;
  user_id: number;
  date: string;
  time: string;
  device_info?: string;
  type: "check_in" | "check_out";
  latitude: number;
  longitude: number;
};