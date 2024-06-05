require("dotenv").config();

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  userDatabase: process.env.USER_DB_NAME,
  commonDatabase: process.env.COMMON_DB_NAME,
  restaurantDatabase: process.env.RESTAURANT_DB_NAME,
  orderDatabase: process.env.ORDER_DB_NAME,
  port: 3360,
};
