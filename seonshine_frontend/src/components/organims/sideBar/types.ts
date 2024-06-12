import { RoleEnum } from '@/types/user';

export type MenuItemType = {
  name: string;
  icon: string;
  path: string;
  permission: RoleEnum[];
};

export type SidebarPropsType = {
  role: RoleEnum;
};
