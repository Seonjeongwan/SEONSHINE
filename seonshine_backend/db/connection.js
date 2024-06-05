const mysql = require("mysql");
const dbConfig = require("../config/db");

const createConnection = (database) => {
  return mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: database,
    port: dbConfig.port,
  });
};

const userDb = createConnection(dbConfig.userDatabase);
const commonDb = createConnection(dbConfig.commonDatabase);
const restaurantDb = createConnection(dbConfig.restaurantDatabase);
const orderDb = createConnection(dbConfig.orderDatabase);

const connectToDatabase = (db, dbName) => {
  db.connect((err) => {
    if (err) {
      console.error(`Database connection to ${dbName} failed: ` + err.stack);
      return;
    }
    console.log(`Connected to ${dbName}.`);
  });
};

connectToDatabase(userDb, "user_db");
connectToDatabase(commonDb, "common_db");
connectToDatabase(restaurantDb, "restaurant_db");
connectToDatabase(orderDb, "order_db");

module.exports = {
  userDb,
  commonDb,
  restaurantDb,
  orderDb,
};
