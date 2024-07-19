import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

import { CustomColumnDef } from '@/types/table';
import { dayByWeekday, DayEnum } from '@/types/user';

import { AssignTableType } from '../types';

type AssignTableHeaderPropsType = {
  handleSelectChange: (id: number, userId: string) => void;
  isSelectDisabled: (id: number) => boolean;
};

export const AssignTableHeader = ({
  handleSelectChange,
  isSelectDisabled,
}: AssignTableHeaderPropsType): CustomColumnDef<AssignTableType>[] => [
  {
    accessorKey: 'assigned_date',
    header: 'Assigned Date',
    cell: (info) => (
      <Box className="flex items-center justify-end bg-gradient-to-r from-gray-200 to-gray-500 h-full min-w-40 w-3/4 my-1">
        <Typography className="font-extrabold italic text-3xl text-black-100">
          {dayByWeekday[info.row.original.assigned_date as DayEnum]}
        </Typography>
      </Box>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'restaurants',
    header: 'Restaurant',
    cell: (info) => (
      <FormControl
        variant="outlined"
        className="max-w-max"
      >
        <Select
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          value={info.row.original.selectedRestaurantId || ''}
          onChange={(e: SelectChangeEvent) => handleSelectChange(info.row.original.assigned_date, e.target.value)}
          size="small"
          className="bg-white font-bold min-w-52 rounded-xl h-10"
          sx={{
            '.MuiSelect-select': {
              fontSize: '14px',
              paddingBottom: '14px',
            },
          }}
          disabled={isSelectDisabled(info.row.original.assigned_date)}
        >
          <MenuItem value="">None</MenuItem>
          {info.row.original.restaurants.map((option) => (
            <MenuItem
              key={option.user_id}
              value={option.user_id}
            >
              {option.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: (info) => info.row.original.address || '...',
    enableSorting: false,
  },
];
