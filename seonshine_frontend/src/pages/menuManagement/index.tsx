import React, { useState } from 'react';
import { toast } from 'react-toastify';

import {
  Close,
  Delete as DeleteIcon,
  HighlightOff,
  HighlightOffOutlined,
  RestaurantRounded,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
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
import { StyledTab, StyledTabs } from '@/components/molecules/tab/styled';
import TabPanel from '@/components/molecules/tab/TabPannel';

import { avatarBaseURL } from '@/constants/image';
import { GetMenuListResponseType, RoleEnum } from '@/types/user';

import {
  useDeleteMenuItemApi,
  useGetAllRestaurantsApi,
  useGetDashBoardSummary,
  useGetDeletedMenuListApi,
  useGetMenuListlApi,
  useGetTodayMenuListApi,
  useRestoreMenuItemApi,
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
  const [isConfirmRestoreModalOpen, setIsConfirmRestoreModalOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);

  const {
    data: menuList,
    isLoading,
    isError,
  } = useGetMenuListlApi({
    restaurant_id: restaurantQuery,
  });

  const { data: deletedMenuList } = useGetDeletedMenuListApi(
    { restaurant_id: restaurantQuery },
    { enabled: !!restaurantQuery },
  );

  const { mutate: deleteMenuItem, isPending: isLoadingDelete } = useDeleteMenuItemApi(selectedItem?.item_id as number);
  const { mutate: restoreMenuItem, isPending: isLoadingRestore } = useRestoreMenuItemApi(
    selectedItem?.item_id as number,
  );

  const filterByQuery = (list?: GetMenuListResponseType[]) =>
    query === '' ? list : list?.filter((dish) => dish.name.toLowerCase().includes(query.toLowerCase()));

  const filteredActiveDishes = filterByQuery(menuList);
  const filteredDeletedDishes = filterByQuery(deletedMenuList);
  const deletedCount = deletedMenuList?.length ?? 0;

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

  const handleClickRestoreAction = () => {
    setIsConfirmRestoreModalOpen(true);
  };

  const handleRestoreItem = () => {
    restoreMenuItem(undefined, {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['getDeletedMenuList'] });
        queryClient.invalidateQueries({ queryKey: ['getMenuList'] });
      },
      onError: () => {
        toast.error('Restore menu item failed!');
      },
    });
    setIsConfirmRestoreModalOpen(false);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setQuery('');
    setTabValue(newValue);
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
        {restaurantQuery && (
          <StyledTabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="menu management tabs"
            className="mt-4"
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <StyledTab label="Available Menu" />
            <StyledTab label={deletedCount > 0 ? `Deleted (${deletedCount})` : 'Deleted'} />
          </StyledTabs>
        )}
      </Box>

      {restaurantQuery && (
        <>
          <TabPanel
            value={tabValue}
            index={0}
          >
            <Stack
              direction="column"
              className="pb-4 pt-4"
            >
              <Stack className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
                {filteredActiveDishes?.map((dish, index) => (
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
              </Stack>
            </Stack>
          </TabPanel>

          <TabPanel
            value={tabValue}
            index={1}
          >
            <Stack
              direction="column"
              className="pb-4 pt-4"
              gap={2}
            >
              <Typography className="text-black-300 text-sm md:text-base">
                These menus are hidden from users. Press “Restore” to make a menu available again.
              </Typography>
              <Stack className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
                {filteredDeletedDishes?.map((dish, index) => (
                  <Stack
                    key={dish.name + index}
                    className="relative rounded-md pb-2 p-0 md:p-6 m-2 box-border bg-white opacity-90 min-w-fit text-center"
                    direction="column"
                    gap={2}
                  >
                    <Box className="w-full h-36 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md grayscale">
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
                    <Button
                      variant="contained"
                      size="small"
                      disabled={isLoadingRestore}
                      startIcon={<RestoreIcon />}
                      onClick={() => {
                        setSelectedItem(dish);
                        handleClickRestoreAction();
                      }}
                      className="mx-auto rounded-full bg-green-500 hover:bg-green-300 text-white font-bold normal-case px-4"
                    >
                      Restore
                    </Button>
                  </Stack>
                ))}
                {filteredDeletedDishes?.length === 0 && (
                  <Typography className="col-span-full text-center text-black-300 py-10">
                    No deleted menu items.
                  </Typography>
                )}
              </Stack>
            </Stack>
          </TabPanel>
        </>
      )}
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
      <ConfirmModal
        open={isConfirmRestoreModalOpen}
        title="Restore menu item"
        description="Do you want to restore this menu item? It will be visible again."
        handleClose={() => setIsConfirmRestoreModalOpen(false)}
        handleConfirm={handleRestoreItem}
      />
    </Box>
  );
};

export default MenuManagement;
