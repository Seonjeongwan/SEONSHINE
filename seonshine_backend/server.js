//server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
const PORT = 5000; //db 5000번 포트

app.use(cors());
app.use(bodyParser.json());

app.post("/sign_up", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO Users (user_id, password_hash) VALUES (?, ?)";
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        res.status(500).send({ message: "Database error", error: err });
      } else {
        res.status(200).send({ message: "User registered successfully" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error hashing password", error });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM Users WHERE user_id = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err });
    } else if (results.length === 0) {
      res.status(401).send({ message: "Invalid credentials" });
    } else {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (isPasswordValid) {
        res.status(200).send({ message: "Login successful", user });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
