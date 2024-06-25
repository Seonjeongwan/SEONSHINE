import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import Table from '@/components/organims/table';

import { useGetOrderPeriodApi } from '@/apis/hooks/orderListApi.hook';
import {
  useGetAllRestaurantApi,
  useGetRestaurantAssignListApi,
  useRestaurantAssignApi,
} from '@/apis/hooks/restaurantAssignApi.hook';

import { AssignTableHeader } from './components/AssignTableHeader';
import { AssignTableType, SelectionsType } from './types';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const RestaurantAssignment = () => {
  const [selections, setSelections] = useState<SelectionsType>({});

  const { data: allRestaurants, isFetching: isAllRestaurantsFetching } = useGetAllRestaurantApi();
  const { data: assignedRestaurantList, isFetching: isAssignedListFetching } = useGetRestaurantAssignListApi();
  const { mutate: assignRestaurant } = useRestaurantAssignApi();
  const { data: orderPeriod } = useGetOrderPeriodApi();

  const queryClient = useQueryClient();

  const getDataAssignTable: AssignTableType[] = useMemo(
    () =>
      daysOfWeek.map((day, index) => ({
        assigned_date: {
          id: index + 1,
          date: day,
        },
        restaurants: allRestaurants || [],
        address: selections[index + 1]?.address || '',
        selectedRestaurantId: selections[index + 1]?.userId,
      })),
    [allRestaurants, selections],
  );

  const handleSelectChange = (id: number, userId: string) => {
    assignRestaurant(
      {
        restaurant_id: userId,
        weekday: id,
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['getRestaurantAssignList'] });
          toast.success(res.message);
        },
        onError: () => {
          toast.error('Assign restaurant failed!');
        },
      },
    );
  };

  const isSelectDisabled = (id: number) => {
    if (!orderPeriod) return false;
    const currentDayIndex = new Date().getDay();
    if (id !== currentDayIndex) return false;
    const { startHour, startMinute, endHour, endMinute } = orderPeriod;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return (
      (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
      (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
    );
  };

  const columns = AssignTableHeader({ handleSelectChange, isSelectDisabled });

  useEffect(() => {
    if (assignedRestaurantList && allRestaurants) {
      const initialSelections: SelectionsType = {};
      assignedRestaurantList.forEach((assignment) => {
        const selectedRestaurant = allRestaurants.find((r) => r.user_id === assignment.restaurant_id);
        const address = selectedRestaurant ? selectedRestaurant.address : '';
        initialSelections[assignment.weekday] = {
          userId: assignment.restaurant_id,
          address,
        };
      });
      setSelections(initialSelections);
    }
  }, [assignedRestaurantList, allRestaurants]);

  return (
    <Box className="px-4 md:px-8 mt-8 w-full lg:w-280">
      <Table<AssignTableType>
        data={!assignedRestaurantList ? [] : getDataAssignTable}
        columns={columns}
        isFetching={isAllRestaurantsFetching || isAssignedListFetching}
        currentPage={0}
        onPageChange={() => {}}
      />
    </Box>
  );
};

export default RestaurantAssignment;
