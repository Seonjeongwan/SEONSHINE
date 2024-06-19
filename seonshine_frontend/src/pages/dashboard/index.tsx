import React, { useState } from 'react';
import Slider from 'react-slick';

import { Box, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { OrderListType } from '@/types/order';
import { ChangeStatusPayloadType } from '@/types/user';

import { useGetOrderListApi } from '@/apis/hooks/orderListApi.hook';

import { OrderListHeader } from './OrderListHeader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const ITEMS_PER_PAGE = 10;

  const settings = {
    className: 'center',
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 5,
    swipeToSlide: true,
    afterChange: function (index) {
      console.log(`Slider Changed to: ${index + 1}, background: #222; color: #bada55`);
    },
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ChangeStatusPayloadType>();

  const queryClient = useQueryClient();

  const { currentPage, sortKey, sortType, pageSize, handlePageChange, handleSortingChange, searchField, searchQuery } =
    useTable({ initPageSize: ITEMS_PER_PAGE, initSortKey: 'user_id' });

  const { data, isFetching } = useGetOrderListApi({
    [searchField]: searchQuery,
  });

  const columns = OrderListHeader();
  const dishes = [
    {
      name: 'Pho',
      img: 'https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250230038502.jpg ',
    },
    {
      name: 'Bun Bo Hue',
      img: 'https://cdn.tgdd.vn/Files/2018/04/01/1078873/nau-bun-bo-hue-cuc-de-tai-nha-tu-vien-gia-vi-co-san-202109161718049940.jpg',
    },
    {
      name: 'Noodle',
      img: 'https://cdn.mediamart.vn/images/news/di-mon-vi-hung-dn-lam-mi-kho-xa-xiu-ngon-nhu-ngoai-hang_16bbe0f5.jpg',
    },
    {
      name: 'Banh mi Sai Gon',
      img: 'https://static.vinwonders.com/production/banh-mi-sai-gon-2.jpg',
    },
    {
      name: 'Grill Pork Rice',
      img: 'https://i.ytimg.com/vi/h__kLq8NG2I/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDqn7vasJHB1JVJB8uobiB67rxztw',
    },
    {
      name: 'Bun Dau Mam Tom',
      img: 'https://vietnamnomad.com/wp-content/uploads/2023/05/What-is-bun-dau-mam-tom.jpg',
    },
  ];

  return (
    <Box className="px-4 py-2 md:px-8 md:py-4">
      <Stack className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6">
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Today's Restaurant</Stack>
          <Stack className="font-bold text-2xl">PAPA'S CHICKEN</Stack>
        </Box>
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Ordered Users</Stack>
          <Stack className="self-end font-bold text-2xl">12</Stack>
        </Box>
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Active Users</Stack>
          <Stack className="self-end font-bold text-2xl">32</Stack>
        </Box>
        <Box className="w-full md:w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Waiting for Approval</Stack>
          <Stack className="self-end font-bold text-2xl">8</Stack>
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
              to="/restaurant-menu"
              className="text-blue-500 hover:underline"
            >
              Show more
            </Link>
          </Stack>
          <Box className="flex flex-col bg-white rounded-lg mt-2">
            <Slider {...settings}>
              {dishes.map((dish, index) => (
                <Box
                  key={index}
                  className="p-2 md:p-4 outline-none"
                >
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="w-full h-32 md:h-40 object-cover rounded-lg"
                  />
                  <h3 className="text-center mt-2">{dish.name}</h3>
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
            className='mb-2'
          >
            <h2 className="text-2xl font-bold">Order List</h2>
            <Link
              to="/order-list"
              className="text-blue-500 hover:underline"
            >
              Show more
            </Link>
          </Stack>
          <Table<OrderListType>
            data={data?.data || []}
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
