import dayjs from 'dayjs';
import { DataTypes, Model } from 'sequelize';
import { dateTimeFormat } from '../constants/format.js';
import { phoneNumberRegex } from '../constants/regex.js';
import { sequelizeUserDb } from '../db/dbConfig.js';

class UpdateUser extends Model {}
UpdateUser.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username is required.',
        },
        notEmpty: {
          msg: 'Username cannot be empty.',
        },
      },
    },
    birth_date: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidDate(value) {
          if (!!value && !dayjs(value, dateTimeFormat.short, true).isValid()) {
            throw new Error('Invalid date format.');
          }
        },
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Branch ID is required.',
        },
        isInt: {
          msg: 'Branch ID must be an integer.',
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone number is required.',
        },
        notEmpty: {
          msg: 'Phone number cannot be empty.',
        },
        isValidPhoneNumber(value) {
          if (!!value && !phoneNumberRegex.test(value)) {
            throw new Error('Invalid phone number format.');
          }
        },
      },
    },
  },
  {
    sequelize: sequelizeUserDb,
    modelName: '',
    timestamps: true,
  }
);

export default UpdateUser;
