import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import SearchBar from '@/components/molecules/searchBar';
import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { paths } from '@/routes/paths';
import { ChangeStatusPayloadType} from '@/types/user';

import { useChangeStatusApi, useGetUserListApi } from '@/apis/hooks/userApi.hook';

import { UserTableHeader } from '../userManagement/components/UserManagementTab/UserTableHeader';
import { OrderListHeader } from './OrderListHeader';

const Dashboard = () => {
  const ITEMS_PER_PAGE = 10;

  const handleSearch = (field: string, query: string) => {
    console.log(`Searching for ${query} in field ${field}`);
  };
  const options = [
    { value: 'user_id', label: 'ID' },
    { value: 'fullname', label: 'Fullname' },
    { value: 'branch', label: 'Branch' },
  ];
  const defaultOption = options[0].value;
  const defaultValue = 'shinhanadmin';
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ChangeStatusPayloadType>();

  const queryClient = useQueryClient();

  const {
    currentPage,
    sortKey,
    sortType,
    pageSize,
    handlePageChange,
    handleSortingChange,
    searchField,
    searchQuery,
  } = useTable({ initPageSize: ITEMS_PER_PAGE, initSortKey: 'user_id' });

  const { data, isFetching } = useGetUserListApi({
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
    [searchField]: searchQuery,
  });

  const columns = OrderListHeader();
  const dishes = [
    { name: 'Dish 1', img: 'https://via.placeholder.com/150' },
    { name: 'Dish 2', img: 'https://via.placeholder.com/150' },
    { name: 'Dish 3', img: 'https://via.placeholder.com/150' },
    { name: 'Dish 4', img: 'https://via.placeholder.com/150' },
    { name: 'Dish 5', img: 'https://via.placeholder.com/150' },
    { name: 'Dish 6', img: 'https://via.placeholder.com/150' },
  ];
  return (
    <Box className="px-8">
      <Stack className="flex h-1/6 gap-6">
        <Box className="h-1/6 w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Today's Restaurant</Stack>
          <Stack className="font-bold text-2xl">PAPA'S CHICKEN</Stack>
        </Box>
        <Box className="h-1/6 w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Ordered Users</Stack>
          <Stack className="self-end font-bold text-2xl">12</Stack>
        </Box>
        <Box className="h-1/6 w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Active Users</Stack>
          <Stack className="self-end font-bold text-2xl">32</Stack>
        </Box>
        <Box className="h-1/6 w-1/4 flex flex-col bg-white rounded-lg p-4">
          <Stack className="flex-grow">Waiting for Approval</Stack>
          <Stack className="self-end font-bold text-2xl">8</Stack>
        </Box>
      </Stack>
      <Stack className="h-1/3 mt-6 w-max">
        {/* <Slider></Slider> */}
        <Box className="h-2/5">
          <h2 className="text-2xl font-bold">Today's Menu</h2>
          <Box className="w-full h-full flex flex-col bg-white rounded-lg p-4"></Box>
        </Box>
      </Stack>
      <Stack className="flex-1 mt-6">
        <Box className="w-full">
          <h2 className="text-2xl font-bold">Order List</h2>
          <Table<OrderListType>
            data={data?.data || []}
            columns={columns}
            isFetching={isFetching}
            currentPage={currentPage}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
