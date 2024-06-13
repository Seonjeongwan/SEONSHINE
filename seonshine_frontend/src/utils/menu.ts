import { menuItems } from '@/constants/menu';

const matchPath = (path: string, pattern: string): boolean => {
  const regex = new RegExp(`^${pattern.replace(/:\w+/g, '\\w+')}$`);
  return regex.test(path);
};

export const getNameByPath = (path: string): string | null => {
  for (const item of menuItems) {
    if (matchPath(path, item.path)) {
      return item.name;
    }
    if (item.subPaths) {
      for (const subItem of item.subPaths) {
        if (matchPath(path, subItem.path)) {
          return subItem.name;
        }
      }
    }
  }
  return null;
};

export const getTitleByPath = (path: string): string => {
  return getNameByPath(`/${path}`) || '';
};

export const buildFullPath = (paths: string[], index: number): string => `/${paths.slice(0, index + 1).join('/')}`;
