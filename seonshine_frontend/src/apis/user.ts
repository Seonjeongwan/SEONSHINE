import axiosInstance from '@/configs/axios';
import {
  ChangeStatusPayloadType,
  ChangeStatusResponseType,
  GetAllRestaurantResponseType,
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
  RestaurantAssignedType,
  RestaurantAssignResponseType,
  UpdateRestaurantPayloadType,
  UpdateRestaurantResponseType,
  UpdateUserPayloadType,
  UpdateUserResponseType,
  UploadImagePayloadType,
  UploadImageResponseType,
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

export const changeUserAvatar = async (
  payload: UploadImagePayloadType,
  user_id: string,
): Promise<UploadImageResponseType> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  const response = await axiosInstance.post<UploadImageResponseType>(`/user/${user_id}/change-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export const getAllRestaurant = async (): Promise<GetAllRestaurantResponseType[]> => {
  const response = await axiosInstance.get<GetAllRestaurantResponseType[]>('/restaurant/all');
  return response.data;
};

export const getRestaurantAssignList = async (): Promise<RestaurantAssignedType[]> => {
  const response = await axiosInstance.get<RestaurantAssignedType[]>('/restaurant/assign-list');
  return response.data;
};

export const asssignRestaurant = async (payload: RestaurantAssignedType): Promise<RestaurantAssignResponseType> => {
  const response = await axiosInstance.post<RestaurantAssignResponseType>(`/restaurant/assign-date`, payload);
  return response.data;
};
