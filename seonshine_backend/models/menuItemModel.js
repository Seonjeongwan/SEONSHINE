import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeRestaurantDb } from "../db/dbConfig.js";

class MenuItem extends Model {}
MenuItem.init(
  {
    item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Menu item name is required",
        },
        notEmpty: {
          msg: "Menu item name cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    image_url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeRestaurantDb,
    modelName: tables.menuItems,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default MenuItem;
