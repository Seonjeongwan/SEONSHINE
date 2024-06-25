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
import { flexRender, getCoreRowModel, SortingState, Updater, useReactTable } from '@tanstack/react-table';

import { CustomColumnDef } from '@/types/table';

const genericMemo: <T>(component: T) => T = memo;

type UserTableProps<T> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  isFetching?: boolean;
  skeletonHeight?: number;
  pageCount?: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  emptyText?: string;
  onClickRow?: (row: T) => void;
  onSortingChange?: (sorting: SortingState) => void;
  size?: 'small' | 'normal';
};

const Table = <T extends object>({
  data,
  columns,
  isFetching = false,
  skeletonHeight = 28,
  pageCount,
  currentPage,
  onPageChange,
  emptyText = 'No Data is found',
  onClickRow,
  onSortingChange,
  size = 'normal',
}: UserTableProps<T>) => {
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

  const handlePageChange = (event: ChangeEvent<unknown>, newPage: number) => {
    onPageChange?.(newPage);
  };

  return (
    <Box className="overflow-y-auto bg-white px-4 pb-4">
      <TableContainer>
        <MuiTable>
          {!isFetching && (
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className={`font-bold text-md border-black-300 px-2 ${size === 'normal' ? 'py-5' : 'py-3'} whitespace-nowrap`}
                      sx={{ textAlign: (header.column.columnDef as CustomColumnDef<T>).align || 'left' }}
                      onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUpward className="h-4 w-4 ml-1" />,
                        desc: <ArrowDownward className="h-4 w-4 ml-1" />,
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
                    onClick={() => onClickRow?.(row.original)}
                    className="hover:bg-black-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`text-black-500 text-md border-0 px-2 ${size === 'normal' ? 'py-1' : 'py-0'}`}
                        sx={{ textAlign: (cell.column.columnDef as CustomColumnDef<T>).align || 'left' }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : Array.from({ length: data.length || 4 }, (_, i) => (
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
            my={16}
            textAlign="center"
          >
            {emptyText}
          </Box>
        )}
      </TableContainer>
      {!!pageCount && handlePageChange && !isFetching && (
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          className="flex justify-center mt-4"
        />
      )}
    </Box>
  );
};

export default genericMemo(Table);
