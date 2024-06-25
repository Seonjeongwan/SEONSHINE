import { DataTypes, Model, Sequelize } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeOrderDb } from "../db/dbConfig.js";

class OrderItem extends Model {}
OrderItem.init(
  {
    order_item_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    branch_id: {
      type: DataTypes.INTEGER,
    },
    restaurant_id: {
      type: DataTypes.STRING,
    },
    item_id: {
      type: DataTypes.INTEGER,
    },
    item_name: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATEONLY,
    },
    cancel_yn: {
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
    sequelize: sequelizeOrderDb,
    modelName: tables.orderItems,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default OrderItem;
