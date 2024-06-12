import bcrypt from "bcrypt";
import { UserStatus } from "../constants/auth.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { statusWithMessageLogin } from "../constants/message.js";
import User from "../models/userModel.js";
import { getResponseErrors } from "../utils/responseParser.js";
import { generateToken } from "../utils/token.js";
// const { userDb } = require("../db/connection");

export const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(httpStatusCodes.success).send(users);
};

export const signUp = async (req, res) => {
  try {
    const user = req.body;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.user_status = UserStatus.waitingConfirm;
    user.password = hashedPassword;
    const userResponse = await User.create(user);
    res.status(httpStatusCodes.created).json(userResponse);
  } catch (error) {
    const response = getResponseErrors(error);
    res.status(response.status).json({ errors: response.errors });
  }
};

export const login = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const user = await User.findByPk(user_id, { raw: true });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const userStatus = user.user_status;
        const response = {};
        response.message = statusWithMessageLogin[userStatus];
        response.user_status = userStatus;
        if (String(userStatus) === String(UserStatus.active)) {
          const token = generateToken(user);
          response.user = { ...user, token };
        }
        res.status(httpStatusCodes.success).send(response);
      } else {
        res
          .status(httpStatusCodes.unauthorized)
          .send({ message: "Invalid credentials", status: 401 });
      }
    } else {
      res
        .status(httpStatusCodes.badRequest)
        .json({ message: "User not exist" });
    }
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

// export const checkIdEmail = (req, res) => {
//   const { user_id, email } = req.body;

//   if (!user_id && !email) {
//     return res
//       .status(400)
//       .send({ message: "User ID or Email is required", status: 400 });
//   }

//   const duplicateQuery =
//     "SELECT * FROM user_db.users WHERE user_id = ? OR email = ?";
//   userDb.query(duplicateQuery, [user_id, email], (err, results) => {
//     if (err) {
//       return res.status(500).send({ message: "Database error", error: err });
//     }
//     if (results.length > 0) {
//       return res
//         .status(409)
//         .send({ message: "User ID or Email already exists", status: 409 });
//     }
//     res
//       .status(200)
//       .send({ message: "User ID and Email are available", status: 200 });
//   });
// };

// export const confirmSignin = (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res.status(400).send({ message: "User ID is required" });
//   }

//   const query =
//     "UPDATE user_db.users SET user_status = '1', updated_at = NOW() WHERE user_id = ?";
//   userDb.query(query, [user_id], (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: "Database error", error: err });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send({ message: "User not found" });
//     }
//     res
//       .status(200)
//       .send({ message: "User confirmed successfully", status: 200 });
//   });
// };
