import OrderHistory from "./orderHistoryModel.js";
import OrderItem from "./orderItemModel.js";
import User from "./userModel.js";
import UserProfile from "./userProfileModel.js";

User.hasOne(UserProfile, {
  foreignKey: "user_id",
  as: "profile",
});

UserProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

OrderHistory.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "orderItem",
});

OrderItem.belongsTo(OrderHistory, {
  foreignKey: "order_id",
  as: "orderHistory",
});

export { OrderHistory, OrderItem, User, UserProfile };

