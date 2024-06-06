import { useNavigate } from 'react-router-dom';

import { Stack, Typography } from '@mui/material';

import { paths } from '@/routes/paths';
import theme from '@/theme/index';

const PageNotFound = () => {
  const navigate = useNavigate();

  const navigateToHomePage = () => {
    navigate(paths.index);
  };

  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        spacing={2}
      >
        <Typography
          variant="h1"
          fontSize={'64px'}
          fontWeight={theme.typography.fontWeightBold}
        >
          404
        </Typography>

        <button onClick={navigateToHomePage}>Go back</button>
      </Stack>
      <Stack justifyContent="center">NOT FOUND</Stack>
    </>
  );
};

export default PageNotFound;
