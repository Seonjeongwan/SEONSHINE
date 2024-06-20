export type OrderListType = {
  restaurant_name: string;
  employee_name: string;
  ordered_items: string;
  date: string;
};

export type GetOrderListApiPropsType = {};

export type GetOrderListResponseType = {
  data: OrderListType[];
  total: number;
};
