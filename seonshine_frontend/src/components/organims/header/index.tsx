import { Link, useLocation } from 'react-router-dom';

import { NavigateNext } from '@mui/icons-material';
import { Breadcrumbs, Stack, Typography } from '@mui/material';

import { buildFullPath, getMenuItemNameByPath } from './helpers';

const Header = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <Typography
        variant="heading2"
        component="h2"
      >
        {getMenuItemNameByPath(location.pathname)}
      </Typography>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNext fontSize="small" />}
        className="font-normal text-base text-black-500"
      >
        <Link to="/">Home</Link>
        {paths.map((path, index) => {
          const fullPath = buildFullPath(paths, index);
          const isCurrentPage = location.pathname === fullPath;
          return isCurrentPage ? (
            <Typography
              key={`${path}_${index}`}
              color="primary"
              variant="bodyS"
            >
              {getMenuItemNameByPath(fullPath)}
            </Typography>
          ) : (
            <Link
              key={`${path}_${index}`}
              to={fullPath}
            >
              {getMenuItemNameByPath(fullPath)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
};

export default Header;
