import { useEffect, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { SortingState } from '@tanstack/react-table';

import { UserType } from '@/types/user';

import { useGetUserListApi } from '@/apis/hooks/userApi.hook';

import UserTable from '../UserTable';
import { Columns } from './TableHeader';

const ITEMS_PER_PAGE = 5;

const UserManagementTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  console.log({ currentPage });

  const sortKey = sorting.length > 0 ? sorting[0].id : 'user_id';
  const sortType = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc';

  const { data, isFetching } = useGetUserListApi({
    page_size: ITEMS_PER_PAGE,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
  };

  return (
    <Stack direction="column">
      <Typography
        variant="h4"
        component="h3"
        className="my-4"
      >
        User List
      </Typography>
      <UserTable<UserType>
        data={data?.data || []}
        columns={Columns}
        searchLabel="Search by Name or job title"
        EmptyText="No staff found!"
        isFetching={isFetching}
        pageCount={data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0}
        page={handlePageChange}
        onSortingChange={handleSortingChange}
      />
    </Stack>
  );
};

export default UserManagementTab;
