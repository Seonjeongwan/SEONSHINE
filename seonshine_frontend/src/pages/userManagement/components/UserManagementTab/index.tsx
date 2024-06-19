import { useState } from 'react';
import { toast } from 'react-toastify';

import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import SearchBar from '@/components/molecules/searchBar';
import ConfirmModal from '@/components/organims/confirmModal';
import { userType } from '@/components/organims/sideBar';
import Table from '@/components/organims/table';
import UserProfileModal from '@/components/organims/userProfileModal';

import useTable from '@/hooks/useTable';
import { ChangeStatusPayloadType, UserStatusEnum, UserType } from '@/types/user';

import { useChangeStatusApi, useGetUserListApi } from '@/apis/hooks/userApi.hook';

import { activeUserDescription, activeUserTitle, deactiveUserDescription, deactiveUserTitle } from './constants';
import { UserTableHeader } from './UserTableHeader';

const ITEMS_PER_PAGE = 5;

const UserManagementTab = () => {
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
    handleSearchChange,
  } = useTable(ITEMS_PER_PAGE);

  const { data, isFetching } = useGetUserListApi({
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
    [searchField]: searchQuery,
  });

  const { mutate: changeStatus } = useChangeStatusApi();

  const handleOpenModal = (userId: string) => {
    setSelectedUser({ user_id: userId, status: -1 });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleClickAction = (userId: string, userStatus: UserStatusEnum) => {
    setIsConfirmModalOpen(true);
    setSelectedUser({ user_id: userId, status: userStatus === '1' ? 9 : 1 });
  };

  const handleConfirm = () => {
    if (selectedUser) {
      changeStatus(selectedUser, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getUserList'] }),
        onError: () => toast.error('Cannot change user status.'),
      });
    }
    setIsConfirmModalOpen(false);
  };

  const handleSearch = (field: string, query: string) => handleSearchChange(field, query);

  const options = [
    { value: 'user_id', label: 'ID' },
    { value: 'username', label: 'Full name' },
    { value: 'branch_name', label: 'Branch' },
  ];
  const defaultOption = options[0].value;

  const columns = UserTableHeader(handleOpenModal, handleClickAction);

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
        User List
      </Typography>
      <Table<UserType>
        data={data?.data || []}
        columns={columns}
        isFetching={isFetching}
        pageCount={data ? Math.ceil(data.total / pageSize) : 0}
        onSortingChange={handleSortingChange}
        page={handlePageChange}
      />
      {isModalOpen && (
        <UserProfileModal
          userId={selectedUser?.user_id || ''}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <ConfirmModal
        open={isConfirmModalOpen}
        title={selectedUser?.status === 1 ? activeUserTitle : deactiveUserTitle}
        description={selectedUser?.status === 1 ? activeUserDescription : deactiveUserDescription}
        handleClose={() => setIsConfirmModalOpen(false)}
        handleConfirm={handleConfirm}
      />
    </Stack>
  );
};

export default UserManagementTab;
