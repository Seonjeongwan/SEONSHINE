import React from 'react';
import { Link } from 'react-router-dom';

import { AccountBox, History, Home, MenuBook, Restaurant, ShoppingCart } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { RoleEnum } from '@/types/user';

type SidebarProps = {
  role: RoleEnum;
};

export const menuItems = [
  {
    name: 'Main Page',
    icon: 'HomeIcon',
    path: '/main',
    permission: [RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.RESTAURANT],
  },
  { name: 'User Management', icon: 'AccountBoxIcon', path: '/user-management', permission: [RoleEnum.ADMIN] },
  {
    name: 'Restaurant Management',
    icon: 'RestaurantIcon',
    path: '/restaurant-management',
    permission: [RoleEnum.ADMIN],
  },
  {
    name: 'Menu Management',
    icon: 'MenuBookIcon',
    path: '/menu-management',
    permission: [RoleEnum.ADMIN, RoleEnum.RESTAURANT],
  },
  { name: 'Order', icon: 'ShoppingCartIcon', path: '/order', permission: [RoleEnum.USER, RoleEnum.RESTAURANT] },
  { name: 'Order List', icon: 'ShoppingCartIcon', path: '/order-list', permission: [RoleEnum.RESTAURANT] },
  { name: 'Order History', icon: 'HistoryIcon', path: '/order-history', permission: [RoleEnum.RESTAURANT] },
];

const iconMap: Record<string, React.ElementType> = {
  HomeIcon: Home,
  AccountBoxIcon: AccountBox,
  RestaurantIcon: Restaurant,
  MenuBookIcon: MenuBook,
  ShoppingCartIcon: ShoppingCart,
  HistoryIcon: History,
};

export type MenuItemType = {
  name: string;
  icon: string;
  path: string;
  permission: RoleEnum[];
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const allowedMenuItems = menuItems.filter((item) => item.permission.includes(role));

  return (
    <div className="bg-gray-800 text-white h-full p-4">
      <List>
        {allowedMenuItems.map((item: MenuItemType) => {
          const Icon = iconMap[item.icon];
          return (
            <ListItem
              component={Link}
              to={item.path}
              key={item.name}
            >
              <ListItemIcon className="text-white">
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Sidebar;
