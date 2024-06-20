import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { UserStatus } from "../constants/auth.js";
import { errorCodes } from "../constants/errorCode.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { messageErrors, statusWithMessageLogin } from "../constants/message.js";
import { verificationTypes } from "../constants/verification.js";
import { User } from "../models/index.js";
import Verification from "../models/verificationModel.js";
import { sendVerificationCode } from "../utils/emailUtil.js";
import { getResponseErrors } from "../utils/responseParser.js";
import {
  deleteFromTemporaryDb,
  getFromTemporaryDb,
  saveToTemporaryDb,
} from "../utils/storage.js";
import { generateToken } from "../utils/token.js";

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
      return res
        .status(200)
        .send({ message: "Sending email verification successful" });
    }
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  } catch (error) {
    console.log("error :>> ", error);
    const response = getResponseErrors(error);
    res.status(response.status).json({ errors: response.errors });
  }
};

export const verifySignUp = async (req, res) => {
  try {
    const { code, email } = req.body;
    const verifyInfo = await Verification.findOne({
      where: {
        email: email.trim(),
        type: verificationTypes.signUp,
      },
      order: [["created_at", "DESC"]],
      raw: true,
    });
    if (verifyInfo && verifyInfo.code === code) {
      const currentTime = Date.now();
      if (currentTime > verifyInfo.expiration) {
        return res
          .status(httpStatusCodes.badRequest)
          .json({ message: messageErrors.verifyCodeExpires });
      }
      const userInfo = await getFromTemporaryDb(`signup-user-${email}`);
      if (userInfo) {
        const hashedPassword = await bcrypt.hash(userInfo.password, 10);
        const user = {
          ...userInfo,
          password: hashedPassword,
          user_status: UserStatus.waitingConfirm,
        };
        const userResponse = await User.create(user);
        await deleteFromTemporaryDb(`signup-user-${email}`);
        //Delete all verification code sign up by email
        await Verification.destroy({
          where: {
            email: email,
            type: verificationTypes.signUp,
          },
        });
        res.status(httpStatusCodes.created).json(userResponse);
      }
    } else {
      res
        .status(httpStatusCodes.badRequest)
        .json({ message: messageErrors.verifyCodeIncorrect });
    }
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: JSON.stringify(error) });
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
};

const sendAndSaveEmailVerificationCode = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 생성
  const expiration = Date.now() + 5 * 60 * 1000; // 5 minutes
  const verification = {
    email,
    code,
    type: verificationTypes.signUp,
    expiration,
  };
  let isSuccess = false;

  const userResponse = await Verification.create(verification);

  if (userResponse) {
    isSuccess = await sendVerificationCode(email, code);
  }
  // if (isSuccess) {
  //   await saveToTemporaryDb(`signup-verification-${email}`, code, 3000); // 5 minutes
  // }
  return isSuccess;
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
