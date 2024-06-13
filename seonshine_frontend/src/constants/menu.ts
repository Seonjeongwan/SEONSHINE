import { MenuItemType } from '@/types/menu';
import { RoleEnum } from '@/types/user';

export const menuItems: MenuItemType[] = [
  {
    name: 'Dashboard',
    icon: '',
    path: '/dashboard',
    permission: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.RESTAURANT],
  },
  {
    name: 'User Management',
    icon: 'userIcon',
    path: '/user',
    permission: [RoleEnum.ADMIN],
    subItems: [
      { name: 'Register', path: '/user/register' },
      { name: 'Edit User', path: '/user/:id/edit' },
    ],
  },
  {
    name: 'Restaurant Management',
    icon: 'restaurantIcon',
    path: '/restaurant',
    permission: [RoleEnum.ADMIN],
  },
  {
    name: 'Menu Management',
    icon: 'menuIcon',
    path: '/menu',
    permission: [RoleEnum.ADMIN, RoleEnum.RESTAURANT],
  },
  {
    name: 'Order Management',
    icon: 'orderIcon',
    path: '/order',
    permission: [RoleEnum.ADMIN, RoleEnum.RESTAURANT, RoleEnum.USER],
  },
];
