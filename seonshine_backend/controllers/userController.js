import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { UserStatus } from "../constants/auth.js";
import { errorCodes } from "../constants/errorCode.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { messageErrors, statusWithMessageLogin } from "../constants/message.js";
import User from "../models/userModel.js";
import { sendVerificationCode } from "../utils/emailUtil.js";
import { getResponseErrors } from "../utils/responseParser.js";
import { saveToTemporaryDb } from "../utils/storage.js";
import { generateToken } from "../utils/token.js";
// const { userDb } = require("../db/connection");

export const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(httpStatusCodes.success).send(users);
};

export const signUp = async (req, res) => {
  try {
    const user = req.body;
    const { email, password, user_id } = user;
    const isExistIdOrEmail = await checkIdEmailExist(user_id, password);
    if (isExistIdOrEmail) {
      return res.status(httpStatusCodes.conflict).send({
        message: messageErrors.idOrEmailExist,
        errorCode: errorCodes.idOrEmailExist,
      });
    }
    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email
    );
    if (isSuccessSendingEmailCode) {
      await saveToTemporaryDb(`signup-user-${email}`, user, 86400);
      return res.status(200).send("Sending email verification successful");
    }
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
    // const hashedPassword = await bcrypt.hash(user.password, 10);
    // user.user_status = UserStatus.waitingConfirm;
    // user.password = hashedPassword;
    // const userResponse = await User.create(user);
    // res.status(httpStatusCodes.created).json(userResponse);
  } catch (error) {
    console.log('error :>> ', error);
    const response = getResponseErrors(error);
    res.status(response.status).json({ errors: response.errors });
  }
};

export const login = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const user = await User.findByPk(user_id, { raw: true });
    if (user) {
      // @ts-ignore
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // @ts-ignore
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

export const checkIdEmailExist = async (userId, email) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ user_id: userId.trim() }, { email: email.trim() }],
    },
  });

  const isExist = !!user;
  return isExist;
  // const duplicateQuery =
  //   "SELECT * FROM user_db.users WHERE user_id = ? OR email = ?";
  // userDb.query(duplicateQuery, [user_id, email], (err, results) => {
  //   if (err) {
  //     return res.status(500).send({ message: "Database error", error: err });
  //   }
  //   if (results.length > 0) {
  //     return res
  //       .status(409)
  //       .send({ message: "User ID or Email already exists", status: 409 });
  //   }
  //   res
  //     .status(200)
  //     .send({ message: "User ID and Email are available", status: 200 });
  // });
};

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

const sendAndSaveEmailVerificationCode = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 생성
  const isSuccess = await sendVerificationCode(email, code);
  if (isSuccess) {
    await saveToTemporaryDb(`signup-verification-${email}`, code, 3000); // 5 minutes
  }
  return isSuccess;
};
