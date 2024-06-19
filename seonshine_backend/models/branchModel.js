import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeCommonDb } from "../db/dbConfig.js";

class Branch extends Model {}
Branch.init(
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
    sequelize: sequelizeCommonDb,
    modelName: tables.branch,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Branch;
