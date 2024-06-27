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

export type GetOrderListByDateApiPropsType = {
  page_size: number;
  page_number: number;
  sort_key?: string;
  sort_type?: 'asc' | 'desc';
  date?: string;
  restaurant_id?: string;
};

export type GetOrderListByDateResponseType = {
  data: OrderItemType[];
  date: string;
  page_number: string;
  page_size: string;
  sort_key: string;
  sort_type: string;
  total: number;
};

export type OrderItemType = {
  order_item_id: string;
  order_id: string;
  user_id: string;
  branch_id: number;
  restaurant_id: string;
  item_id: number;
  item_name: string;
  quantity: number;
  price: number;
  order_date: string;
  cancel_yn: string;
  created_at: string;
  updated_at: string;
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
