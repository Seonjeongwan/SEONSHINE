import { DataTypes } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeUserDb } from "../db/dbConfig.js";

const Verification = sequelizeUserDb.define(
  tables.verification,
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email is required",
        },
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Code is required",
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type is required",
        },
      },
    },
    expiration: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Verification;
