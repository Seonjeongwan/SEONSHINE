import { useState } from 'react';
import { toast } from 'react-toastify';

import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

import SearchBar from '@/components/molecules/searchBar';
import ConfirmModal from '@/components/organims/confirmModal';
import Table from '@/components/organims/table';
import UserProfileModal from '@/components/organims/userProfileModal';

import useTable from '@/hooks/useTable';
import { ChangeStatusPayloadType, RestaurantType, UserStatusEnum } from '@/types/user';

import { useChangeStatusApi, useGetRestaurantListApi } from '@/apis/hooks/userApi.hook';

import {
  activeRestaurantDescription,
  activeRestaurantTitle,
  deactiveRestaurantDescription,
  deactiveRestaurantTitle,
} from './constants';
import { RestaurantTableHeader } from './RestaurantTableHeader';

const ITEMS_PER_PAGE = 10;

const RestaurantManagementTab = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<ChangeStatusPayloadType>();

  const queryClient = useQueryClient();

  const {
    currentPage,
    sortKey,
    sortType,
    pageSize,
    handlePageChange,
    handleSortingChange,
    handleSearchChange,
    searchField,
    searchQuery,
  } = useTable();

  const { data, isFetching } = useGetRestaurantListApi({
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
    [searchField]: searchQuery,
  });

  const { mutate: changeStatus } = useChangeStatusApi();

  const handleSearch = (field: string, query: string) => handleSearchChange(field, query);

  const options = [
    { value: 'user_id', label: 'ID' },
    { value: 'username', label: 'Restaurant name' },
  ];
  const defaultOption = options[0].value;

  const handleConfirm = () => {
    if (selectedRestaurant) {
      changeStatus(selectedRestaurant, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getRestaurantList'] }),
        onError: () => toast.error('Cannot change restaurant status.'),
      });
    }
    setIsConfirmModalOpen(false);
  };

  const handleOpenModal = () => {};

  const handleClickAction = (user_id: string, user_type: UserStatusEnum) => {
    setIsConfirmModalOpen(true);
    setSelectedRestaurant({ user_id, status: user_type === '1' ? 9 : 1 });
  };

  const columns = RestaurantTableHeader(handleOpenModal, handleClickAction);

  return (
    <Stack direction="column">
      <SearchBar
        onSearch={handleSearch}
        options={options}
        optionDefault={defaultOption}
      />
      <Typography
        variant="heading4"
        component="h3"
        className="my-8"
      >
        Restaurant List
      </Typography>
      <Table<RestaurantType>
        data={data?.data || []}
        columns={columns}
        isFetching={isFetching}
        pageCount={data ? Math.ceil(data.total / pageSize) : 0}
        onSortingChange={handleSortingChange}
        page={handlePageChange}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        title={selectedRestaurant?.status === 1 ? activeRestaurantTitle : deactiveRestaurantTitle}
        description={selectedRestaurant?.status === 1 ? activeRestaurantDescription : deactiveRestaurantDescription}
        handleClose={() => {
          setIsConfirmModalOpen(false);
        }}
        handleConfirm={handleConfirm}
      />
    </Stack>
  );
};

export default RestaurantManagementTab;
