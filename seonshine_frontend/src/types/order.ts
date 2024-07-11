export type OrderListType = {
  restaurant_name?: string;
  employee_name?: string;
  ordered_items?: string;
  amount?: number;
  date?: string;
  branch_name?: string;
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
  branch_id?: number;
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

export type GetOrderListHistoryApiPropsType = {
  from?: string;
  to?: string;
};

export type GetOrderListHistoryResponseType = {
  data: OrderListHistoryItemType[];
};

export type OrderListHistoryItemType = {
  order_id: string;
  branch_id: number;
  branch_name: string;
  restaurant_id: string;
  order_date: string;
  total_amount: number;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_image_url: string | null;
};
export type GetOrderListDetailApiPropsType = {
  date?: string;
  branch_id?: number;
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
  branch_name: string;
};

export type ViewModeType = 'summary' | 'detail';

export enum UserOrderTabEnum {
  ORDER_MENU = 0,
  ORDER_LIST = 1,
}
