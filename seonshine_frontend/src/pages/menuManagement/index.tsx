import React, { useEffect, useState } from 'react';

import { RestaurantRounded } from '@mui/icons-material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import { Box, FormControl, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

import { avatarBaseURL } from '@/constants/image';
import { GetMenuListResponseType, RoleEnum } from '@/types/user';

import {
  useGetAllRestaurantsApi,
  useGetDashBoardSummary,
  useGetMenuListlApi,
  useGetTodayMenuListApi,
  useUpdateMenuItemApi,
} from '@/apis/hooks/userApi.hook';
import useAuthStore from '@/store/auth.store';

import ModalMenuItem from './components/ModalMenuItem';

const MenuManagement = () => {
  const [query, setQuery] = useState('');
  const { currentUser } = useAuthStore();
  const { data: dashboardSummary } = useGetDashBoardSummary({ enabled: true });

  const [restaurantQuery, setRestaurantQuery] = useState(
    currentUser?.role_id == RoleEnum.ADMIN
      ? (dashboardSummary?.today_restaurant_id as string)
      : (currentUser?.user_id as string),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: allRestaurants = [] } = useGetAllRestaurantsApi({ enabled: true });
  const [selectedItem, setSelectedItem] = useState<GetMenuListResponseType | null>(null);

  const {
    data: menuList,
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

  const handleOpenModal = (item: GetMenuListResponseType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  return (
    <Box className="px-4 md:px-8">
      <Stack direction="column">
        <Box className="sticky top-0 z-10 h-full w-full bg-black-100">
          <Stack className="h-full">
            {currentUser?.role_id == RoleEnum.ADMIN && (
              <FormControl
                variant="outlined"
                className="w-1/2 md:w-1/4 rounded-xl mr-4"
              >
                <Select
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
                  {allRestaurants.map((restaurant) => (
                    <MenuItem
                      key={restaurant.user_id}
                      value={restaurant.user_id}
                    >
                      {restaurant.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
          {filteredDishes?.map((dish, index) => (
            <Stack
              key={dish.name + index}
              className="rounded-md p-6 m-2 box-border cursor-pointer bg-white transition-transform transform hover:scale-105 hover:shadow-lg"
              direction="column"
              gap={2}
              onClick={() => handleOpenModal(dish)}
            >
              <Box className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
                {dish.image_url ? (
                  <img
                    src={`${avatarBaseURL}${dish.image_url}`}
                    className="h-full w-full object-cover"
                    alt={dish.name}
                  />
                ) : (
                  <Stack className="w-full h-full items-center ">
                    <RestaurantRounded
                      className="w-full h-1/2 opacity-30"
                      fontSize="large"
                    />
                  </Stack>
                )}
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
            onClick={handleOpenCreateModal}
          >
            <Box className="w-full h-48 md:h-64 flex items-center justify-center overflow-hidden rounded-md">
              <AddCircleRoundedIcon
                className="w-1/2 h-1/2 opacity-30"
                fontSize="large"
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {isModalOpen && (
        <ModalMenuItem
          selectedItem={selectedItem}
          item_id={selectedItem?.item_id}
          restaurant_id={restaurantQuery}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default MenuManagement;
