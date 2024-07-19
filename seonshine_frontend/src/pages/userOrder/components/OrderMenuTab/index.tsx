import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { RestaurantRounded } from '@mui/icons-material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  Grid,
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

  const isOrderEnabled = () => {
    if (!orderPeriod) return false;
    const { start_hour, start_minute, end_hour, end_minute } = orderPeriod.data;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return (
      (currentHour > start_hour || (currentHour === start_hour && currentMinute >= start_minute)) &&
      (currentHour < end_hour || (currentHour === end_hour && currentMinute <= end_minute))
    );
  };

  const handleClickOrderButton = (dish: GetMenuListResponseType) => {
    if (!isOrderEnabled()) {
      toast.warning('Ordering is only available during the designated order period.');
      return;
    }
    setSelectedItem(dish);
    setIsConfirmOrderModalOpen(true);
  };

  const handleClickDiscardButton = () => {
    if (!isOrderEnabled()) {
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

  const searchGoogleMaps = () => {
    const searchQuery = todayMenuList?.restaurant_address;
    const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(url);
  };

  return (
    <Box className="px-2 md:px-4">
      <Stack
        direction="column"
        spacing={4}
      >
        {currentOrder && (
          <Box className="px-2 mb-6">
            <Typography className="font-bold text-xl md:text-2xl mb-4">Ordered Item</Typography>
            <Grid
              container
              spacing={2}
              className="rounded-md p-6 box-border bg-white w-full sm:w-2/3 md:w-2/3 lg:w-1/2 shadow-xl"
            >
              <Grid
                item
                xs={12}
                md={6}
                className="flex items-center justify-center h-48 md:h-64"
              >
                {currentOrder.image_url ? (
                  <img
                    src={`${avatarBaseURL}${currentOrder.image_url}`}
                    className="h-full w-full object-cover"
                    alt={currentOrder.item_name}
                  />
                ) : (
                  <Stack className="w-full h-full items-center bg-gray-200">
                    <RestaurantRounded
                      className="w-full h-1/2 opacity-30"
                      fontSize="large"
                    />
                  </Stack>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                className="flex flex-col justify-between"
              >
                <Box className="ml-0 md:ml-4 mt-4 md:mt-0">
                  <Typography className="font-bold text-2xl md:text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis">
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
                  className="self-end rounded-2xl font-bold mt-4 md:mt-0 w-full md:w-auto"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        <Box className="px-2">
          <Typography className="font-bold text-xl md:text-2xl">
            Menu list of {todayMenuList?.current_day.replace(/-/g, '.')} - {todayMenuList?.restaurant_name}
            <LocationOnIcon
              className="ml-2 cursor-pointer text-[28px]"
              onClick={() => {
                searchGoogleMaps();
              }}
            />
          </Typography>
        </Box>
        <Stack className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {todayMenuList?.menu_list.map((dish, index) => (
            <Stack
              key={dish.name + index}
              className="rounded-md p-0 pb-2 md:p-6 m-2 box-border cursor-pointer bg-white transition-transform transform hover:scale-105 hover:shadow-lg text-center"
              direction="column"
              gap={2}
              onClick={() => handleClickOrderButton(dish)}
            >
              <Box className="w-full h-36 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
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
