import { RoleEnum } from './user';

export type SubPathType = {
  name: string;
  path: string;
};

export type MenuItemType = {
  name: string;
  icon: string;
  path: string;
  permission: RoleEnum[];
  subPaths?: SubPathType[];
};
