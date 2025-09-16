export interface User {
  id: number;
  name: string;
  username: string;
  user_role: string;
  position_id: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  dob: string | null;
  start_join_date: string | null;
  bank_accounts: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveType {
  id: number;
  leave_type: string;
  created_at: string;
  updated_at: string;
}

export interface Leave {
  id: number;
  user_id: number;
  leave_type_id: number;
  date: string;
  leave_from: string;
  leave_to: string;
  total_days: number;
  reason: string;
  remark: string | null;
  status: "pending" | "approved" | "rejected";
  approved_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface LeaveListAPIRes extends Leave {
  user: User;
  leave_type: LeaveType;
}

export interface LeaveDetailAPIRes extends Leave {
  user: User;
  leave_type: LeaveType;
}

export type CreateLeaveAPIRes = {
  id: number;
  message: string;
};

export type UpdateLeaveAPIRes = {
  id: number;
  message: string;
};

export type UpdateLeaveStatusAPIRes = {
  id: number;
  message: string;
  status: string;
};

export type DeleteLeaveAPIRes = {
  id: number;
  message: string;
};
