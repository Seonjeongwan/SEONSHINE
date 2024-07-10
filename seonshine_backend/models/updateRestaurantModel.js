import { DataTypes, Model } from 'sequelize';
import { phoneNumberRegex } from '../constants/regex.js';
import { sequelizeUserDb } from '../db/dbConfig.js';

class UpdateRestaurant extends Model {}
UpdateRestaurant.init(
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
    timestamps: false,
  }
);

export default UpdateRestaurant;
