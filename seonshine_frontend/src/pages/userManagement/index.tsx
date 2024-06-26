import { useState } from 'react';

import { Box } from '@mui/material';

import { StyledTab, StyledTabs } from '@/components/molecules/tab/styled';
import TabPanel from '@/components/molecules/tab/TabPannel';

import ApprovalTab from './components/ApprovalTab';
import RestaurantManagementTab from './components/RestaurantManagementTab';
import UserManagementTab from './components/UserManagementTab';

const UserManagement = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box className="w-full">
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="management tabs"
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <StyledTab label="User Management" />
        <StyledTab label="Restaurant Management" />
        <StyledTab label="Approval" />
      </StyledTabs>
      <Box className="px-4 md:px-8 mt-8">
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
