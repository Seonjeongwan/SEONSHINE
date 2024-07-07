import { Box } from '@mui/material';

import { RoleEnum } from '@/types/user';

import useAuthStore from '@/store/auth.store';

import RestaurantProfile from './components/RestaurantProfile';
import UserProfile from './components/UserProfile';

const ProfileManagemant = () => {
  const { currentUser } = useAuthStore();

  return (
    <Box className="px-4 md:px-8 mb-8">
      {currentUser?.role_id === RoleEnum.USER ? (
        <UserProfile userId={currentUser?.user_id as string} />
      ) : (
        <RestaurantProfile userId={currentUser?.user_id as string} />
      )}
    </Box>
  );
};

export default ProfileManagemant;
