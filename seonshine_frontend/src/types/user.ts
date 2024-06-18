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
  token: string;
};

export type GetUserListApiPropsType = {
  page_size: number;
  page_number: number;
  sort_key?: string;
  sort_type?: 'asc' | 'desc';
  branch_name?: string;
};

export type GetUserListResponseType = {
  data: UserType[];
  page_number: string;
  page_size: string;
  sort_key: string;
  sort_type: string;
  total: number;
};

export type UserType = {
  user_id: string;
  username: string;
  user_status: UserStatusEnum;
  branch_name: string;
};

export enum UserStatusEnum {
  ACTIVE = '1',
  CLOSE = '2',
  DEACTIVATED = '9',
}

export const labelUserStatus: { [key in UserStatusEnum]: string } = {
  [UserStatusEnum.ACTIVE]: 'Active',
  [UserStatusEnum.CLOSE]: 'Close',
  [UserStatusEnum.DEACTIVATED]: 'Deactivated',
};
