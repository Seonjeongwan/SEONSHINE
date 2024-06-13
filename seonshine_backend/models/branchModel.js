import { DataTypes } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeCommonDb } from "../db/dbConfig.js";

const Branch = sequelizeCommonDb.define(
  tables.branch,
  {
    branch_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Branch name is required",
        },
        notEmpty: {
          msg: "Branch name cannot be empty",
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Branch;
