import { useMediaQuery } from '@mui/material';

import { BREAKPOINT_MOBILE } from '@/constants/device';

export const useDeviceType = () => {
  const isMobile = useMediaQuery(`(max-width:${BREAKPOINT_MOBILE}px)`);
  return {
    isMobile,
  };
};
