import dbConfig from '../config/db.js';

export const USER_DATABASE = dbConfig.userDatabase;
export const COMMON_DATABASE = dbConfig.commonDatabase;
export const RESTAURANT_DATABASE = dbConfig.restaurantDatabase;
export const ORDER_DATABASE = dbConfig.orderDatabase;

export const tables = {
  branch: "branch_info",
  user: "users",
  verification: "verification",
  userProfile: "user_profiles",
  userActivities: "user_activities",
  restaurantAssigned: "restaurant_assigned",
  menuItems: "menu_items",
  orderHistory: "order_history",
  orderItems: "order_items",
};
