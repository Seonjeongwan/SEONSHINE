import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeCommonDb } from "../db/dbConfig.js";

class Upload extends Model {}
Upload.init(
  {
    file_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    original_name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    filename: {
      type: DataTypes.STRING,
    },
    full_path: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: sequelizeCommonDb,
    modelName: tables.uploads,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Upload;
