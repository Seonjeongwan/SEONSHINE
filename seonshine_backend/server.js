require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const commonRoutes = require("./routes/commonRoutes");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/common", commonRoutes);

//initializeDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
