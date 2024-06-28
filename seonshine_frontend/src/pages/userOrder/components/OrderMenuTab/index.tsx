import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { RestaurantRounded } from '@mui/icons-material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import ConfirmModal from '@/components/organims/confirmModal';

import { avatarBaseURL } from '@/constants/image';
import { GetMenuListApiPropsType, GetMenuListResponseType, GetTodayMenuListResponseType } from '@/types/user';

import { useGetOrderPeriodApi } from '@/apis/hooks/orderListApi.hook';
import {
  useDiscardOrderMenuItem,
  useGetCurrentOrder,
  useGetTodayMenuListApi,
  useOrderMenuItem,
} from '@/apis/hooks/userApi.hook';

import {
  approvalChangeOrderItem,
  approvalChangeOrderItemDescription,
  approvalDiscardOrderItem,
  approvalDiscardOrderItemDescription,
  approvalOrderItem,
  approvalOrderItemDescription,
} from './constant';

const OrderMenuTab = () => {
  const { data: todayMenuList } = useGetTodayMenuListApi({ enabled: true });
  const { data: currentOrder, isPending: isLoadingCurrentOrder } = useGetCurrentOrder({ enabled: true });
  const { mutate: orderMenuItem, isPending: isLoadingOrder } = useOrderMenuItem();
  const { mutate: discardOrderMenuItem, isPending: isLoadingDiscardOrder } = useDiscardOrderMenuItem();
  const [isConfirmOrderModalOpen, setIsConfirmOrderModalOpen] = useState<boolean>(false);
  const [isConfirmDiscardOrderModalOpen, setIsConfirmDiscardOrderModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<GetMenuListResponseType | null>(null);
  const { data: orderPeriod } = useGetOrderPeriodApi();

  const handleClickOrderButton = (dish: GetMenuListResponseType) => {
    if (isOrderDisabled()) {
      toast.warning('Ordering is only available during the designated order period.');
      return;
    }
    setSelectedItem(dish);
    setIsConfirmOrderModalOpen(true);
  };

  const handleClickDiscardButton = () => {
    if (isOrderDisabled()) {
      toast.warning('Cancelling is only available during the designated order period.');
      return;
    }
    setIsConfirmDiscardOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConfirmOrderModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseDiscardModal = () => {
    setIsConfirmDiscardOrderModalOpen(false);
    setSelectedItem(null);
  };

  const queryClient = useQueryClient();

  const handleConfirmOrder = () => {
    orderMenuItem(
      { item_id: selectedItem?.item_id as number },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          queryClient.invalidateQueries({ queryKey: ['getCurrentOrder'] });
          handleCloseModal();
        },
        onError: () => {
          toast.error('Order item failed!');
        },
      },
    );
  };

  const handleConfirmDiscardOrder = () => {
    discardOrderMenuItem(undefined, {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['getCurrentOrder'] });
        handleCloseDiscardModal();
      },
      onError: () => {
        toast.error('Discard order item failed!');
      },
    });
  };

  function formatTimestamp(timestamp: string) {
    const dateObj = new Date(timestamp);

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = (dateObj.getHours() + 7).toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day} - ${hours}:${minutes}`;
  }

  const isOrderDisabled = () => {
    if (!orderPeriod) return false;
    const { startHour, startMinute, endHour, endMinute } = orderPeriod;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return (
      (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
      (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
    );
  };

  return (
    <Box className="px-2 md:px-4">
      <Stack
        direction="column"
        spacing={4}
      >
        {currentOrder && (
          <Box className="px-2 mb-6">
            <Typography className="font-bold text-2xl mb-4">Ordered Item</Typography>
            <Box className="rounded-md p-6 box-border grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white w-full md:w-2/5 shadow-xl">
              <Stack className="w-full h-48 md:h-64 flex items-center justify-center">
                <img
                  src={`${avatarBaseURL}${currentOrder.image_url}`}
                  alt={currentOrder.item_name}
                  className="object-cover h-full w-full rounded-md"
                />
              </Stack>
              <Stack className="flex justify-between">
                <Box className="ml-4">
                  <Typography className="font-bold text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {currentOrder.item_name}
                  </Typography>
                  <Typography className="text-md text-gray-500">{currentOrder.restaurant_name}</Typography>
                  <Typography className="text-md text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {formatTimestamp(currentOrder.submitted_time)}
                  </Typography>
                </Box>
                <Button
                  onClick={handleClickDiscardButton}
                  variant="outlined"
                  color="error"
                  className="self-end rounded-2xl font-bold w-1/3"
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
        <Box className="px-2">
          <Typography className="font-bold text-2xl">
            Menu list of {todayMenuList?.current_day.replace(/-/g, '.')} - {todayMenuList?.restaurant_name}
          </Typography>
        </Box>
        <Stack className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {todayMenuList?.menu_list.map((dish, index) => (
            <Stack
              key={dish.name + index}
              className="rounded-md p-6 m-2 box-border cursor-pointer bg-white transition-transform transform hover:scale-105 hover:shadow-lg"
              direction="column"
              gap={2}
              onClick={() => handleClickOrderButton(dish)}
            >
              <Box className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
                {dish.image_url ? (
                  <img
                    src={`${avatarBaseURL}${dish.image_url}`}
                    className="h-full w-full object-cover"
                    alt={dish.name}
                  />
                ) : (
                  <Stack className="w-full h-full items-center">
                    <RestaurantRounded
                      className="w-full h-1/2 opacity-30"
                      fontSize="large"
                    />
                  </Stack>
                )}
              </Box>
              <Typography className="font-bold">{dish.name}</Typography>
            </Stack>
          ))}
        </Stack>
        <ConfirmModal
          open={isConfirmOrderModalOpen}
          title={!currentOrder ? approvalOrderItem : approvalChangeOrderItem}
          description={!currentOrder ? approvalOrderItemDescription : approvalChangeOrderItemDescription}
          handleClose={() => setIsConfirmOrderModalOpen(false)}
          handleConfirm={handleConfirmOrder}
        />
        <ConfirmModal
          open={isConfirmDiscardOrderModalOpen}
          title={approvalDiscardOrderItem}
          description={approvalDiscardOrderItemDescription}
          handleClose={() => setIsConfirmDiscardOrderModalOpen(false)}
          handleConfirm={handleConfirmDiscardOrder}
        />
      </Stack>
    </Box>
  );
};

export default OrderMenuTab;
