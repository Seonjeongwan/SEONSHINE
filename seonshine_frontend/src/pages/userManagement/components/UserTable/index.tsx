import React, { ChangeEvent, memo, useMemo, useState } from 'react';

import {
  Box,
  Table as MuiTable,
  Pagination,
  Paper,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Cell, ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';

type UserTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  isFetching?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  headerComponent?: JSX.Element;
  pageCount?: number;
  page?: (page: number) => void;
  search?: (search: string) => void;
  onClickRow?: (cell: Cell<T, unknown>, row: Row<T>) => void;
  searchLabel?: string;
  EmptyText?: string;
  handleRow?: () => void;
};

const UserTable = <T extends object>({
  data,
  columns,
  isFetching,
  skeletonCount = 10,
  skeletonHeight = 28,
  headerComponent,
  pageCount,
  search,
  onClickRow,
  page,
  searchLabel = 'Search',
  EmptyText = 'No Data is found',
  handleRow,
}: UserTableProps<T>) => {
  const [paginationPage, setPaginationPage] = useState(1);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoisedHeaderComponent = useMemo(() => headerComponent, [headerComponent]);

  const { getHeaderGroups, getRowModel, getAllColumns } = useReactTable<T>({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  const skeletons = Array.from({ length: skeletonCount }, (x, i) => i);
  const columnCount = getAllColumns().length;
  const noDataFound = !isFetching && (!memoizedData || memoizedData.length === 0);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    search && search(e.target.value);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, currentPage: number) => {
    setPaginationPage(currentPage === 0 ? 1 : currentPage);
    page?.(currentPage === 0 ? 1 : currentPage);
  };

  return (
    <TableContainer style={{ padding: '0 0 1rem 0' }}>
      <Box style={{ overflowX: 'auto' }}>
        <MuiTable>
          {!isFetching && (
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-black-300"
                >
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className="text-white text-sm font-cambon"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
          )}
          <TableBody>
            {!isFetching ? (
              getRowModel()?.rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={handleRow}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      onClick={() => onClickRow?.(cell, row)}
                      key={cell.id}
                      className="text-[#2E353A] text-base font-graphik"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {skeletons.map((skeleton) => (
                  <TableRow key={skeleton}>
                    {Array.from({ length: columnCount }, (x, i) => i).map((elm) => (
                      <TableCell key={elm}>
                        <Skeleton height={skeletonHeight} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </MuiTable>
      </Box>
      {noDataFound && (
        <Box
          my={2}
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
        />
      )}
    </TableContainer>
  );
};

export default UserTable;
