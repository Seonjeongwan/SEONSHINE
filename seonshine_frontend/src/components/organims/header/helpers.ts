import { menuItems } from '../sideBar/constants';

export const getMenuItemNameByPath = (path: string): string => {
  const menuItem = menuItems.find((item) => item.path === path);
  return menuItem ? menuItem.name : 'Dashboard';
};

export const buildFullPath = (paths: string[], index: number): string => `/${paths.slice(0, index + 1).join('/')}`;
