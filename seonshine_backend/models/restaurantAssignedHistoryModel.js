import { DataTypes, Model, Sequelize } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeRestaurantDb } from "../db/dbConfig.js";

class RestaurantAssignedHistory extends Model {}
RestaurantAssignedHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    restaurant_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_name: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize: sequelizeRestaurantDb,
    modelName: tables.restaurantAssignedHistory,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default RestaurantAssignedHistory;
