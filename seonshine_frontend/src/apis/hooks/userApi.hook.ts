import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  ChangeStatusPayloadType,
  ChangeStatusResponseType,
  GetRestaurantListApiPropsType,
  GetRestaurantListResponseType,
  GetUserListApiPropsType,
  GetUserListResponseType,
} from '@/types/user';

import { BranchResponseType, callBranches, changeStatus, getRestaurantList, getUserList } from '../user';

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
