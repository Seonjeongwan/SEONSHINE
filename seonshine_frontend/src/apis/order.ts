import axiosInstance from '@/configs/axios';
import {
  GetOrderListApiPropsType,
  GetOrderListByDateApiPropsType,
  GetOrderListByDateResponseType,
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

export const getOrderListByDate = async (
  params: GetOrderListByDateApiPropsType,
): Promise<GetOrderListByDateResponseType> => {
  const response = await axiosInstance.get<GetOrderListByDateResponseType>('/order/list', {    
    params: params,
  });
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
