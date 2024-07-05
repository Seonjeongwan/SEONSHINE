import { Box } from '@mui/material';

import UserProfile from './components/UserProfile';

const ProfileManagemant = () => {
  return (
    <Box className="px-4 md:px-8 mb-8">
      <UserProfile userId="shinhanuser1" />
    </Box>
  );
};

export default ProfileManagemant;
