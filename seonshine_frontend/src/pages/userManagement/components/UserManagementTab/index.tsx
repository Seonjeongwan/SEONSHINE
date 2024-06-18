import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

import ConfirmModal from '@/components/organims/confirmModal';
import { userType } from '@/components/organims/sideBar';
import UserProfileModal from '@/components/organims/userProfileModal';

import useTable from '@/hooks/useTable';
import { ChangeStatusPayloadType, UserStatusEnum, UserType } from '@/types/user';

import { useChangeStatusApi, useGetUserListApi } from '@/apis/hooks/userApi.hook';

import UserTable from '../../../../components/organims/table';
import { TableHeader } from './TableHeader';

const ITEMS_PER_PAGE = 5;

const UserManagementTab = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ChangeStatusPayloadType>();

  const queryClient = useQueryClient();
  const [user, setUser] = useState<userType>({
    user_id: 'shinhanuser',
    role_id: '1',
    full_name: 'Shinhan User',
    email: 'shinhanuser@mail.com',
    branch_id: 'Centec',
    birth_date: '10/12/2001',
    address: 'Thu Duc, HCMC',
    phone_number: '0123456789',
    status: 'Active',
    profilePicture: '',
  });

  const { currentPage, sortKey, sortType, pageSize, handlePageChange, handleSortingChange, searchField, searchQuery } =
    useTable(ITEMS_PER_PAGE);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveUser = (editedUser: userType) => {
    setUser(editedUser);
  };

  const handleClickAction = (user_id: string, user_type: UserStatusEnum) => {
    setIsConfirmModalOpen(true);
    const status = user_type === '1' ? 2 : 1;
    setSelectedUser({ user_id, status });
  };

  const handleConfirm = () => {
    selectedUser &&
      exeChangeStatus(selectedUser, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['getUserList'] });
        },
        onError: () => {
          toast.error('Can not change user status.');
        },
      });
    setIsConfirmModalOpen(false);
  };

  const { data, isFetching } = useGetUserListApi({
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
    [searchField]: searchQuery,
  });

  const { mutate: exeChangeStatus, isPending } = useChangeStatusApi();

  const columns = TableHeader(handleOpenModal, handleClickAction);

  return (
    <Stack direction="column">
      <Typography
        variant="heading4"
        component="h3"
        className="my-4"
      >
        User List
      </Typography>
      <UserTable<UserType>
        data={data?.data || []}
        columns={columns}
        EmptyText="No staff found!"
        isFetching={isFetching}
        pageCount={data ? Math.ceil(data.total / pageSize) : 0}
        onSortingChange={handleSortingChange}
        page={handlePageChange}
      />
      {isModalOpen && (
        <UserProfileModal
          onSave={handleSaveUser}
          user={user}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
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

export default UserManagementTab;
