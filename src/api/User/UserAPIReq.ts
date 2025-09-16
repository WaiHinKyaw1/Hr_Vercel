export type CreateUserAPIReq = {
  name: string;
  username: string;
  user_role: string;
  password: string;
  position_id: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  dob: Date | string;
  start_join_date: Date | string;
  bank_accounts: string;
};

export type UpdateUserAPIReq = {
  name: string;
  username: string;
  user_role: string;
  position_id: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  dob: Date | string;
  start_join_date: Date | string;
  bank_accounts: string;
};
export type ResetPasswordAPIReq = {
  new_password: string;
};
