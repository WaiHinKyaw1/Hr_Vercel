export type LeaveTypeListAPIRes = LeaveType[];
export type LeaveTypeDetailsAPIRes = LeaveType;

export type CreateLeaveTypeAPIRes = {
  data: any;
  id: number;
  message: string;
};

export type UpdateLeaveTypeAPIRes = {
  id: number;
  message: string;
};

export type DeleteLeaveTypeAPIRes = {
  id: number;
  message: string;
};