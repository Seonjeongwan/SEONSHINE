import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeUserDb } from "../db/dbConfig.js";

class UserProfile extends Model {}
UserProfile.init(
  {
    profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User name is required",
        },
      },
    },
    birth_date: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    profile_picture_url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeUserDb,
    modelName: tables.userProfile,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default UserProfile;
