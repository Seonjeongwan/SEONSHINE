import { DataTypes, Model } from "sequelize";
import { sequelizeUserDb } from "../db/dbConfig.js";

class SignUp extends Model {}

SignUp.init(
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User ID is required",
        },
        len: {
          args: [8, 255],
          msg: "User ID must be between 8 and 255 characters long",
        },
      },
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role ID is required",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username is required",
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
        isNumeric: {
          msg: "Phone number must contain only numbers",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required",
        },
        len: {
          args: [6, 255],
          msg: "Password must be between 6 and 255 characters long",
        },
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isRequiredForRoleId1(value) {
          if (this.role_id === "1" && !value) {
            throw new Error("Branch is required");
          }
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        isRequiredForRoleId2(value) {
          if (this.role_id === "2" && !value) {
            throw new Error("Address is required");
          }
        },
      },
    },
  },
  {
    sequelize: sequelizeUserDb,
    modelName: "",
  }
);

export default SignUp;
