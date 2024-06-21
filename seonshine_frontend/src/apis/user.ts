import axiosInstance from '@/configs/axios';
import {
  ChangeStatusPayloadType,
  ChangeStatusResponseType,
  GetRestaurantDetailApiPropsType,
  GetRestaurantDetailResponseType,
  GetRestaurantListApiPropsType,
  GetRestaurantListResponseType,
  GetUserDetailApiPropsType,
  GetUserDetailResponseType,
  GetUserListApiPropsType,
  GetUserListResponseType,
  GetWaitingUserListApiPropsType,
  GetWaitingUserListResponseType,
  UpdateRestaurantPayloadType,
  UpdateRestaurantResponseType,
  UpdateUserPayloadType,
  UpdateUserResponseType,
} from '@/types/user';

export type BranchResponseType = {
  branch_id: number;
  branch_name: string;
  created_at: string;
  updated_at: string;
};

export const callBranches = async (): Promise<BranchResponseType[]> => {
  const response = await axiosInstance.get<BranchResponseType[]>('/common/branches');
  return response.data;
};

export const getUserList = async (params: GetUserListApiPropsType): Promise<GetUserListResponseType> => {
  const response = await axiosInstance.get<GetUserListResponseType>('/user/list', {
    params: params,
  });
  return response.data;
};

export const changeStatus = async (payload: ChangeStatusPayloadType): Promise<ChangeStatusResponseType> => {
  const response = await axiosInstance.post<ChangeStatusResponseType>('/user/change-status', payload);
  return response.data;
};

export const getRestaurantList = async (
  params: GetRestaurantListApiPropsType,
): Promise<GetRestaurantListResponseType> => {
  const response = await axiosInstance.get<GetRestaurantListResponseType>('/restaurant/list', {
    params: params,
  });
  return response.data;
};

export const getUserDetail = async ({ user_id }: GetUserDetailApiPropsType): Promise<GetUserDetailResponseType> => {
  const response = await axiosInstance.get<GetUserDetailResponseType>(`/user/${user_id}`);
  return response.data;
};

export const getRestaurantDetail = async ({
  restaurant_id,
}: GetRestaurantDetailApiPropsType): Promise<GetRestaurantDetailResponseType> => {
  const response = await axiosInstance.get<GetRestaurantDetailResponseType>(`/restaurant/${restaurant_id}`);
  return response.data;
};

export const getWaitingUserList = async (
  params: GetWaitingUserListApiPropsType,
): Promise<GetWaitingUserListResponseType> => {
  const response = await axiosInstance.get<GetWaitingUserListResponseType>('/user/waiting-confirm', {
    params: params,
  });
  return response.data;
};

export const updateUser = async (payload: UpdateUserPayloadType, userId: string): Promise<UpdateUserResponseType> => {
  const response = await axiosInstance.put<UpdateUserResponseType>(`/user/${userId}`, payload);
  return response.data;
};

export const updateRestaurant = async (
  payload: UpdateRestaurantPayloadType,
  userId: string,
): Promise<UpdateRestaurantResponseType> => {
  const response = await axiosInstance.put<UpdateRestaurantResponseType>(`/restaurant/${userId}`, payload);
  return response.data;
};
