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
  searchField?: string;
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
  WAITING_CONFIRM = 0,
  ACTIVE = 1,
  CLOSE = 2,
  DEACTIVATED = 9,
}

export const labelUserStatus: { [key in UserStatusEnum]: string } = {
  [UserStatusEnum.WAITING_CONFIRM]: 'Waiting Confirm',
  [UserStatusEnum.ACTIVE]: 'Active',
  [UserStatusEnum.CLOSE]: 'Closed',
  [UserStatusEnum.DEACTIVATED]: 'Deactivated',
};

export type ChangeStatusPayloadType = {
  user_id: string;
  status: number;
};

export type ChangeStatusResponseType = {
  message: string;
};

export type GetRestaurantListApiPropsType = {
  page_size: number;
  page_number: number;
  sort_key?: string;
  sort_type?: 'asc' | 'desc';
  searchField?: string;
};

export type GetRestaurantListResponseType = {
  data: RestaurantType[];
  page_number: string;
  page_size: string;
  sort_key: string;
  sort_type: string;
  total: number;
};

export type RestaurantType = {
  user_id: string;
  username: string;
  user_status: UserStatusEnum;
  weekday: string;
};

export type GetUserDetailApiPropsType = {
  user_id: string;
};

export type GetUserDetailResponseType = {
  user_id: string;
  role_id: string;
  username: string;
  email: string;
  branch_id: number;
  phone_number: string;
  user_status: string;
  birth_date: string | null;
  address: string | null;
  profile_picture_url: string | null;
  branch_name: string;
};
