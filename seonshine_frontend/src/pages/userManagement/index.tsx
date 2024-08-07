import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box } from '@mui/material';

import { StyledTab, StyledTabs } from '@/components/molecules/tab/styled';
import TabPanel from '@/components/molecules/tab/TabPannel';

import { useDeviceType } from '@/hooks/useDeviceType';
import { UserManagementTabEnum } from '@/types/user';

import ApprovalTab from './components/ApprovalTab';
import RestaurantManagementTab from './components/RestaurantManagementTab';
import UserManagementTab from './components/UserManagementTab';

const UserManagement = () => {
  const location = useLocation();
  const localState = location.state;
  const [value, setValue] = useState<number>(localState?.tab || UserManagementTabEnum.USER_MANAGEMENT);

  const { isMobile } = useDeviceType();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box className="w-full">
      <Box className="sticky top-0 z-10 bg-black-100">
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="management tabs"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <StyledTab label={isMobile ? 'User' : 'User Management'} />
          <StyledTab label={isMobile ? 'Restaurant' : 'Restaurant Management'} />
          <StyledTab label="Approval" />
        </StyledTabs>
      </Box>

      <Box className="px-4 md:px-8 my-4">
        <TabPanel
          value={value}
          index={0}
        >
          <UserManagementTab />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
        >
          <RestaurantManagementTab />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
        >
          <ApprovalTab />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default UserManagement;
