import { EventNoteOutlined, ListAltOutlined, PeopleOutline, StorefrontOutlined } from '@mui/icons-material';

import { RoleEnum } from '@/types/user';

export const menuItems = [
  {
    name: 'Dashboard',
    icon: '',
    path: '/',
    permission: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.RESTAURANT],
  },
  { name: 'User Management', icon: 'userIcon', path: '/user-management', permission: [RoleEnum.ADMIN] },
  {
    name: 'Restaurant Management',
    icon: 'restaurantIcon',
    path: '/restaurant-management',
    permission: [RoleEnum.ADMIN],
  },
  {
    name: 'Menu Management',
    icon: 'menuIcon',
    path: '/menu-management',
    permission: [RoleEnum.ADMIN, RoleEnum.RESTAURANT],
  },
  {
    name: 'Order Management',
    icon: 'orderIcon',
    path: '/order-management',
    permission: [RoleEnum.ADMIN, RoleEnum.RESTAURANT, RoleEnum.USER],
  },
];

export const iconMap: Record<string, React.ElementType> = {
  userIcon: PeopleOutline,
  restaurantIcon: StorefrontOutlined,
  menuIcon: EventNoteOutlined,
  orderIcon: ListAltOutlined,
};
