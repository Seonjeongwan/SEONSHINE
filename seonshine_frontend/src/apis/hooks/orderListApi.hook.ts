import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  GetOrderListApiPropsType,
  GetOrderListHistoryApiPropsType,
  GetOrderListHistoryResponseType,
  GetOrderListResponseType,
  GetOrderListSummaryApiPropsType,
  GetOrderListSummaryResponseType,
  GetOrderPeriodResponseType,
} from '@/types/order';

import { getOrderList, getOrderListHistory, getOrderListSummary, getOrderPeriod } from '../order';

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

export const useGetOrderListSummaryApi = (
  params: GetOrderListSummaryApiPropsType,
): UseQueryResult<GetOrderListSummaryResponseType> => {
  return useQuery({
    queryKey: ['OrderListSummary', params],
    queryFn: async () => {
      return getOrderListSummary(params);
    },
  });
};

export const useGetOrderListHistoryApi = (
  params: GetOrderListHistoryApiPropsType,
): UseQueryResult<GetOrderListHistoryResponseType> => {
  return useQuery({
    queryKey: ['getOrderListHistory'],
    queryFn: async () => {
      return getOrderListHistory(params);
    },
  });
};
