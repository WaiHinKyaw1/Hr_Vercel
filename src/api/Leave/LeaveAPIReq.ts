export type CreateLeaveAPIReq = {
  leave_type_id: number;
  leave_from: string; // Date string in YYYY-MM-DD format
  leave_to: string; // Date string in YYYY-MM-DD format
  total_days: number;
  reason: string;
};

export type UpdateLeaveAPIReq = {
  leave_type_id: number;
  leave_from: string;
  leave_to: string;
  total_days: number;
  reason: string;
};

export type UpdateLeaveStatusAPIReq = {
  status: "pending" | "approved" | "rejected";
  remark?: string;
};

export type DeleteLeaveAPIReq = {
  is_active: boolean;
};
