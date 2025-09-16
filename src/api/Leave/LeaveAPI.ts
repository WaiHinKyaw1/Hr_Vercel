import { AppAPI } from "api";

import {
  CreateLeaveAPIRes,
  DeleteLeaveAPIRes,
  UpdateLeaveAPIRes,
  UpdateLeaveStatusAPIRes,
  LeaveDetailAPIRes,
  LeaveListAPIRes
} from "./LeaveAPIRes";

import {
  CreateLeaveAPIReq,
  UpdateLeaveAPIReq,
  UpdateLeaveStatusAPIReq,
  DeleteLeaveAPIReq
} from "./LeaveAPIReq";

const apiName = "/leaves";

export function getList(params?: any) {
  return AppAPI.get<LeaveListAPIRes[]>(apiName, {
    params: params,
  });
}

export function create(data: CreateLeaveAPIReq) {
  return AppAPI.post<CreateLeaveAPIRes>(apiName, data);
}

export function update(id: number, data: UpdateLeaveAPIReq) {
  return AppAPI.put<UpdateLeaveAPIRes>(`${apiName}/${id}`, data);
}

export function getById(id: number) {
  return AppAPI.get<LeaveDetailAPIRes>(`${apiName}/${id}`);
}

export function deleteById(id: number, data: DeleteLeaveAPIReq) {
  return AppAPI.delete<DeleteLeaveAPIRes>(`${apiName}/${id}`, { data });
}

// Based on your Bruno API calls, the endpoint should be PATCH /leaves/{id} with status in body
export function updateStatus(id: number, data: UpdateLeaveStatusAPIReq) {
  return AppAPI.patch<UpdateLeaveStatusAPIRes>(`${apiName}/${id}`, data);
}

// Export as default
const LeaveAPI = {
  getList,
  create,
  update,
  getById,
  deleteById,
  updateStatus,
};

export default LeaveAPI;
