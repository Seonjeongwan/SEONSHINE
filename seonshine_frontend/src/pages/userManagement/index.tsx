import { useState } from 'react';

import { Box } from '@mui/material';

import UserManagementTab from './components/UserManagementTab';
import { StyledTab, StyledTabs } from './styled';

type TabPanelPropsType = {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelPropsType) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

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
      <Box className="px-8">
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
          Restaurant Management
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
        >
          Approval
        </TabPanel>
      </Box>
    </Box>
  );
};

export default UserManagement;
