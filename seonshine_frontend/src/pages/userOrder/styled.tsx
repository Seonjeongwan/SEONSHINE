import { styled, Tab, TabProps, Tabs } from '@mui/material';

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  minHeight: '44px',
  '& .MuiTabs-indicator': {
    backgroundColor: 'transparent',
  },
  [theme.breakpoints.up('sm')]: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '2px',
      backgroundColor: theme.palette.black[300],
    },
  },
}));

export const StyledTab = styled((props: TabProps) => (
  <Tab
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  textTransform: 'none',
  width: 'calc(100% / 2)',
  minHeight: '44px',
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '16px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '20px',
  },
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  border: `1px solid ${theme.palette.black[200]}`,
  borderBottom: 'none',
  backgroundColor: theme.palette.grey[300],
  marginBottom: '-1px',
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.black[200],
  },
  '&.Mui-selected': {
    border: `2px solid ${theme.palette.black[300]}`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.black[100],
    borderBottom: 'none',
    zIndex: 1,
  },
  '&:first-of-type': {
    borderTopLeftRadius: '0px',
    borderLeft: 'none',
  },

  [theme.breakpoints.down('sm')]: {
    '&:last-of-type': {
      borderTopRightRadius: '0px',
      borderRight: 'none',
    },
  },
}));
