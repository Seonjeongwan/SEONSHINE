import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  ChangeStatusPayloadType,
  ChangeStatusResponseType,
  CreateMenuItemPayloadType,
  DiscardOrderMenuItemResponseType,
  GetAllRestaurantResponseType,
  GetCurrentOrderResponseType,
  GetDashboardSummaryResponseType,
  GetMenuListApiPropsType,
  GetMenuListResponseType,
  GetRestaurantDetailApiPropsType,
  GetRestaurantDetailResponseType,
  GetRestaurantListApiPropsType,
  GetRestaurantListResponseType,
  GetTodayMenuListResponseType,
  GetUserDetailApiPropsType,
  GetUserDetailResponseType,
  GetUserListApiPropsType,
  GetUserListResponseType,
  GetWaitingUserListApiPropsType,
  GetWaitingUserListResponseType,
  OrderMenuItemPayloadType,
  OrderMenuItemResponseType,
  UpdateMenuItemPayloadType,
  UpdateMenuItemResponseType,
  UpdateRestaurantPayloadType,
  UpdateRestaurantResponseType,
  UpdateUserPayloadType,
  UpdateUserResponseType,
  UploadImagePayloadType,
  UploadImageResponseType,
  UseGetCurrentOrderPropsType,
  UseGetDashboardSummaryPropsType,
  UseGetRestaurantsPropsType,
  UseGetTodayMenuListPropsType,
} from '@/types/user';

import {
  BranchResponseType,
  callBranches,
  changeStatus,
  changeUserAvatar,
  createMenuItem,
  deleteMenuItem,
  discardOrderMenuItem,
  getAllRestaurants,
  getCurrentOrder,
  getDashboardSummary,
  getMenuList,
  getRestaurantDetail,
  getRestaurantList,
  getTodayMenuList,
  getUserDetail,
  getUserList,
  getWaitingUserList,
  orderMenuItem,
  updateMenuItem,
  updateRestaurant,
  updateUser,
} from '../user';

interface UseGetBranchProps {
  enabled?: boolean;
}

export const useGetBranches = ({ enabled = true }: UseGetBranchProps): UseQueryResult<BranchResponseType[]> => {
  return useQuery({
    queryKey: ['branchList'],
    queryFn: async () => {
      return callBranches();
    },
    enabled,
  });
};

export const useGetUserListApi = (params: GetUserListApiPropsType): UseQueryResult<GetUserListResponseType> => {
  return useQuery({
    queryKey: ['getUserList', params],
    queryFn: async () => {
      return getUserList(params);
    },
  });
};

export const useChangeStatusApi = (): UseMutationResult<ChangeStatusResponseType, unknown, ChangeStatusPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return changeStatus(payload);
    },
  });
};

export const useGetRestaurantListApi = (
  params: GetRestaurantListApiPropsType,
): UseQueryResult<GetRestaurantListResponseType> => {
  return useQuery({
    queryKey: ['getRestaurantList', params],
    queryFn: async () => {
      return getRestaurantList(params);
    },
  });
};

export const useGetUserDetailApi = (params: GetUserDetailApiPropsType): UseQueryResult<GetUserDetailResponseType> => {
  return useQuery({
    queryKey: ['getUserDetail', params],
    queryFn: async () => {
      return getUserDetail(params);
    },
  });
};

export const useChangeUserAvatarApi = (
  user_id: string,
): UseMutationResult<UploadImageResponseType, unknown, UploadImagePayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return changeUserAvatar(payload, user_id);
    },
  });
};

export const useGetRestaurantDetailApi = (
  params: GetRestaurantDetailApiPropsType,
): UseQueryResult<GetRestaurantDetailResponseType> => {
  return useQuery({
    queryKey: ['getRestaurantDetail', params],
    queryFn: async () => {
      return getRestaurantDetail(params);
    },
  });
};

export const useWaitingUserListApi = (
  params: GetWaitingUserListApiPropsType,
): UseQueryResult<GetWaitingUserListResponseType> => {
  return useQuery({
    queryKey: ['getWaitingUserList', params],
    queryFn: async () => {
      return getWaitingUserList(params);
    },
  });
};

export const useUpdateUserApi = ({
  userId,
}: {
  userId: string;
}): UseMutationResult<UpdateUserResponseType, unknown, UpdateUserPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return updateUser(payload, userId);
    },
  });
};

export const useUpdateRestaurantApi = ({
  userId,
}: {
  userId: string;
}): UseMutationResult<UpdateRestaurantResponseType, unknown, UpdateRestaurantPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return updateRestaurant(payload, userId);
    },
  });
};

export const useGetAllRestaurantsApi = ({
  enabled = true,
}: UseGetRestaurantsPropsType): UseQueryResult<GetAllRestaurantResponseType[]> => {
  return useQuery({
    queryKey: ['restaurantList'],
    queryFn: async () => {
      return getAllRestaurants();
    },
    enabled,
  });
};

export const useGetMenuListlApi = (params: GetMenuListApiPropsType): UseQueryResult<GetMenuListResponseType[]> => {
  return useQuery({
    queryKey: ['getMenuList', params],
    queryFn: async () => {
      return getMenuList(params);
    },
  });
};

export const useUpdateMenuItemApi = ({
  item_id,
}: {
  item_id: number;
}): UseMutationResult<UpdateMenuItemResponseType, unknown, UpdateMenuItemPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return updateMenuItem(payload, item_id);
    },
  });
};

export const useDeleteMenuItemApi = (item_id: number): UseMutationResult<{ message: string }, unknown, void> => {
  return useMutation({
    mutationFn: async () => {
      return deleteMenuItem(item_id);
    },
  });
};

export const useCreateMenuItemApi = (): UseMutationResult<{ message: string }, unknown, CreateMenuItemPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return createMenuItem(payload);
    },
  });
};

export const useGetTodayMenuListApi = ({
  enabled = true,
}: UseGetTodayMenuListPropsType): UseQueryResult<GetTodayMenuListResponseType> => {
  return useQuery({
    queryKey: ['todayMenuList'],
    queryFn: async () => {
      return getTodayMenuList();
    },
    enabled,
  });
};

export const useOrderMenuItem = (): UseMutationResult<OrderMenuItemResponseType, unknown, OrderMenuItemPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return orderMenuItem(payload);
    },
  });
};

export const useDiscardOrderMenuItem = (): UseMutationResult<DiscardOrderMenuItemResponseType, unknown, void> => {
  return useMutation({
    mutationFn: async () => {
      return discardOrderMenuItem();
    },
  });
};

export const useGetCurrentOrder = ({
  enabled = true,
}: UseGetCurrentOrderPropsType): UseQueryResult<GetCurrentOrderResponseType> => {
  return useQuery({
    queryKey: ['getCurrentOrder'],
    queryFn: async () => {
      return getCurrentOrder();
    },
    enabled,
  });
};

export const useGetDashBoardSummary = ({
  enabled = true,
}: UseGetDashboardSummaryPropsType): UseQueryResult<GetDashboardSummaryResponseType> => {
  return useQuery({
    queryKey: ['getDashboardSummary'],
    queryFn: async () => {
      return getDashboardSummary();
    },
    enabled,
  });
};
