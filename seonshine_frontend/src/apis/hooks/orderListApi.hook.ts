import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { GetOrderListApiPropsType, GetOrderListResponseType } from '@/types/order';

import { getOrderList } from '../order';

export const useGetOrderListApi = (params: GetOrderListApiPropsType): UseQueryResult<GetOrderListResponseType> => {
  return useQuery({
    queryKey: ['getOrderList', params],
    queryFn: async () => {
      return getOrderList(params);
    },
  });
};
