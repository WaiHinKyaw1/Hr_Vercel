import { ThreeDotMenuOptionType } from "components";

interface SubMenu {
  label: string;
  href: string;
  allowedRoles?: string[];
}

export interface SideMenu {
  src: string;
  label: string;
  active: string;
  href: string;
  subMenus?: SubMenu[];
  allowedRoles?: string[];
}

export const sideMenus: SideMenu[] = [
  {
    src: "/icons/sidemenus/user.png",
    label: "User",
    active: "/icons/sidemenus/user.png",
    href: "/users",
    allowedRoles: ["management"],
  },
  {
    src: "/icons/sidemenus/employee_attendance.png",
    label: "Employee Attendances",
    active: "/icons/sidemenus/employee_attendance.png",
    href: "/employee-att-list",
    allowedRoles: ["management"],
  },
  {
    src: "/icons/sidemenus/attendance.png",
    label: "Attendance",
    active: "/icons/sidemenus/attendance.png",
    href: "/attendance",
  },
  {
    src: "/icons/sidemenus/attendanceList.png",
    label: "Attendance List",
    active: "/icons/sidemenus/attendanceList.png",
    href: "/attendances",
  },
  {
    src: "/icons/sidemenus/position.png",
    label: "Position",
    active: "/icons/sidemenus/position.png",
    href: "/positions",
    
  },
  {
    src: "/icons/sidemenus/leave_type.png",
    label: "Leave Type",
    active: "/icons/sidemenus/leave_type.png",
    href: "/leave-types",
    
  },
  {
    src: "/icons/sidemenus/leave.png",
    label: "Leave Form",
    active: "/icons/sidemenus/leave.png",
    href: "/my-leaves",
    // allowedRoles: ["management"],
  },
  // {
  //   src: "/icons/sidemenus/leave.png",
  //   label: "Leave Listing",
  //   active: "/icons/sidemenus/leave.png",
  //   href: "/leave-requests/",
  //   allowedRoles: ["management"],
  // },
  {
    src: "/icons/sidemenus/off_day.png",
    label: "Off Day",
    active: "/icons/sidemenus/off_day.png",
    href: "/off-days",
    
  },
];

export const ThreeDotOptions = (
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
  {
    key: "reset-password",
    label: "Reset Password",
    iconSrc: "/icons/reset-password.png",
  },
  {
    key: "view",
    label: "View",
    iconSrc: "/icons/visible.png",
  },
];

export const Genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const UserRoles = [
  { value: "staff", label: "Staff" },
  { value: "management", label: "Management" },
  { value: "scanner", label: "Scanner" },
];

export const OffDayTypes = [
  {value: "Holiday", label: "Holiday"},
  {value: "Off Day", label: "Off Day"},
];