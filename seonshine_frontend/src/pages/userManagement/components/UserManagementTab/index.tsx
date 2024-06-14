import { useEffect, useState } from 'react';

import UserTable from '../UserTable';
import { DummyData } from './constants';
import { Columns, UserType } from './TableHeader';

const ITEMS_PER_PAGE = 10;

const UserManagementTab = () => {
  const [items, setItems] = useState<typeof DummyData>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await DummyData;
        setItems(response);

        setTotalPageCount(Math.ceil(DummyData.length / ITEMS_PER_PAGE));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  return (
    <UserTable<UserType>
      data={items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
      columns={Columns}
      searchLabel="Search by Name or job title"
      EmptyText="No staff found!"
      isFetching={loading}
      pageCount={totalPageCount}
      page={handlePageChange}
    />
  );
};

export default UserManagementTab;
