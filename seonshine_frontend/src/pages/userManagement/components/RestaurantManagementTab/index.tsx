import { useState } from 'react';
import { toast } from 'react-toastify';

import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import SearchBar from '@/components/molecules/searchBar';
import ConfirmModal from '@/components/organims/confirmModal';
import RestaurantProfileModal from '@/components/organims/restaurantProfileModal';
import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { ChangeStatusPayloadType, RestaurantType, UserStatusEnum } from '@/types/user';

import { useChangeStatusApi, useGetRestaurantListApi } from '@/apis/hooks/userApi.hook';

import {
  activeRestaurantDescription,
  activeRestaurantTitle,
  deactiveRestaurantDescription,
  deactiveRestaurantTitle,
  searchRestaurantOptions,
} from './constants';
import { RestaurantTableHeader } from './RestaurantTableHeader';

const ITEMS_PER_PAGE = 10;

const RestaurantManagementTab = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
  } = useTable({ initCurrentPage: 1, initPageSize: ITEMS_PER_PAGE, initSortKey: 'user_id' });

  const { data, isFetching } = useGetRestaurantListApi({
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
    [searchField]: searchQuery,
  });

  const { mutate: changeStatus } = useChangeStatusApi();

  const handleSearch = (field: string, query: string) => handleSearchChange(field, query);

  const defaultOption = searchRestaurantOptions[0].value;

  const handleConfirm = () => {
    if (selectedRestaurant) {
      changeStatus(selectedRestaurant, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getRestaurantList'] }),
        onError: () => toast.error('Cannot change restaurant status.'),
      });
    }
    setIsConfirmModalOpen(false);
  };

  const handleClickAction = (userId: string, userStatus: UserStatusEnum) => {
    setIsConfirmModalOpen(true);
    setSelectedRestaurant({
      user_id: userId,
      status: userStatus == UserStatusEnum.ACTIVE ? UserStatusEnum.DEACTIVATED : UserStatusEnum.ACTIVE,
    });
  };

  const handleOpenModal = (userId: string) => {
    setSelectedRestaurant({ user_id: userId, status: -1 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const columns = RestaurantTableHeader(handleOpenModal, handleClickAction, (currentPage - 1) * pageSize);

  return (
    <Stack direction="column">
      <SearchBar
        onSearch={handleSearch}
        options={searchRestaurantOptions}
        optionDefault={defaultOption}
        searchPlaceHolder="Search for restaurant"
      />
      <Typography
        variant="heading4"
        component="h3"
        className="my-4"
      >
        Restaurant List
      </Typography>
      <Table<RestaurantType>
        data={data?.data || []}
        columns={columns}
        isFetching={isFetching}
        pageCount={data ? Math.ceil(data.total / pageSize) : 0}
        onSortingChange={handleSortingChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {isModalOpen && (
        <RestaurantProfileModal
          userId={selectedRestaurant?.user_id || ''}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <ConfirmModal
        open={isConfirmModalOpen}
        title={selectedRestaurant?.status === UserStatusEnum.ACTIVE ? activeRestaurantTitle : deactiveRestaurantTitle}
        description={
          selectedRestaurant?.status === UserStatusEnum.ACTIVE
            ? activeRestaurantDescription
            : deactiveRestaurantDescription
        }
        handleClose={() => {
          setIsConfirmModalOpen(false);
        }}
        handleConfirm={handleConfirm}
      />
    </Stack>
  );
};

export default RestaurantManagementTab;
