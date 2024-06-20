import { useState } from 'react';

import { SortingState } from '@tanstack/react-table';

import { UseTablePropsType, UseTableType } from '@/types/table';

const useTable = ({
  initPageSize = 5,
  initSearchField = '',
  initSearchQuery = '',
  initCurrentPage = 1,
  initSortKey = 'updated_at',
  intiSortType = 'asc',
}: UseTablePropsType): UseTableType => {
  const [currentPage, setCurrentPage] = useState<number>(initCurrentPage);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState<number>(initPageSize);
  const [searchField, setSearchField] = useState<string>(initSearchField);
  const [searchQuery, setSearchQuery] = useState<string>(initSearchQuery);

  const sortKey = sorting.length > 0 ? sorting[0].id : initSortKey;
  const sortType = sorting.length > 0 && sorting[0].desc ? 'desc' : intiSortType;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const handleSearchChange = (field: string, query: string) => {
    setSearchField(field);
    setSearchQuery(query);
  };

  return {
    currentPage,
    sorting,
    pageSize,
    sortKey,
    sortType,
    searchQuery,
    searchField,
    handlePageChange,
    handleSortingChange,
    handlePageSizeChange,
    handleSearchChange,
  };
};

export default useTable;
