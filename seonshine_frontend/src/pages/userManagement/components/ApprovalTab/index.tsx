import { useState } from 'react';
import { toast } from 'react-toastify';

import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import SearchBar from '@/components/molecules/searchBar';
import ConfirmModal from '@/components/organims/confirmModal';
import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { ChangeStatusPayloadType, WaitingUserType } from '@/types/user';

import { useChangeStatusApi, useWaitingUserListApi } from '@/apis/hooks/userApi.hook';

import { ApprovalTableHeader } from './ApprovalTableHeader';
import { approvalUserDescription, approvalUserTitle, searchOptions } from './constants';

const ITEMS_PER_PAGE = 10;

const ApprovalTab = () => {
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
  } = useTable({ initPageSize: ITEMS_PER_PAGE, initSortKey: 'user_id' });

  const { data, isFetching } = useWaitingUserListApi({
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
    [searchField]: searchQuery,
  });

  const { mutate: changeStatus } = useChangeStatusApi();

  const handleSearch = (field: string, query: string) => handleSearchChange(field, query);

  const defaultOption = searchOptions[0].value;

  const handleConfirm = () => {
    if (selectedUser) {
      changeStatus(selectedUser, {
        onSuccess: () => {
          toast.success('Approval user successfully.');
          queryClient.invalidateQueries({ queryKey: ['getWaitingUserList'] });
        },
        onError: () => toast.error('Cannot approval user.'),
      });
    }
    setIsConfirmModalOpen(false);
  };

  const handleClickAction = (userId: string) => {
    setIsConfirmModalOpen(true);
    setSelectedUser({
      user_id: userId,
      status: 1,
    });
  };

  const columns = ApprovalTableHeader(handleClickAction);

  return (
    <Stack direction="column">
      <SearchBar
        onSearch={handleSearch}
        options={searchOptions}
        optionDefault={defaultOption}
      />
      <Typography
        variant="heading4"
        component="h3"
        className="my-4"
      >
        Waiting for Approval
      </Typography>
      <Table<WaitingUserType>
        data={data?.data || []}
        columns={columns}
        isFetching={isFetching}
        pageCount={data ? Math.ceil(data.total / pageSize) : 0}
        onSortingChange={handleSortingChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        title={approvalUserTitle}
        description={approvalUserDescription}
        handleClose={() => setIsConfirmModalOpen(false)}
        handleConfirm={handleConfirm}
      />
    </Stack>
  );
};

export default ApprovalTab;
