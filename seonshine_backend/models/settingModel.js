import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeCommonDb } from "../db/dbConfig.js";

class Settings extends Model {}
Settings.init(
  {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeCommonDb,
    modelName: tables.settings,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Settings;
