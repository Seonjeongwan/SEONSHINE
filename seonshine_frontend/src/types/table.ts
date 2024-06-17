import { ColumnDef } from '@tanstack/react-table';

export type CustomColumnDef<T> = ColumnDef<T> & {
  align?: 'left' | 'center' | 'right';
};
