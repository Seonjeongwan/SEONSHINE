import { FormControl, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';

import { dayByWeekday, DayEnum } from '@/types/user';

import { AssignTableType } from '../types';

type AssignCardProps = {
  assignedData: AssignTableType;
  handleSelectChange: (id: number, userId: string) => void;
  isSelectDisabled: (id: number) => boolean;
};

const AssignCard = ({ assignedData, handleSelectChange, isSelectDisabled }: AssignCardProps) => {
  const { address, assignedDate, restaurants, selectedRestaurantId } = assignedData;
  return (
    <Stack
      direction="column"
      gap={2}
    >
      <Typography
        fontSize={20}
        className="font-bold"
      >
        {dayByWeekday[assignedDate as DayEnum]}
      </Typography>
      <Stack
        direction="column"
        gap={6}
        className="bg-white rounded-md p-6 shadow-sm"
      >
        <Stack
          alignItems="center"
          gap={4}
        >
          <Typography className="font-bold">Restaurant</Typography>
          <FormControl
            variant="outlined"
            className="max-w-max"
          >
            <Select
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              value={selectedRestaurantId || ''}
              onChange={(e: SelectChangeEvent) => handleSelectChange(assignedDate, e.target.value)}
              size="small"
              className="bg-white font-bold min-w-52 rounded-xl h-10"
              sx={{
                '.MuiSelect-select': {
                  fontSize: '14px',
                  paddingBottom: '14px',
                },
              }}
              disabled={isSelectDisabled(assignedDate)}
            >
              <MenuItem value="">None</MenuItem>
              {restaurants.map((option) => (
                <MenuItem
                  key={option.user_id}
                  value={option.user_id}
                >
                  {option.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack
          alignItems="flex-start"
          gap={8}
        >
          <Typography className="font-bold">Address</Typography>
          <Typography>{address || '...'}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AssignCard;
