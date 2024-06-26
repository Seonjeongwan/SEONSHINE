import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';

import { RestaurantAssignedType, RestaurantAssignResponseType } from '@/types/user';

import { asssignRestaurant, getRestaurantAssignList } from '../user';

export const useGetRestaurantAssignListApi = (): UseQueryResult<RestaurantAssignedType[]> => {
  return useQuery({
    queryKey: ['getRestaurantAssignList'],
    queryFn: async () => {
      return getRestaurantAssignList();
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
