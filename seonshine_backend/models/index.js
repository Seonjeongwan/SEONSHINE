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

export { User, UserProfile };

