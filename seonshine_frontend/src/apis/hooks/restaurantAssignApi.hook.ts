import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';

import { GetAllRestaurantResponseType, RestaurantAssignedType, RestaurantAssignResponseType } from '@/types/user';

import { asssignRestaurant, getAllRestaurant, getRestaurantAssignList } from '../user';

export const useGetRestaurantAssignListApi = (): UseQueryResult<RestaurantAssignedType[]> => {
  return useQuery({
    queryKey: ['getRestaurantAssignList'],
    queryFn: async () => {
      return getRestaurantAssignList();
    },
  });
};

export const useGetAllRestaurantApi = (): UseQueryResult<GetAllRestaurantResponseType[]> => {
  return useQuery({
    queryKey: ['getAllRestaurant'],
    queryFn: async () => {
      return getAllRestaurant();
    },
  });
};

export const useRestaurantAssignApi = (): UseMutationResult<
  RestaurantAssignResponseType,
  unknown,
  RestaurantAssignedType
> => {
  return useMutation({
    mutationFn: async (payload) => {
      return asssignRestaurant(payload);
    },
  });
};
