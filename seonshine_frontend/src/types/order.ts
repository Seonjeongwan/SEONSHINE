export type OrderListType = {
  restaurant_name?: string;
  employee_name?: string;
  ordered_items?: string;
  amount?: number;
  date?: string;
};

export type GetOrderListApiPropsType = {};

export type GetOrderListResponseType = {
  data: OrderListType[];
  total: number;
};

export type GetOrderPeriodResponseType = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

export type GetOrderListSummaryApiPropsType = {
  date?: string;
};

export type GetOrderListSummaryResponseType = {
  data: OrderListSummaryItemType[];
  date: string;
  restaurant_id: string;
  restaurant_name: string;
  total: number;
};

export type OrderListSummaryItemType = {
  item_id: number;
  item_name: string;
  restaurant_id: string;
  count: number;
};

export type GetOrderListDetailApiPropsType = {
  date?: string;
};

export type GetOrderListDetailResponseType = { data: OrderListDetailItemType[]; date: string; total: number };

export type OrderListDetailItemType = {
  user_id: string;
  restaurant_id: string;
  item_id: number;
  item_name: string;
  username: string;
  restaurant_name: string;
  submitted_time: string;
};
