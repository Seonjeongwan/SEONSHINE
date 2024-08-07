import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Close,
  Delete as DeleteIcon,
  HighlightOff,
  HighlightOffOutlined,
  RestaurantRounded,
} from '@mui/icons-material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  FormControl,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import ConfirmModal from '@/components/organims/confirmModal';

import { avatarBaseURL } from '@/constants/image';
import { GetMenuListResponseType, RoleEnum } from '@/types/user';

import {
  useDeleteMenuItemApi,
  useGetAllRestaurantsApi,
  useGetDashBoardSummary,
  useGetMenuListlApi,
  useGetTodayMenuListApi,
  useUpdateMenuItemApi,
} from '@/apis/hooks/userApi.hook';
import useAuthStore from '@/store/auth.store';

import { approvalItemDelete, approvalItemleteDescription } from './components/constant';
import ModalMenuItem from './components/ModalMenuItem';

const MenuManagement = () => {
  const [query, setQuery] = useState('');
  const { currentUser } = useAuthStore();
  const { data: dashboardSummary } = useGetDashBoardSummary({ enabled: true });

  const [restaurantQuery, setRestaurantQuery] = useState(
    currentUser?.role_id == RoleEnum.ADMIN
      ? (dashboardSummary?.today_restaurant_id as string) || ''
      : (currentUser?.user_id as string),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: allRestaurants = [] } = useGetAllRestaurantsApi({ enabled: true });
  const [selectedItem, setSelectedItem] = useState<GetMenuListResponseType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const {
    data: menuList,
    isLoading,
    isError,
  } = useGetMenuListlApi({
    restaurant_id: restaurantQuery,
  });

  const { mutate: deleteMenuItem, isPending: isLoadingDelete } = useDeleteMenuItemApi(selectedItem?.item_id as number);

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

  const queryClient = useQueryClient();

  const handleDeleteItem = () => {
    deleteMenuItem(undefined, {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['getMenuList'] });
      },
      onError: () => {
        toast.error('Delete menu item failed!');
      },
    });
    setIsConfirmModalOpen(false);
  };

  const handleClickAction = () => {
    setIsConfirmModalOpen(true);
  };

  return (
    <Box className="px-4 md:px-8">
      <Box className="sticky top-0 z-10 h-full w-full bg-black-100">
        <Stack className="h-full flex-col md:flex-row">
          {currentUser?.role_id == RoleEnum.ADMIN && (
            <FormControl
              variant="outlined"
              className="w-full md:w-1/4 rounded-xl mb-4 md:mr-4 md:mb-0"
            >
              <Select
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                value={restaurantQuery}
                onChange={(e) => setRestaurantQuery(e.target.value)}
                size="small"
                className="rounded-xl bg-white font-bold h-full md:w-full"
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '15px',
                    paddingTop: '15.5px',
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
          {restaurantQuery && (
            <TextField
              value={query}
              placeholder="Search for menu item"
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              className="bg-white rounded-xl h-full w-full md:w-1/2"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  '& fieldset': {
                    border: 'none',
                  },
                  paddingY: '12,5',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 28 }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
        {restaurantQuery && <h2 className="text-2xl font-bold mt-4 mb-3">Menu List</h2>}
      </Box>
      <Stack
        direction="column"
        className="pb-4"
      >
        <Stack className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {filteredDishes?.map((dish, index) => (
            <Stack
              key={dish.name + index}
              className="relative rounded-md pb-2 p-0 md:p-6 m-2 box-border cursor-pointer bg-white transition-transform transform hover:scale-105 hover:shadow-lg min-w-fit text-center"
              direction="column"
              gap={2}
              onClick={() => handleOpenModal(dish)}
            >
              <IconButton
                disabled={isLoadingDelete}
                className="absolute top-0 left-0 m-2 md:m-8 bg-white hover:bg-black-100 hover:text-black-500 transition-colors p-1"
                onClick={(e) => {
                  setSelectedItem(dish);
                  e.stopPropagation();
                  handleClickAction();
                }}
              >
                <Close className="text-sm" />
              </IconButton>
              <Box className="w-full h-36 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
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
          {restaurantQuery && (
            <Stack
              className="rounded-md p-6 m-2 box-border bg-gray-200 cursor-pointer opacity-50 transition-transform transform hover:scale-105 hover:shadow-lg"
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
              onClick={handleOpenCreateModal}
            >
              <Box className="w-full h-36 md:h-64 flex items-center justify-center overflow-hidden rounded-md">
                <AddCircleRoundedIcon
                  className="w-1/2 h-1/2 opacity-30"
                  fontSize="large"
                />
              </Box>
            </Stack>
          )}
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
      <ConfirmModal
        open={isConfirmModalOpen}
        title={approvalItemDelete}
        description={approvalItemleteDescription}
        handleClose={() => setIsConfirmModalOpen(false)}
        handleConfirm={handleDeleteItem}
      />
    </Box>
  );
};

export default MenuManagement;
