export enum RoleEnum {
  ADMIN = '0',
  USER = '1',
  RESTAURANT = '2',
}

export const labelIDByRole: { [key in RoleEnum]: string } = {
  [RoleEnum.ADMIN]: 'ID',
  [RoleEnum.USER]: 'Employee Number',
  [RoleEnum.RESTAURANT]: 'ID',
};

export type CurrentUserType = {
  user_id: string;
  role_id: RoleEnum;
  username: string;
  phone_number: string;
  branch_id: string;
  email: string;
  password_hash: string;
  confirm_yn: string;
  created_at: string;
  updated_at: string;
};