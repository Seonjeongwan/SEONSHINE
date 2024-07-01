import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Table from '@/components/organims/table';

import { avatarBaseURL } from '@/constants/image';
import useTable from '@/hooks/useTable';
import { OrderListType } from '@/types/order';
import { RoleEnum } from '@/types/user';

import { useGetOrderListDetailApi } from '@/apis/hooks/orderListApi.hook';
import { useGetDashBoardSummary, useGetMenuListlApi, useGetTodayMenuListApi } from '@/apis/hooks/userApi.hook';
import useAuthStore from '@/store/auth.store';

import { DateSchema, DateSchemaType } from '../orderManagement/components/OrderListTab/schema';
import { OrderListHeader } from './OrderListHeader';

const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const settings = {
    className: 'center',
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 5,
    swipeToSlide: true,
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
  };

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

  const { currentPage, sortKey, sortType, pageSize, handlePageChange, handleSortingChange } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });
  const watchedDate = watch('date');

  const { data: orderList, isFetching } = useGetOrderListDetailApi({
    params: { date: watchedDate },
  });

  const columns = OrderListHeader;
  const data: OrderListType[] = orderList
    ? orderList.data.map((order) => ({
        restaurant_name: order.restaurant_name,
        employee_name: order.username,
        ordered_items: order.item_name,
        date: order.submitted_time,
      }))
    : [];

  const { data: todayMenuList } = useGetTodayMenuListApi({ enabled: true });
  const { data: dashboardSummary } = useGetDashBoardSummary({ enabled: true });

  const navigate = useNavigate();
  const handleNavigate = () => {
    {
      currentUser?.role_id === RoleEnum.USER ? navigate('/order-menu', { state: { tab: 1 } }) : navigate('/order');
    }
  };
  return (
    <Box className="px-4 py-2 md:px-8 md:py-4">
      <Stack className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6">
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4">
          <Stack className="flex-grow">Today's Restaurant</Stack>
          <Stack className="font-bold text-2xl">{dashboardSummary?.today_restaurant_name}</Stack>
        </Box>
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4">
          <Stack className="flex-grow">Ordered Users</Stack>
          <Stack className="self-end font-bold text-2xl">{dashboardSummary?.ordered_users_count}</Stack>
        </Box>
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4">
          <Stack className="flex-grow">Active Users</Stack>
          <Stack className="self-end font-bold text-2xl">{dashboardSummary?.active_users_count}</Stack>
        </Box>
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-md p-4">
          <Stack className="flex-grow">Waiting for Approval</Stack>
          <Stack className="self-end font-bold text-2xl">{dashboardSummary?.waiting_approval_users_count}</Stack>
        </Box>
      </Stack>
      <Stack className="mt-6 w-full">
        <Box className="w-full">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <h2 className="text-2xl font-bold">Today's Menu</h2>
            <Link
              to="/menu"
              className="text-blue-500 !underline"
            >
              View more
            </Link>
          </Stack>
          <Box
            className="flex flex-col bg-white rounded-md mt-2"
            sx={{
              '.slick-prev:before, .slick-next:before': {
                color: 'grey',
              },
            }}
          >
            <Slider {...settings}>
              {todayMenuList?.menu_list.map((dish, index) => (
                <Box
                  key={index}
                  className="p-2 md:p-4 outline-none"
                >
                  <img
                    src={`${avatarBaseURL}${dish.image_url}`}
                    alt={dish.name}
                    className="w-full h-32 md:h-40 object-cover rounded-md"
                  />
                  <h3 className="text-left mt-2">{dish.name}</h3>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      </Stack>
      <Stack className="flex-1 mt-6">
        <Box className="w-full">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="mb-2"
          >
            <h2 className="text-2xl font-bold">Order List</h2>
            <div
              onClick={handleNavigate}
              className="text-blue-500 !underline cursor-pointer"
            >
              View more
            </div>
          </Stack>
          <Table<OrderListType>
            data={data}
            columns={columns}
            isFetching={isFetching}
            currentPage={0}
            onPageChange={() => {}}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
