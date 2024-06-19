import axiosInstance from '@/configs/axios';
import {
  ChangeStatusPayloadType,
  ChangeStatusResponseType,
  GetRestaurantListApiPropsType,
  GetRestaurantListResponseType,
  GetUserDetailApiPropsType,
  GetUserDetailResponseType,
  GetUserListApiPropsType,
  GetUserListResponseType,
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
  const response = await axiosInstance.get<GetRestaurantListResponseType>('/user/restaurant-list', {
    params: params,
  });
  return response.data;
};

export const getUserDetail = async ({ user_id }: GetUserDetailApiPropsType): Promise<GetUserDetailResponseType> => {
  const response = await axiosInstance.get<GetUserDetailResponseType>(`/user/${user_id}`);
  return response.data;
};
