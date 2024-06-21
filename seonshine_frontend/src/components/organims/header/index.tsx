import { Link, useLocation } from 'react-router-dom';

import { NavigateNext } from '@mui/icons-material';
import { Breadcrumbs, Stack, Typography } from '@mui/material';

import { buildFullPath, getNameByPath, getTitleByPath } from '@/utils/menu';

const Header = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <Stack
      direction="column"
      gap={4}
      className="px-4 md:px-8"
    >
      <Typography
        variant="heading2"
        component="h2"
      >
        {getTitleByPath(paths[0])}
      </Typography>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNext fontSize="small" />}
        className="font-normal text-base text-black-500"
      >
        <Link to="/">Home</Link>
        {paths.map((path, index) => {
          const fullPath = buildFullPath(paths, index);
          const name = getNameByPath(fullPath);
          return name ? (
            index === paths.length - 1 ? (
              <Typography
                key={`${path}_${index}`}
                color="primary"
                variant="bodyS"
              >
                {name}
              </Typography>
            ) : (
              <Link
                key={`${path}_${index}`}
                to={fullPath}
              >
                {name}
              </Link>
            )
          ) : null;
        })}
      </Breadcrumbs>
    </Stack>
  );
};

export default Header;
