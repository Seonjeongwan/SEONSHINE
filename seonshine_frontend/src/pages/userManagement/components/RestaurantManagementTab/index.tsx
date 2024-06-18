import { useState } from 'react';

import { SortingState } from '@tanstack/react-table';

import useTable from '@/hooks/useTable';

const ITEMS_PER_PAGE = 10;

const RestaurantManagementTab = () => {
  const { currentPage, sortKey, sortType, pageSize, handlePageChange, handleSortingChange } = useTable();

  return <div>RestaurantManagementTab</div>;
};

export default RestaurantManagementTab;
