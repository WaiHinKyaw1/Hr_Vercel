import { AppAPI } from "api";
import { CreateUserAPIRes, DeleteUserAPIRes, ResetPasswordAPIRes, UpdateUserAPIRes, UserDetailAPIRes, UserListAPIRes } from "./UserAPIRes";
import { CreateUserAPIReq, ResetPasswordAPIReq, UpdateUserAPIReq } from "./UserAPIReq";


const apiName = "/users";

export function getList(params?: any) {
  return AppAPI.get<UserListAPIRes[]>(apiName, {
    params: params,
  });
}

export function create(data: CreateUserAPIReq) {
  return AppAPI.post<CreateUserAPIRes>(apiName, data);
}

export function update(id: number, data: UpdateUserAPIReq) {
  return AppAPI.put<UpdateUserAPIRes>(`${apiName}/${id}`, data);
}

export function getById(id: number) {
  return AppAPI.get<UserDetailAPIRes>(`${apiName}/${id}`);
}

export function deleteById(id: number) {
  return AppAPI.delete<DeleteUserAPIRes>(`${apiName}/${id}`);
}

export function resetPassword(id: number, data: ResetPasswordAPIReq) {
  return AppAPI.patch<ResetPasswordAPIRes>(`${apiName}/${id}/reset-password`, data);
}
export function toggleStatus (id: number, isActive: boolean) {
  return AppAPI.patch<{ id: number; message: string; is_active: boolean }>(`/users/${id}/status`, { is_active: isActive });
};

