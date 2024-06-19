import axiosInstance from '@/configs/axios';
import { GetOrderListApiPropsType, GetOrderListResponseType } from '@/types/order';

export const getOrderList = async (params: GetOrderListApiPropsType): Promise<GetOrderListResponseType> => {
  const response = await axiosInstance.get<GetOrderListResponseType>('/order/list', {
    params: params,
  });
  return response.data;
};
