import React, { useEffect, useState } from 'react';

import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { PageLoading } from '@/components/molecules/pageLoading';

import { avatarBaseURL } from '@/constants/image';

import { useGetAllRestaurants, useGetMenuListlApi } from '@/apis/hooks/userApi.hook';

const MenuManagement = () => {
  const [query, setQuery] = useState('');
  const [restaurantQuery, setRestaurantQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: allRestaurants = [] } = useGetAllRestaurants({ enabled: true });

  const {
    data: menuList = [],
    isLoading,
    isError,
  } = useGetMenuListlApi({
    restaurant_id: restaurantQuery,
  });

  const [filteredDishes, setFilteredDishes] = useState(menuList);

  useEffect(() => {
    if (query === '') {
      setFilteredDishes(menuList);
    } else {
      setFilteredDishes(menuList?.filter((dish) => dish.name.toLowerCase().includes(query.toLowerCase())));
    }
  }, [query, menuList]);

  const handleAddItem = () => {
    console.log('Add new dish');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  if (isError) {
    return <div>Error loading menu list</div>;
  }

  return (
    <Box className="px-4 md:px-8">
      <Stack direction="column">
        <Box className="sticky top-0 z-10 h-full w-full bg-gray-100 py-4">
          <Stack className="h-full">
            <FormControl
              variant="outlined"
              className="w-1/3 rounded-xl mr-4"
            >
              <Select
                defaultValue=""
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                value={restaurantQuery}
                onChange={(e) => setRestaurantQuery(e.target.value)}
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
                <MenuItem
                  value=""
                  disabled
                >
                  Select Restaurant
                </MenuItem>
                {Array.isArray(allRestaurants) &&
                  allRestaurants.map((restaurant) => (
                    <MenuItem
                      key={restaurant.user_id}
                      value={restaurant.user_id}
                    >
                      {restaurant.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              value={query}
              placeholder="Search For Menu Item"
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              className="bg-white rounded-xl h-full w-1/2"
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
          <Typography
            variant="h4"
            component="h3"
            className="my-8"
          >
            Menu List
          </Typography>
        </Box>
        <Stack className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDishes.map((dish) => (
            <Stack
              className="rounded-md p-6 m-2 box-border cursor-pointer bg-white transition-transform transform hover:scale-105 hover:shadow-lg "
              direction="column"
              gap={2}
              onClick={handleOpenModal}
            >
              <Box className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
                <img
                  src={dish.image_url ? `${avatarBaseURL}${dish.image_url}` : 'https://via.placeholder.com/150'}
                  alt={dish.name}
                  className="h-full w-full object-cover"
                />
              </Box>
              <Typography className="font-bold">{dish.name}</Typography>
            </Stack>
          ))}
          <Stack
            className="rounded-md p-6 m-2 box-border bg-gray-200 cursor-pointer opacity-50 transition-transform transform hover:scale-105 hover:shadow-lg"
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            onClick={handleAddItem}
          >
            <Box className="w-full h-48 md:h-64 flex items-center justify-center overflow-hidden rounded-md ">
              <AddCircleRoundedIcon
                className="w-1/2 h-1/2 opacity-30"
                fontSize="large"
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 md:w-1/3 lg:w-1/5 bg-white shadow-xl rounded-lg outline-none">
            <Box className="flex flex-col">
              <Stack
                className="rounded-md p-8 box-border cursor-pointer bg-gray-100 flex flex-col items-center"
                direction="column"
                gap={2}
              >
                <Box className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
                  <img
                    src="https://vietnamnomad.com/wp-content/uploads/2023/05/What-is-bun-dau-mam-tom.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </Box>
                <input
                  accept="image/*"
                  className="hidden"
                  id="upload-photo"
                  type="file"
                />
                <label htmlFor="upload-photo">
                  <Button
                    component="span"
                    className="hover:bg-green-300 hover:text-white hover:outline-green-300 bg-white text-green-200 font-bold outline outline-2 outline-green-200 mx-4 mt-2 md:mt-4 rounded-xl"
                  >
                    Upload Photo
                  </Button>
                </label>
              </Stack>
              <Stack className="font-bold flex flex-col items-center">
                <Typography>asdasd</Typography>
              </Stack>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default MenuManagement;
