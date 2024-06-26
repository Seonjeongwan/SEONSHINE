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

export const labelRoleById: { [key in RoleEnum]: string } = {
  [RoleEnum.ADMIN]: 'Admin',
  [RoleEnum.USER]: 'User',
  [RoleEnum.RESTAURANT]: 'Restaurant',
};

export enum DayEnum {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
}

export const dayByWeekday: { [key in DayEnum]: string } = {
  [DayEnum.MONDAY]: 'Monday',
  [DayEnum.TUESDAY]: 'Tuesday',
  [DayEnum.WEDNESDAY]: 'Wednesday',
  [DayEnum.THURSDAY]: 'Thursday',
  [DayEnum.FRIDAY]: 'Friday',
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

export type GetRestaurantDetailApiPropsType = {
  restaurant_id: string;
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

export type UploadImagePayloadType = {
  file: File;
};

export type UploadImageResponseType = {
  message: string;
  profile_picture_url: string;
};

export type UserDetailType = GetUserDetailResponseType;

export type GetRestaurantDetailResponseType = {
  user_id: string;
  role_id: string;
  username: string;
  email: string;
  phone_number: string;
  user_status: string;
  address: string | null;
  profile_picture_url: string | null;
  weekday: string | null;
};

export type RestaurantDetailType = GetRestaurantDetailResponseType;

export type WaitingUserType = {
  user_id: string;
  username: string;
  role_id: RoleEnum;
  email: string;
};

export type GetWaitingUserListResponseType = {
  data: WaitingUserType[];
  page_number: string;
  page_size: string;
  sort_key: string;
  sort_type: string;
  total: number;
};

export type GetWaitingUserListApiPropsType = {
  page_size: number;
  page_number: number;
  sort_key?: string;
  sort_type?: 'asc' | 'desc';
  searchField?: string;
};

export type UpdateUserPayloadType = {
  username: string;
  branch_id: number;
  address: string;
  phone_number: string;
  birth_date: string;
};

export type UpdateUserResponseType = {
  message: string;
};

export type UpdateRestaurantPayloadType = {
  username: string;
  address: string;
  phone_number: string;
};

export type UpdateRestaurantResponseType = {
  message: string;
};

export type UseGetRestaurantsPropsType = {
  enabled?: boolean;
};

export type GetAllRestaurantResponseType = {
  user_id: string;
  username: string;
  address: string;
};

export type AllRestaurantType = GetAllRestaurantResponseType;

export type RestaurantAssignedType = {
  weekday: number;
  restaurant_id: string;
};

export type RestaurantAssignResponseType = {
  message: string;
};
