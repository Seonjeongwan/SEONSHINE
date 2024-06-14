import { useState } from 'react';

import { Box, Tab, Tabs, Typography } from '@mui/material';

import UserManagementTab from './components/UserManagementTab';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="management tabs"
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <Tab label="User Management" />
        <Tab label="Restaurant Management" />
        <Tab label="Approval" />
      </Tabs>
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
  );
};

export default UserManagement;
