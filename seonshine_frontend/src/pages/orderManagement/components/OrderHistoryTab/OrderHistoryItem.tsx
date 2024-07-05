import { Link } from 'react-router-dom';

import { Avatar, Stack, Typography } from '@mui/material';

import { avatarBaseURL } from '@/constants/image';
import { useDeviceType } from '@/hooks/useDeviceType';
import { OrderListHistoryItemType } from '@/types/order';

type OrderHistoryItemPropsType = {
  item: OrderListHistoryItemType;
  handleViewDetail?: (orderDate: string, branchId: number) => void;
};

const OrderHistoryItem = ({ item, handleViewDetail }: OrderHistoryItemPropsType) => {
  const {
    order_date,
    restaurant_image_url,
    restaurant_name,
    restaurant_address,
    total_amount,
    branch_id,
    branch_name,
  } = item;

  const { isMobile } = useDeviceType();
  const onClickDetail = () => {
    handleViewDetail?.(order_date, branch_id);
  };

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <Typography className="text-2xl font-bold">{order_date}</Typography>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        className="bg-white min-h-max min-w-max rounded-xl sm:rounded-s-full p-4 sm:pr-6"
        alignItems="center"
        gap={2}
      >
        <Avatar
          src={!restaurant_image_url ? '' : `${avatarBaseURL}${restaurant_image_url}`}
          className="w-28 h-28 hidden sm:flex mr-2"
        />
        <Stack
          direction="column"
          justifyContent="space-around"
          gap={2}
          className="w-full sm:w-3/5"
        >
          <Typography className="text-4xl font-bold">{restaurant_name}</Typography>
          <Typography className="text-lg font-normal">{branch_name}</Typography>
          <Typography className="text-lg font-normal">{restaurant_address}</Typography>
        </Stack>
        <Stack
          direction={isMobile ? 'row' : 'column'}
          alignItems="flex-end"
          justifyContent="space-between"
          gap={14}
          className="ml-0 sm:ml-auto pr-2 self-start sm:self-center w-full sm:w-auto"
        >
          <Typography className="text-lg font-normal text-right whitespace-nowrap">
            {`Order amount: ${total_amount}`}
          </Typography>
          <button
            onClick={onClickDetail}
            className="text-lg font-normal underline text-blue-500 hover"
          >
            Detail
          </button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderHistoryItem;
