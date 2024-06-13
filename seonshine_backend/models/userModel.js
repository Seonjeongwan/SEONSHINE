import { DataTypes, Model } from "sequelize";
import { tables } from "../constants/database.js";
import { sequelizeUserDb } from "../db/dbConfig.js";

// export default (sequelize) => {
class User extends Model {}
User.init(
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
        },
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Phone number is required",
        },
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: Branch,
      //   key: "branch_id",
      // },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
      validate: {
        notNull: {
          msg: "Password is required",
        },
      },
    },
    user_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeUserDb,
    modelName: tables.user,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// User.belongsTo(Branch, { foreignKey: "branch_id" });

export default User;
// };

// const User = sequelizeUserDb.define(
//   tables.user,
//   {

//   {
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

// export default User;
