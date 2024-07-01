import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box } from '@mui/material';

import OrderListTab from './components/OrderListTab';
import UserOrderListTab from './components/OrderListTab';
import OrderHistoryTab from './components/OrderMenuTab';
import OrderMenuTab from './components/OrderMenuTab';
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
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

const OrderManagement = () => {
  const location = useLocation();
  const localState = location.state;
  const [value, setValue] = useState<number>(localState?.tab || 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className="w-full">
      <Box className="sticky top-0 z-10 w-full bg-black-100">
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="management tabs"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <StyledTab label="Order" />
          <StyledTab label="Order List" />
        </StyledTabs>
      </Box>
      <Box className="px-4 md:px-8">
        <TabPanel
          value={value}
          index={0}
        >
          <OrderMenuTab />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
        >
          <UserOrderListTab />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default OrderManagement;
