import { Avatar, Stack, Typography } from '@mui/material';

const OrderHistoryItem = () => {
  return (
    <Stack
      direction="column"
      gap={6}
    >
      <Typography className="text-2xl font-bold">2024-06-18</Typography>
      <Stack
        className="bg-white min-h-max min-w-max rounded-s-full"
        alignItems="center"
        gap={4}
      >
        <Avatar
          // src={!user?.profile_picture_url ? '' : `${avatarBaseURL}${user?.profile_picture_url}`}
          src={''}
          className="w-28 h-28 m-4 hidden sm:flex"
        />
        <Stack
          direction="column"
          justifyContent="space-around"
          gap={6}
          className="w-3/5"
        >
          <Typography className="text-4xl font-bold">Kitchen Seoul</Typography>
          <Typography className="text-lg font-normal">Diamond Plaza, District 1</Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="flex-end"
          justifyContent="space-between"
          gap={10}
          className="mx-auto pr-2"
        >
          <Typography className="text-lg font-normal text-right whitespace-nowrap">Order amount: 18</Typography>
          <Typography className="text-lg font-normal underline text-blue-500">Detail</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderHistoryItem;
