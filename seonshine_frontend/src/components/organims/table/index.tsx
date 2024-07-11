import { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from 'react';

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
  skeletonHeight = 10,
  pageCount,
  currentPage,
  onPageChange,
  emptyText = 'No Data is found',
  onClickRow,
  onSortingChange,
  size = 'normal',
}: UserTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableData, setTableData] = useState<T[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const memoizedColumns = useMemo(() => columns, [columns]);

  const { getHeaderGroups, getRowModel, getAllColumns } = useReactTable<T>({
    data: tableData,
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

  const noDataFound = !isFetching && (!tableData || tableData.length === 0);

  const showSkeleton = isFetching && (!tableData || tableData.length === 0);

  const columnCount = getAllColumns().length;

  const handlePageChange = (event: ChangeEvent<unknown>, newPage: number) => {
    onPageChange?.(newPage);
  };

  useEffect(() => {
    if (!isFetching) {
      setTableData(data);
    }
  }, [data, isFetching]);

  useEffect(() => {
    const handleResize = () => {
      if (tableContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const containerTop = tableContainerRef.current.getBoundingClientRect().top;
        const maxHeight = viewportHeight - containerTop - 28;
        tableContainerRef.current.style.maxHeight = `${maxHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    size === 'normal' && handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box className="bg-white px-4 pb-4 w-full rounded-md">
      <TableContainer
        ref={tableContainerRef}
        className={`overflow-auto ${tableData.length > 5 || noDataFound ? 'min-h-60' : ''}`}
      >
        <MuiTable stickyHeader>
          {!showSkeleton && (
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className={`font-bold text-md border-black-300 px-2 ${size === 'normal' ? 'py-5' : 'py-3'} 
                        ${(header.column.columnDef as CustomColumnDef<T>).align === 'center' && header.column.getCanSort() ? 'pl-7' : ''}
                        ${header.column.getCanSort() ? 'cursor-pointer' : ''} whitespace-nowrap group`}
                      sx={{
                        textAlign: (header.column.columnDef as CustomColumnDef<T>).align || 'left',
                      }}
                      onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {{
                            asc: <ArrowUpward className="h-4 w-4" />,
                            desc: <ArrowDownward className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ArrowUpward className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
          )}

          <TableBody>
            {showSkeleton
              ? Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: columnCount }, (_, j) => (
                      <TableCell key={j}>
                        <Skeleton height={skeletonHeight} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onClickRow?.(row.original)}
                    className="hover:bg-black-100"
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={`text-black-500 text-md border-0 px-2 ${size === 'normal' ? 'py-1' : 'py-0'} ${
                          cellIndex === 0 ? 'pt-2' : ''
                        } whitespace-nowrap`}
                        sx={{ textAlign: (cell.column.columnDef as CustomColumnDef<T>).align || 'left' }}
                      >
                        <Box className="relative">
                          <Box
                            className={`${isFetching ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Box>
                          {isFetching && (
                            <Box className="absolute inset-0 flex items-center justify-center bg-white">
                              <Skeleton
                                height={skeletonHeight}
                                width="100%"
                              />
                            </Box>
                          )}
                        </Box>
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
