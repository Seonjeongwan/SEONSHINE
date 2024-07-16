import { DataTypes, Model } from "sequelize";
import { sequelizeUserDb } from "../db/dbConfig.js";
import { UserRole } from "../constants/auth.js";

const signUpAllowedRoles = [UserRole.user, UserRole.restaurant];

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
          args: [8, 20],
          msg: "User ID must be between 8 and 20 characters long",
        },
        is: {
          args: /^[a-zA-Z0-9]+$/,
          msg: "User ID can only contain numbers and alphabetic characters",
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
        isIn: {
          args: [signUpAllowedRoles],
          msg: "Only roles user and restaurant are allowed",
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
          args: [6, 50],
          msg: "Password must be between 6 and 50 characters long",
        },
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isRequiredBasedRole(value) {
          if (this.role_id == UserRole.user && !value) {
            throw new Error("Branch is required");
          }
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        isRequiredBasedRole(value) {
          if (this.role_id == UserRole.restaurant && !value) {
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
