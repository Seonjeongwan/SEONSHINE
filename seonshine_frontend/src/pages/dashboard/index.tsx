import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import { zodResolver } from '@hookform/resolvers/zod';
import { RestaurantRounded } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { before } from 'node:test';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Table from '@/components/organims/table';

import { days } from '@/constants/date';
import { avatarBaseURL } from '@/constants/image';
import { useDeviceType } from '@/hooks/useDeviceType';
import { OrderListType, UserOrderTabEnum } from '@/types/order';
import { RoleEnum, UserManagementTabEnum } from '@/types/user';

import {
  useGetOrderListDetailApi,
  useGetOrderListSummaryApi,
  useGetOrderPeriodApi,
} from '@/apis/hooks/orderListApi.hook';
import { useGetDashBoardSummary, useGetMenuListlApi, useGetTodayMenuListApi } from '@/apis/hooks/userApi.hook';
import useAuthStore from '@/store/auth.store';

import { DateSchema, DateSchemaType } from '../orderManagement/components/OrderListTab/schema';
import { OrderListHeader } from './OrderListHeader';
import { OrderListRestaurantTableHeader } from './OrderListRestaurantTableHeader';

const Dashboard = () => {
  const { isMobile } = useDeviceType();
  const { currentUser } = useAuthStore();
  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          right: '0',
          zIndex: '10',
          background: '#D9D9D966',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${isMobile ? '24px' : '40px'}`,
          opacity: '1',
        }}
        onClick={onClick}
      >
        <svg
          width="14"
          height="51"
          viewBox="0 0 14 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.25 1.875L12.3333 25.5L1.25 49.125"
            stroke="#B1B6B9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          left: '0',
          zIndex: '10',
          background: '#D9D9D966',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${isMobile ? '24px' : '40px'}`,
          opacity: '1',
        }}
        onClick={onClick}
      >
        <svg
          width="14"
          height="51"
          viewBox="0 0 14 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.75 1.875L1.6667 25.5L12.75 49.125"
            stroke="#B1B6B9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  }
  const settings = {
    className: 'center',
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 5,
    swipeToSlide: true,
    scrollToSlide: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    afterChange: function (index: number) {},
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          centerPadding: '20px',
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const todayIndex = new Date().getDay();
  const ITEMS_PER_PAGE = 10;
  const today = format(new Date(), 'yyyy-MM-dd');
  const queryClient = useQueryClient();
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: today },
  });

  const watchedDate = watch('date');

  const { data: orderList, isFetching } = useGetOrderListDetailApi({
    params: { date: watchedDate, branch_id: currentUser?.branch_id },
  });

  const { data: orderListSummary } = useGetOrderListSummaryApi({
    params: { date: watchedDate },
  });

  const columns = currentUser?.role_id === RoleEnum.RESTAURANT ? OrderListRestaurantTableHeader : OrderListHeader;
  const data: OrderListType[] = useMemo(() => {
    if (currentUser?.role_id === RoleEnum.RESTAURANT && orderListSummary) {
      return orderListSummary.data.map((order) => ({
        ordered_items: order.item_name,
        amount: order.count,
      }));
    }

    if ((currentUser?.role_id === RoleEnum.USER || currentUser?.role_id === RoleEnum.ADMIN) && orderList) {
      return orderList.data.map((order) => ({
        restaurant_name: order.restaurant_name,
        employee_name: order.username,
        ordered_items: order.item_name,
        date: order.submitted_time,
        branch_name: order.branch_name,
      }));
    }

    return [];
  }, [currentUser, orderListSummary, orderList]);

  const { data: todayMenuList } = useGetTodayMenuListApi({ enabled: true });
  const { data: restaurantSelfMenuList } = useGetMenuListlApi({
    restaurant_id: currentUser?.user_id || '',
  });
  const { data: dashboardSummary } = useGetDashBoardSummary({ enabled: true });
  const { data: orderPeriod } = useGetOrderPeriodApi();

  const navigate = useNavigate();
  const handleClickViewMore = () => {
    {
      currentUser?.role_id === RoleEnum.USER
        ? navigate('/order-menu', { state: { tab: UserOrderTabEnum.ORDER_LIST } })
        : currentUser?.role_id === RoleEnum.RESTAURANT
          ? navigate('/order')
          : navigate('/order', { state: { viewMode: 'detail' } });
    }
  };

  const isOrderEnabled = () => {
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

  const dayMapper = (dayNumber: number) => {
    return days[dayNumber];
  };

  const restaurantIsAssigned = () => {
    return dashboardSummary?.assigned_weekdays?.includes(todayIndex);
  };

  const menuList = currentUser?.role_id === RoleEnum.RESTAURANT ? restaurantSelfMenuList : todayMenuList?.menu_list;
  const renderAdminBoxes = () => (
    <>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/restaurant-assign');
        }}
      >
        <Stack className="flex-grow">Today's Restaurant</Stack>
        <Stack className="font-bold text-2xl">{dashboardSummary?.today_restaurant_name || 'None'}</Stack>
      </Box>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/order');
        }}
      >
        <Stack className="flex-grow">Ordered Users</Stack>
        <Stack className="self-end font-bold text-2xl">{dashboardSummary?.ordered_users_count}</Stack>
      </Box>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/user');
        }}
      >
        <Stack className="flex-grow">Active Users</Stack>
        <Stack className="self-end font-bold text-2xl">{dashboardSummary?.active_users_count}</Stack>
      </Box>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/user', { state: { tab: UserManagementTabEnum.USER_APPROVAL } });
        }}
      >
        <Stack className="flex-grow">Waiting for Approval</Stack>
        <Stack className="self-end font-bold text-2xl">{dashboardSummary?.waiting_approval_users_count}</Stack>
      </Box>
    </>
  );

  const renderUserBoxes = () => (
    <>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/order-menu', { state: { tab: UserOrderTabEnum.ORDER_MENU } });
        }}
      >
        <Stack className="flex-grow">Today's Restaurant</Stack>
        <Stack className="font-bold text-2xl">{dashboardSummary?.today_restaurant_name || 'None'}</Stack>
      </Box>

      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/order-menu', { state: { tab: UserOrderTabEnum.ORDER_MENU } });
        }}
      >
        <Stack className="flex-grow">Order Status</Stack>
        <Stack className="self-end font-bold text-2xl">
          {dashboardSummary?.current_order_status == 1 ? 'Ordered' : 'Not Ordered'}
        </Stack>
      </Box>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/order-menu', { state: { tab: UserOrderTabEnum.ORDER_MENU } });
        }}
      >
        <Stack className="flex-grow">Ordered Item</Stack>
        <Stack className="self-end font-bold text-2xl">{dashboardSummary?.current_order_item_name || 'None'}</Stack>
      </Box>
      <Box
        className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4 cursor-pointer"
        onClick={() => {
          navigate('/order-menu', { state: { tab: UserOrderTabEnum.ORDER_LIST } });
        }}
      >
        <Stack className="flex-grow">Ordered Users</Stack>
        <Stack className="self-end font-bold text-2xl">{dashboardSummary?.today_order_users_count}</Stack>
      </Box>
    </>
  );

  const renderRestaurantBoxes = () => (
    <>
      <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4">
        <Stack className="flex-grow">Assigned Date</Stack>
        <Stack className="font-bold text-2xl">
          {dashboardSummary?.assigned_weekdays?.map((day) => dayMapper(day)).join(', ')}
        </Stack>
      </Box>
      {restaurantIsAssigned() && (
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4">
          <Stack className="flex-grow">Order Status</Stack>
          <Stack className="self-end font-bold text-2xl">{isOrderEnabled() ? 'Waiting' : 'Ordered'}</Stack>
        </Box>
      )}
    </>
  );
  const renderHeaderSummaryBoxesBasedRole = (role_id: RoleEnum | undefined) => {
    if (role_id === RoleEnum.ADMIN) return renderAdminBoxes();
    if (role_id === RoleEnum.USER) return renderUserBoxes();
    if (role_id === RoleEnum.RESTAURANT) return renderRestaurantBoxes();
  };

  return (
    <Box className="px-4 py-2 md:px-8 md:py-4">
      <Stack className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6">
        {renderHeaderSummaryBoxesBasedRole(currentUser?.role_id)}
      </Stack>
      <Stack className="mt-6 w-full">
        <Box className="w-full">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {currentUser?.role_id == RoleEnum.RESTAURANT ? (
              <h2 className="text-2xl font-bold">Menu List</h2>
            ) : (
              <h2 className="text-2xl font-bold">Today's Menu</h2>
            )}
            <Link
              to={currentUser?.role_id === RoleEnum.USER ? '/order-menu' : '/menu'}
              className="text-blue-500 !underline"
            >
              View more
            </Link>
          </Stack>
          <Box
            className="flex flex-col bg-white rounded-md mt-2"
            sx={{
              '.slick-prev:before, .slick-next:before': {
                color: 'transparent',
              },
            }}
          >
            <Slider {...settings}>
              {menuList?.map((dish, index) => (
                <Box
                  key={index}
                  className="p-2 md:p-4 outline-none"
                >
                  {dish.image_url ? (
                    <img
                      src={`${avatarBaseURL}${dish.image_url}`}
                      alt={dish.name}
                      className="w-full h-32 md:h-40 object-cover rounded-md"
                    />
                  ) : (
                    <Stack className="w-full h-32 md:h-40 items-center bg-gray-200">
                      <RestaurantRounded
                        className="w-full h-1/2 opacity-30"
                        fontSize="large"
                      />
                    </Stack>
                  )}

                  <h3 className="text-left mt-2">{dish.name}</h3>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </Stack>
      <Stack className="flex-1 mt-6 min-h-fit">
        <Box className="w-full">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="mb-2"
          >
            <h2 className="text-2xl font-bold">Order List</h2>
            <div
              onClick={handleClickViewMore}
              className="text-blue-500 !underline cursor-pointer"
            >
              View more
            </div>
          </Stack>
          <Table<OrderListType>
            data={data}
            columns={columns}
            isFetching={isFetching}
            size="small"
            currentPage={0}
            onPageChange={() => {}}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
