import { RoleEnum } from './user';

export type SubMenuItemType = {
  name: string;
  path: string;
};

export type MenuItemType = {
  name: string;
  icon: string;
  path: string;
  permission: RoleEnum[];
  subItems?: SubMenuItemType[];
};
