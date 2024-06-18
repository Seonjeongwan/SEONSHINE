import { ChangeEvent, useState } from 'react';

import { SortingState } from '@tanstack/react-table';

import { IPlainObject } from '@/types/common';

export type UseTableType = {
  currentPage: number;
  sorting: SortingState;
  pageSize: number;
  sortKey: string;
  sortType: 'desc' | 'asc';
  searchQuery: string;
  searchField: string;
  handlePageChange: (page: number) => void;
  handleSortingChange: (newSorting: SortingState) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleSearchChange: (field: string, query: string) => void;
};

const useTable = (initPageSize?: number, initSearchField?: string, initSearchQuery?: string): UseTableType => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState<number>(initPageSize || 5);
  const [searchField, setSearchField] = useState<string>(initSearchField || '');
  const [searchQuery, setSearchQuery] = useState<string>(initSearchQuery || '');

  const sortKey = sorting.length > 0 ? sorting[0].id : 'user_id';
  const sortType = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc';

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
