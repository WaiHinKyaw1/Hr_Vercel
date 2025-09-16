import { AppAPI, CreateAttendanceAPIReq } from "api";
import { AttendanceDetailsAPIRes, UserAttListAPIRes } from "./AttendanceAPIRes";
import {EmployeeAttendanceListAPIRes} from "./AttendanceAPIRes"
export function getAttListByUserId(id: number) {
  return AppAPI.get<UserAttListAPIRes[]>(`/users/${id}/attendances`);
}

export function getEmployeeAttendances(params: {
  start_date?: string | null;
  end_date?: string | null;
}) {
  const query: Record<string, string> = {};

  if (params.start_date) query.start_date = params.start_date;
  if (params.end_date) query.end_date = params.end_date;
  return AppAPI.get<EmployeeAttendanceListAPIRes[]>("/employee-attendances", { params });
}
 export function create(data: CreateAttendanceAPIReq){
  return AppAPI.post<CreateAttendanceAPIReq>("/attendances", data);
 }
 export function getToday(){
  return AppAPI.get<AttendanceDetailsAPIRes>("/attendances/today",);
 }
