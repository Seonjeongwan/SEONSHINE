import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';

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
} from '@/types/user';

import {
  BranchResponseType,
  callBranches,
  changeStatus,
  getRestaurantDetail,
  getRestaurantList,
  getUserDetail,
  getUserList,
  getWaitingUserList,
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
