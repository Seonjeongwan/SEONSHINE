import React, { FormEvent, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

interface SearchBarProps {
  onSearch: (field: string, query: string) => void;
  options: { value: string; label: string }[];
  optionDefault: string;
  valueDefault?: string;
  searchPlaceHolder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  options,
  optionDefault,
  valueDefault,
  searchPlaceHolder = 'Search for user',
}) => {
  const [field, setField] = useState<string>(optionDefault);
  const [query, setQuery] = useState<string>(valueDefault || '');

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    setField(event.target.value as string);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(field, query);
  };

  return (
    <form
      className="w-full lg:w-3/5"
      onSubmit={onSubmitForm}
    >
      <Grid
        container
        spacing={3}
        alignItems="center"
      >
        <Grid
          item
          xs={5}
          sm={3}
          className="h-14"
        >
          <FormControl
            variant="outlined"
            fullWidth
            className="bg-white rounded-xl h-full"
          >
            <Select
              defaultValue={optionDefault}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              value={field}
              onChange={handleFieldChange}
              size="small"
              sx={{
                height: '100%',
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '70px',
                  fontSize: '14px',
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
        </Grid>
        <Grid
          item
          xs={7}
          className="h-14"
        >
          <TextField
            defaultValue={valueDefault}
            value={query}
            placeholder={searchPlaceHolder}
            onChange={handleQueryChange}
            variant="outlined"
            fullWidth
            className="bg-white rounded-full h-full"
            sx={{
              height: '100%',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                '& fieldset': {
                  border: 'none',
                },
                '& .MuiInputBase-input': {
                  paddingBlock: '14px',
                  fontSize: '14px',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '28px' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          className="h-14"
        >
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            fullWidth
            className="font-bold text-black-500 rounded-full bg-black-200 hover:bg-black-300 hover:text-white border-none hover:border-none h-full px-6"
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchBar;
