import { ChangeEvent, memo, useMemo, useState } from 'react';

import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import {
  Box,
  Table as MuiTable,
  Pagination,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Cell, flexRender, getCoreRowModel, Row, SortingState, Updater, useReactTable } from '@tanstack/react-table';

import { CustomColumnDef } from '@/types/table';

const genericMemo: <T>(component: T) => T = memo;

type UserTableProps<T> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  isFetching?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  pageCount?: number;
  page?: (page: number) => void;
  search?: (search: string) => void;
  onClickRow?: (cell: Cell<T, unknown>, row: Row<T>) => void;
  searchLabel?: string;
  EmptyText?: string;
  handleRow?: () => void;
  onSortingChange?: (sorting: SortingState) => void;
};

const UserTable = <T extends object>({
  data,
  columns,
  isFetching = false,
  skeletonCount = 10,
  skeletonHeight = 28,
  pageCount,
  search,
  onClickRow,
  page,
  searchLabel = 'Search',
  EmptyText = 'No Data is found',
  handleRow,
  onSortingChange,
}: UserTableProps<T>) => {
  const [paginationPage, setPaginationPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const { getHeaderGroups, getRowModel, getAllColumns } = useReactTable<T>({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      const newSorting = updater instanceof Function ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
  });

  const columnCount = getAllColumns().length;
  const noDataFound = !isFetching && (!memoizedData || memoizedData.length === 0);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    search?.(e.target.value);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, currentPage: number) => {
    const newPage = currentPage === 0 ? 1 : currentPage;
    setPaginationPage(newPage);
    page?.(newPage);
  };

  return (
    <TableContainer className="overflow-y-auto bg-white px-4 pb-4">
      <MuiTable>
        {!isFetching && (
          <TableHead>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    className="font-bold text-md border-black-300 px-2 py-5"
                    sx={{ textAlign: (header.column.columnDef as CustomColumnDef<T>).align || 'left' }}
                    onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ArrowDownward className="h-4 w-4" />,
                      desc: <ArrowUpward className="h-4 w-4" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
        )}
        <TableBody>
          {!isFetching
            ? getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={handleRow}
                  className="hover:bg-black-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => onClickRow?.(cell, row)}
                      className="text-black-500 text-md border-0 p-2"
                      sx={{ textAlign: (cell.column.columnDef as CustomColumnDef<T>).align || 'left' }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : Array.from({ length: skeletonCount }, (_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columnCount }, (_, j) => (
                    <TableCell key={j}>
                      <Skeleton height={skeletonHeight} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </MuiTable>
      {noDataFound && (
        <Box
          my={4}
          textAlign="center"
        >
          {EmptyText}
        </Box>
      )}
      {pageCount && page && (
        <Pagination
          count={pageCount}
          page={paginationPage}
          onChange={handlePageChange}
          className="flex justify-center"
        />
      )}
    </TableContainer>
  );
};

export default genericMemo(UserTable);
