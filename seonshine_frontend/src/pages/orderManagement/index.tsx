import { useState } from 'react';

import { Box } from '@mui/material';

import { StyledTab, StyledTabs } from '@/components/molecules/tab/styled';
import TabPanel from '@/components/molecules/tab/TabPannel';

import OrderHistoryTab from './components/OrderHistoryTab';
import OrderListTab from './components/OrderListTab';

const OrderManagement = () => {
  const [value, setValue] = useState<number>(0);
  const [orderDate, setOrderDate] = useState<string>('');

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
          <StyledTab label="Order List" />
          <StyledTab label="Order History" />
        </StyledTabs>
      </Box>
      <Box className="px-4 md:px-8 mt-4">
        <TabPanel
          value={value}
          index={0}
        >
          <OrderListTab orderDate={orderDate} />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
        >
          <OrderHistoryTab
            handleViewDetail={(orderDate) => {
              setValue(0);
              setOrderDate(orderDate);
            }}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default OrderManagement;
