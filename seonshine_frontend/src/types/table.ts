import { ColumnDef, SortingState } from '@tanstack/react-table';

export type CustomColumnDef<T> = ColumnDef<T> & {
  align?: 'left' | 'center' | 'right';
};

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

export type UseTablePropsType = {
  initPageSize?: number;
  initSearchField?: string;
  initSearchQuery?: string;
  initCurrentPage?: number;
  initSortKey: string;
  intiSortType?: 'desc' | 'asc';
};
