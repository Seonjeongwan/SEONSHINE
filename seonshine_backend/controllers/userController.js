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
    confirm_yn,
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
      "INSERT INTO user_db.users (user_id, role_id, username, phone_number, branch_id, email, password_hash, confirm_yn, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, '0', NOW(), NOW())";
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
        confirm_yn,
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
        if (user.confirm_yn === "1") {
          res
            .status(200)
            .send({ message: "Login successful", user, status: 200 });
        } else {
          res
            .status(401)
            .send({ message: "Please verify your email first", status: 401 });
        }
      } else {
        res.status(401).send({ message: "Invalid credentials", status: 401 });
      }
    }
  });
};
