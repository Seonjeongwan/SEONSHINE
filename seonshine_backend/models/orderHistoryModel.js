import { DataTypes, Model, Sequelize } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeOrderDb } from "../db/dbConfig.js";

class OrderHistory extends Model {}
OrderHistory.init(
  {
    order_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
    },
    restaurant_id: {
      type: DataTypes.STRING,
    },
    order_date: {
      type: DataTypes.DATEONLY,
    },
    total_amount: {
      type: DataTypes.INTEGER,
    },
    total_pay: {
      type: DataTypes.INTEGER,
    },
    status: {
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
    modelName: tables.orderHistory,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default OrderHistory;
