import { AppAPI } from "api";
import { ChangePasswordAPIReq, LoginAPIReq } from "./AuthAPIReq";
import { changePasswordAPIRes, LoginAPIRes } from "./AuthAPIRes";

export function login(data: LoginAPIReq) {
  return AppAPI.post<LoginAPIRes>("/login", data);
}
export function logout(){
  return AppAPI.post("/logout");
}
export function changePassword(data: ChangePasswordAPIReq){
  return AppAPI.put<changePasswordAPIRes>("/change-password",data);
}
