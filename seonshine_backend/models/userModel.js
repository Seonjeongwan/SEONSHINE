import { DataTypes } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeUserDb } from "../db/dbConfig.js";

const User = sequelizeUserDb.define(
  tables.user,
  {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Employee number is required",
        },
        notEmpty: {
          msg: "Employee number cannot be empty",
        },
      },
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role is required",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User name is required",
        }
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Phone number is required",
        }
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Branch name is required",
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required",
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
      validate: {
        notNull: {
          msg: "Password is required",
        }
      },
    },
    user_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;
