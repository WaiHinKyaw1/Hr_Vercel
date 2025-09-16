import { AppAPI } from "api";
import {
  CreateLeaveTypeAPIReq,
  UpdateLeaveTypeAPIReq,
} from "./LeaveTypeAPIReq";
import {
  LeaveTypeListAPIRes,
  LeaveTypeDetailsAPIRes,
  CreateLeaveTypeAPIRes,
  UpdateLeaveTypeAPIRes,
  DeleteLeaveTypeAPIRes,
} from "./LeaveTypeAPIRes";

const apiName = "/leave-types";

export function getList(params?: any) {
  return AppAPI.get<LeaveTypeListAPIRes>(apiName, { params });
}

export function create(data: CreateLeaveTypeAPIReq) {
  return AppAPI.post<CreateLeaveTypeAPIRes>(apiName, data);
}

export function update(id: number, data: UpdateLeaveTypeAPIReq) {
  return AppAPI.put<UpdateLeaveTypeAPIRes>(`${apiName}/${id}`, data);
}

export function getById(id: number) {
  return AppAPI.get<LeaveTypeDetailsAPIRes>(`${apiName}/${id}`);
}

export function deleteById(id: number) {
  return AppAPI.delete<DeleteLeaveTypeAPIRes>(`${apiName}/${id}`);
}
