import axiosInstance from '@/configs/axios';
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

export const getOrderList = async (params: GetOrderListApiPropsType): Promise<GetOrderListResponseType> => {
  const response = await axiosInstance.get<GetOrderListResponseType>('/order/list', {
    params: params,
  });
  return response.data;
};

export const getOrderPeriod = async (): Promise<GetOrderPeriodResponseType> => {
  const response = await axiosInstance.get<GetOrderPeriodResponseType>('/order/valid-period');
  return response.data;
};

export const getOrderListSummary = async (
  params: GetOrderListSummaryApiPropsType,
): Promise<GetOrderListSummaryResponseType> => {
  const response = await axiosInstance.get<GetOrderListSummaryResponseType>('/order/list/summary', {
    params: params,
  });
  return response.data;
};

export const getOrderListHistory = async (
  params: GetOrderListHistoryApiPropsType,
): Promise<GetOrderListHistoryResponseType> => {
  const response = await axiosInstance.get<GetOrderListHistoryResponseType>('/order/list/history', {
    params: params,
  });
  return response.data;
};

export const getOrderListDetail = async (
  params: GetOrderListDetailApiPropsType,
): Promise<GetOrderListDetailResponseType> => {
  const response = await axiosInstance.get<GetOrderListDetailResponseType>('/order/list/detail', {
    params: params,
  });
  return response.data;
};
