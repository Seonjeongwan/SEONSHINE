import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.USER_DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
