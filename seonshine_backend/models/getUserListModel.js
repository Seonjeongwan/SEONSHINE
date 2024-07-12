import { DataTypes, Model } from 'sequelize';
import { sequelizeUserDb } from '../db/dbConfig.js';
import { sortTypeOptions } from '../constants/validation.js';

class GetUserListValidationModel extends Model {
  static sortableFields = [];

  static setSortableFields(fields) {
    this.sortableFields = fields;
  }
}

GetUserListValidationModel.init(
  {
    page_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Page size is required.',
        },
        isInt: {
          msg: 'Page size must be a positive integer',
        },
        min: {
          args: [5],
          msg: 'Page size must be greater than or equal to 5',
        },
      },
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Page number is required.',
        },
        isInt: {
          msg: 'Page number must be a positive integer',
        },
        min: {
          args: [1],
          msg: 'Page number must be a greater than or equal to 1',
        },
      },
    },
    sort_key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Sort Key is required',
        },
        notEmpty: {
          msg: 'Sort key cannot be empty',
        },
        isValidSortKey(value) {
          if (!GetUserListValidationModel.sortableFields.includes(value)) {
            throw new Error(
              `Invalid sort key. Must be one of: ${GetUserListValidationModel.sortableFields.join(
                ', '
              )}`
            );
          }
        },
      },
    },
    sort_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Sort type is required',
        },
        isIn: {
          args: [sortTypeOptions],
          msg: 'Sort type be either asc or desc',
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

export default GetUserListValidationModel;
