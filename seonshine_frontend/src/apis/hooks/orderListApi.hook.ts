import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  GetOrderListApiPropsType,
  GetOrderListDetailApiPropsType,
  GetOrderListDetailResponseType,
  GetOrderListHistoryApiPropsType,
  GetOrderListHistoryResponseType,
  GetOrderListResponseType,
  GetOrderListSummaryApiPropsType,
  GetOrderListSummaryResponseType,
  GetOrderPeriodResponseType,
} from '@/types/order';

import { getOrderList, getOrderListDetail, getOrderListHistory, getOrderListSummary, getOrderPeriod } from '../order';

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

export const useGetOrderListSummaryApi = ({
  params,
  enabled = true,
}: {
  params: GetOrderListSummaryApiPropsType;
  enabled?: boolean;
}): UseQueryResult<GetOrderListSummaryResponseType> => {
  return useQuery({
    queryKey: ['OrderListSummary', params],
    queryFn: async () => {
      return getOrderListSummary(params);
    },
    enabled,
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
export const useGetOrderListDetailApi = ({
  params,
  enabled = true,
}: {
  params: GetOrderListDetailApiPropsType;
  enabled?: boolean;
}): UseQueryResult<GetOrderListDetailResponseType> => {
  return useQuery({
    queryKey: ['getOrderListDetail', params],
    queryFn: async () => {
      return getOrderListDetail(params);
    },
    enabled,
  });
};
