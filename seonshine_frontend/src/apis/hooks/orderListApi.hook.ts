import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  GetOrderListApiPropsType,
  GetOrderListResponseType,
  GetOrderListSummaryApiPropsType,
  GetOrderListSummaryResponseType,
  GetOrderPeriodResponseType,
} from '@/types/order';

import { getOrderList, getOrderListSummary, getOrderPeriod } from '../order';

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

export const useGetOrderListSumaryApi = (
  params: GetOrderListSummaryApiPropsType,
): UseQueryResult<GetOrderListSummaryResponseType> => {
  return useQuery({
    queryKey: ['getOrderListByDate', params],
    queryFn: async () => {
      return getOrderListSummary(params);
    },
  });
};
