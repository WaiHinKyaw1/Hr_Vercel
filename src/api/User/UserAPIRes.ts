export interface UserListAPIRes extends User {
  position: Position
}
export interface UserDetailAPIRes extends User {
  position: Position
}
export type CreateUserAPIRes = {
  id: number;
  message: string;
};

export type UpdateUserAPIRes = {
  id: number;
  message: string;
};

export type DeleteUserAPIRes = {
  id: number;
  message: string;
};
export type ResetPasswordAPIRes = {
  id: number;
  message: string;
};