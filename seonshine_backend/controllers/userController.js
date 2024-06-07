const bcrypt = require("bcrypt");
const { userDb } = require("../db/connection");

exports.signUp = async (req, res) => {
  const {
    user_id,
    role_id,
    username,
    phone_number,
    branch_id,
    email,
    password,
  } = req.body;

  if (
    !user_id ||
    !role_id ||
    !username ||
    !phone_number ||
    !branch_id ||
    !email ||
    !password
  ) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO user_db.users (user_id, role_id, username, phone_number, branch_id, email, password_hash, user_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, '0', NOW(), NOW())";
    userDb.query(
      query,
      [
        user_id,
        role_id,
        username,
        phone_number,
        branch_id,
        email,
        hashedPassword,
      ],
      (err, result) => {
        if (err) {
          res.status(500).send({ message: "Database error", error: err });
        } else {
          res
            .status(200)
            .send({ message: "User registered successfully", status: 200 });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Error hashing password", error });
  }
};

exports.login = (req, res) => {
  const { user_id, password } = req.body;

  const query = "SELECT * FROM user_db.users WHERE user_id = ?";
  userDb.query(query, [user_id], async (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err });
    } else if (results.length === 0) {
      res.status(401).send({ message: "Invalid credentials", status: 401 });
    } else {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (isPasswordValid) {
        switch (user.user_status) {
          case "0":
            res.status(200).send({
              message: "Admin confirmation needed",
              user_status: user.user_status,
            });
            break;
          case "1":
            res.status(200).send({
              message: "Login successful",
              user,
              user_status: user.user_status,
            });
            break;
          case "2":
            res.status(200).send({
              message: "Account reactivation needed",
              user_status: user.user_status,
            });
            break;
          case "9":
            res.status(200).send({
              message: "Account suspended",
              user_status: user.user_status,
            });
            break;
          default:
            res
              .status(500)
              .send({ message: "Unknown account status", status: 500 });
            break;
        }
      } else {
        res.status(401).send({ message: "Invalid credentials", status: 401 });
      }
    }
  });
};

exports.checkIdEmail = (req, res) => {
  const { user_id, email } = req.body;

  if (!user_id && !email) {
    return res
      .status(400)
      .send({ message: "User ID or Email is required", status: 400 });
  }

  const duplicateQuery =
    "SELECT * FROM user_db.users WHERE user_id = ? OR email = ?";
  userDb.query(duplicateQuery, [user_id, email], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Database error", error: err });
    }
    if (results.length > 0) {
      return res
        .status(409)
        .send({ message: "User ID or Email already exists", status: 409 });
    }
    res
      .status(200)
      .send({ message: "User ID and Email are available", status: 200 });
  });
};

exports.confirmSignin = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send({ message: "User ID is required" });
  }

  const query =
    "UPDATE user_db.users SET user_status = '1', updated_at = NOW() WHERE user_id = ?";
  userDb.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res
      .status(200)
      .send({ message: "User confirmed successfully", status: 200 });
  });
};
