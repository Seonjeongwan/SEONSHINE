import React, { useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';

interface SearchBarProps {
  onSearch: (field: string, query: string) => void;
  options: { value: string; label: string }[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, options }) => {
  const [field, setField] = useState<string>(options[0]?.value);
  const [query, setQuery] = useState<string>('');

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    setField(event.target.value as string);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(field, query);
  };
 
  return (
    <Stack className="flex items-center gap-6 md:gap-8 h-12 md:h-14">
      <FormControl
        variant="outlined"
        className="w-1/4 md:w-1/6 lg:w-1/12 h-full"
      >
        <Select
          defaultValue={options[0]?.value}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          value={field}
          onChange={handleFieldChange}
          size="small"
          className="rounded-xl bg-white font-bold h-full"
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack className="w-1/2 md:w-2/3 lg:w-5/6 h-full">
        <TextField
          value={query}
          placeholder="Search for user"
          onChange={handleQueryChange}
          variant="outlined"
          className="bg-white rounded-full h-full w-full"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack className="w-1/4 md:w-1/6 lg:w-1/12 h-full">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSearch}
          className="font-bold text-black-500 rounded-full bg-black-200 hover:bg-black-300 border-none hover:border-none h-full w-full text-base"
        >
          Search
        </Button>
      </Stack>
    </Stack>
  );
};

export default SearchBar;
