// type EmployeeAttendance = {
//   id: number;
//   user_id: number;
//   date: string;
//   time: string;
//   device_info?: string;
// };

type AttendanceTime = {
  date: string;
  times: string[]; 
};

type Employee = {
  id: number;
  name: string;
};

type EmployeeAttendance = {
  employee: Employee;
  attendance_list: AttendanceTime[];
};
