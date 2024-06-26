import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  GetOrderListApiPropsType,
  GetOrderListByDateApiPropsType,
  GetOrderListByDateResponseType,
  GetOrderListResponseType,
  GetOrderPeriodResponseType,
} from '@/types/order';

import { getOrderList, getOrderListByDate, getOrderPeriod } from '../order';

export const useGetOrderListApi = (params: GetOrderListApiPropsType): UseQueryResult<GetOrderListResponseType> => {
  return useQuery({
    queryKey: ['getOrderList', params],
    queryFn: async () => {
      return getOrderList(params);
    },
  });
};

export const useGetOrderPeriodApi = (): UseQueryResult<GetOrderPeriodResponseType> => {
  return useQuery({
    queryKey: ['getOrderList'],
    queryFn: async () => {
      return getOrderPeriod();
    },
  });
};

export const useGetOrderListByDateApi = (
  params: GetOrderListByDateApiPropsType,
): UseQueryResult<GetOrderListByDateResponseType> => {
  return useQuery({
    queryKey: ['getOrderListByDate', params],
    queryFn: async () => {
      return getOrderListByDate(params);
    },
  });
};
