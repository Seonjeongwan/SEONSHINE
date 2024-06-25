import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeRestaurantDb } from "../db/dbConfig.js";

class RestaurantAssigned extends Model {}
RestaurantAssigned.init(
  {
    weekday: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeRestaurantDb,
    modelName: tables.restaurantAssigned,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default RestaurantAssigned;
