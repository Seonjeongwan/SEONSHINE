import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import TimePicker from '@/components/molecules/timePicker';
import Table from '@/components/organims/table';

import { useDeviceType } from '@/hooks/useDeviceType';

import { useGetOrderPeriodApi, useSetOrderPeriodApi } from '@/apis/hooks/orderListApi.hook';
import { useGetRestaurantAssignListApi, useRestaurantAssignApi } from '@/apis/hooks/restaurantAssignApi.hook';
import { useGetAllRestaurantsApi } from '@/apis/hooks/userApi.hook';

import AssignCard from './components/AssignCard';
import { AssignTableHeader } from './components/AssignTableHeader';
import { orderPeriodSchema, OrderPeriodSchemaType } from './schema';
import { AssignTableType, SelectionsType } from './types';
import { convertToTimeString } from '@/utils/datetime';

const RestaurantAssignment = () => {
  const [selections, setSelections] = useState<SelectionsType>({});

  const { data: allRestaurants, isFetching: isAllRestaurantsFetching } = useGetAllRestaurantsApi({ enabled: true });
  const { data: assignedRestaurantList, isFetching: isAssignedListFetching } = useGetRestaurantAssignListApi();
  const { mutate: assignRestaurant } = useRestaurantAssignApi();
  const { data: orderPeriod } = useGetOrderPeriodApi();

  const { mutate: setOrderPeriod, isPending } = useSetOrderPeriodApi();

  const queryClient = useQueryClient();

  const startTime = convertToTimeString(Number(orderPeriod?.data.start_hour), Number(orderPeriod?.data.start_minute));
  const endTime = convertToTimeString(Number(orderPeriod?.data.end_hour), Number(orderPeriod?.data.end_minute));

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<OrderPeriodSchemaType>({
    resolver: zodResolver(orderPeriodSchema),
    values: {
      startTime: startTime,
      endTime: endTime,
    },
  });

  const { isMobile } = useDeviceType();

  const getDataAssignTable: AssignTableType[] = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, index) => ({
        assignedDate: index + 1,
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
    const currentDayIndex = new Date().getDay();
    return id === currentDayIndex;
  };

  const columns = AssignTableHeader({ handleSelectChange, isSelectDisabled });

  const onSubmitForm = (data: OrderPeriodSchemaType) => {
    setOrderPeriod(
      {
        start: data.startTime,
        end: data.endTime,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({ queryKey: ['getOrderPeriod'] });
        },
        onError: () => {
          toast.success('Set order period failed.');
        },
      },
    );
  };

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
    <Box className="px-4 md:px-8 my-4 w-full lg:w-280">
      {isMobile ? (
        <Stack
          direction="column"
          gap={4}
        >
          {getDataAssignTable.map((item) => (
            <AssignCard
              key={item.assignedDate}
              assignData={item}
              handleSelectChange={handleSelectChange}
              isSelectDisabled={isSelectDisabled}
            />
          ))}
        </Stack>
      ) : (
        <Table<AssignTableType>
          data={!assignedRestaurantList ? [] : getDataAssignTable}
          columns={columns}
          isFetching={isAllRestaurantsFetching || isAssignedListFetching}
          currentPage={0}
          onPageChange={() => {}}
        />
      )}
      <Stack
        direction="column"
        gap={2}
        className={isMobile ? 'mt-4' : 'mt-8'}
      >
        <Typography
          fontSize={20}
          className="font-bold"
        >
          Available ordering time setting
        </Typography>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Stack
            className="bg-white p-8 rounded-md shadow-sm"
            alignItems={isMobile ? 'flex-start' : 'center'}
            direction={isMobile ? 'column' : 'row'}
            gap={isMobile ? 6 : 8}
          >
            <Typography className="text-lg font-normal">Order starts every day from</Typography>
            <Stack
              alignItems="center"
              gap={4}
            >
              <TimePicker
                name="startTime"
                control={control}
              />
              <Typography className="text-lg font-normal">to</Typography>
              <TimePicker
                name="endTime"
                control={control}
              />
            </Stack>

            <Button
              variant="outlined"
              color="primary"
              type="submit"
              disabled={!isDirty || isPending}
              className="font-bold text-black-500 rounded-full bg-black-200 hover:bg-black-300 hover:text-white border-none hover:border-none h-auto py-2 px-10"
            >
              Save
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default RestaurantAssignment;
