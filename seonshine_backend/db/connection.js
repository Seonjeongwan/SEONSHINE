const mysql = require("mysql2/promise");
const dbConfig = require("../config/db");

const createConnection = async (database) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "seonshine_mgr",
    password: "seonshine@2",
    database: database,
    port: "3306",
  });

  connection.connect((err) => {
    if (err) {
      console.error(`Database connection to ${database} failed: ` + err.stack);
    } else {
      console.log(`Connected to ${database}.`);
    }
  });

  return connection;
};

const userDb = createConnection(dbConfig.userDatabase);
const commonDb = createConnection(dbConfig.commonDatabase);
const restaurantDb = createConnection(dbConfig.restaurantDatabase);
const orderDb = createConnection(dbConfig.orderDatabase);

module.exports = {
  userDb,
  commonDb,
  restaurantDb,
  orderDb,
};
