import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { SortingState } from '@tanstack/react-table';

import SearchBar from '@/components/molecules/searchBar';
import ConfirmModal from '@/components/organims/confirmModal';
import Table from '@/components/organims/table';
import UserProfileModal from '@/components/organims/userProfileModal';

import useTable from '@/hooks/useTable';
import { ChangeStatusPayloadType, RestaurantType, UserStatusEnum } from '@/types/user';

import { useGetRestaurantListApi } from '@/apis/hooks/userApi.hook';

import { RestaurantTableHeader } from './RestaurantTableHeader';

const ITEMS_PER_PAGE = 10;

const RestaurantManagementTab = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<ChangeStatusPayloadType>();

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

  const handleSearch = (field: string, query: string) => handleSearchChange(field, query);

  const options = [
    { value: 'user_id', label: 'ID' },
    { value: 'username', label: 'Restaurant name' },
  ];
  const defaultOption = options[0].value;

  const handleConfirm = () => setIsConfirmModalOpen(false);

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
        title="Deactivate Confirmation"
        description="Do you really want to deactivate this user?"
        handleClose={() => {
          setIsConfirmModalOpen(false);
        }}
        handleConfirm={handleConfirm}
      />
    </Stack>
  );
};

export default RestaurantManagementTab;
