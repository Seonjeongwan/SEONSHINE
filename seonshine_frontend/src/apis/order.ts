import axiosInstance from '@/configs/axios';
import { GetOrderListApiPropsType, GetOrderListResponseType, GetOrderPeriodResponseType } from '@/types/order';

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
