export interface LoginAPIReq {
    username: string;
    password: string;
}
export interface ChangePasswordAPIReq{
    current_password : string,
    new_password : string,
    password_confirmation : string
}