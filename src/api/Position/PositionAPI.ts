import { AppAPI } from "api";
import { CreatePositionAPIRes, DeletePositionAPIRes, UpdatePositionAPIRes, PositionListAPIRes, PositionDetailsAPIRes } from "./PositionAPIRes";
import { CreatePositionAPIReq, UpdatePositionAPIReq } from "./PositionAPIReq";

const apiName = "/positions";

export function getList(params?: any) {
  return AppAPI.get<PositionListAPIRes[]>(apiName, {
    params: params,
  });
}

export function create(data: CreatePositionAPIReq) {
  return AppAPI.post<CreatePositionAPIRes>(apiName, data);
}

export function update(id: number, data: UpdatePositionAPIReq) {
  return AppAPI.put<UpdatePositionAPIRes>(`${apiName}/${id}`, data);
}

export function getById(id: number) {
  return AppAPI.get<PositionDetailsAPIRes>(`${apiName}/${id}`);
}

export function deleteById(id: number) {
  return AppAPI.delete<DeletePositionAPIRes>(`${apiName}/${id}`);
}

// Add the toggleStatus function
export function toggleStatus(id: number, isActive: boolean) {
  return AppAPI.patch<{ id: number; message: string; is_active: boolean }>(`/positions/${id}/status`, { is_active: isActive });
}
