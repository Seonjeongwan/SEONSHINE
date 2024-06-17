import { useEffect, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { SortingState } from '@tanstack/react-table';

import UserTable from '../UserTable';
import { DummyData, fetchUserData } from './constants';
import { Columns, UserType } from './TableHeader';

const ITEMS_PER_PAGE = 10;

const UserManagementTab = () => {
  const [items, setItems] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserData(currentPage, ITEMS_PER_PAGE, sorting);
        setItems(data.items);
        setTotalPageCount(Math.ceil(data.total / ITEMS_PER_PAGE));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, sorting]);

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
        data={items}
        columns={Columns}
        searchLabel="Search by Name or job title"
        EmptyText="No staff found!"
        isFetching={loading}
        pageCount={totalPageCount}
        page={handlePageChange}
        onSortingChange={handleSortingChange}
      />
    </Stack>
  );
};

export default UserManagementTab;
