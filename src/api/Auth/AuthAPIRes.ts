
export interface LoginAPIRes {
  user: {
    is_active: boolean;
    username: string;
    password: string;
  }
  token: string;
}

export interface changePasswordAPIRes{
    current_password : string,
    new_password : string,
    password_confirmation : string,
    message: string
}
