const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "seonshine_mgr",
  password: "seonshine@2",
  database: "",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connection to the database: ", err);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = connection;
