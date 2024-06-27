import { Sequelize } from "sequelize";
import dbConfig from "../config/db.js";

const commonConfig = {
  host: dbConfig.host,
  username: dbConfig.user,
  password: dbConfig.password,
  dialect: "mysql",
  // dialectOptions: {
  //   useUTC: false, // for reading from database
  // },
  timezone: "+09:00", // for writing to database with timezone is Seoul
  define: {
    freezeTableName: true,
  },
  // dialectModule: 'mysql2'
};

export const sequelizeCommonDb = new Sequelize(
  dbConfig.commonDatabase,
  commonConfig.username,
  commonConfig.password,
  {
    ...commonConfig,
    database: dbConfig.commonDatabase,
  }
);

export const sequelizeUserDb = new Sequelize(
  dbConfig.userDatabase,
  commonConfig.username,
  commonConfig.password,
  {
    ...commonConfig,
    database: dbConfig.userDatabase,
  }
);

export const sequelizeRestaurantDb = new Sequelize(
  dbConfig.restaurantDatabase,
  commonConfig.username,
  commonConfig.password,
  {
    ...commonConfig,
    database: dbConfig.restaurantDatabase,
  }
);

export const sequelizeOrderDb = new Sequelize(
  dbConfig.orderDatabase,
  commonConfig.username,
  commonConfig.password,
  {
    ...commonConfig,
    database: dbConfig.orderDatabase,
  }
);
