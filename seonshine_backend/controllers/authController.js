import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { UserStatus } from "../constants/auth.js";
import { errorCodes } from "../constants/errorCode.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { messageErrors, statusWithMessageLogin } from "../constants/message.js";
import { verificationTypes } from "../constants/verification.js";
import { User, UserProfile } from "../models/index.js";
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
    const { email, user_id } = user;
    const isExistIdOrEmail = await checkIdEmailExist(user_id, email);
    if (isExistIdOrEmail) {
      return res.status(httpStatusCodes.conflict).send({
        message: messageErrors.idOrEmailExist,
        errorCode: errorCodes.idOrEmailExist,
      });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.signUp
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
        await UserProfile.create({
          user_id: userResponse.user_id,
          address: userInfo.address || "",
        });
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
};

const sendAndSaveEmailVerificationCode = async (email, type) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 생성
  const expiration = Date.now() + 5 * 60 * 1000; // 5 minutes
  const verification = {
    email,
    code,
    type,
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
        if (
          String(userStatus) === String(UserStatus.active) ||
          String(userStatus) === String(UserStatus.inactive)
        ) {
          const token = generateToken(user);
          response.user = { ...user, token };
        }
        return res.status(httpStatusCodes.success).send(response);
      }
    }
    return res.status(httpStatusCodes.badRequest).send({
      message: messageErrors.incorrectIdPassword,
      errorCode: errorCodes.incorrectIdAndPassword,
    });
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const resendOtpSignUp = async (req, res) => {
  try {
    const { email } = req.body;
    const userInfo = await getFromTemporaryDb(`signup-user-${email}`);
    if (!userInfo) {
      return res.status(httpStatusCodes.badRequest).send({
        error: "User signup information not found. Please sign up again",
      });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.signUp
    );

    if (isSuccessSendingEmailCode) {
      return res
        .status(200)
        .send({ message: "Resend email verification successful" });
    }
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const sendOtpForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email: email.trim(),
      },
    });

    const isExist = !!user;

    if (!isExist) {
      res.status(httpStatusCodes.notFound).json({ error: "Email not found" });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.forgotPassword
    );

    if (isSuccessSendingEmailCode) {
      return res
        .status(200)
        .send({ message: "Sending email verification successful" });
    }
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const resendOtpForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.forgotPassword
    );

    if (isSuccessSendingEmailCode) {
      return res
        .status(200)
        .send({ message: "Resend email verification successful" });
    }
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const verifyOtpForgotPassword = async (req, res) => {
  try {
    const { code, email } = req.body;
    const verifyInfo = await Verification.findOne({
      where: {
        email: email.trim(),
        type: verificationTypes.forgotPassword,
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
      const secretKey = process.env.TOKEN_SECRET_KEY;
      const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
      return res
        .status(httpStatusCodes.success)
        .json({ message: "OTP verified", token: token });
    } else {
      res
        .status(httpStatusCodes.badRequest)
        .json({ message: messageErrors.verifyCodeIncorrect });
    }
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const secretKey = process.env.TOKEN_SECRET_KEY;
    const decodedToken = jwt.verify(token, secretKey);

    const user = await User.findOne({
      where: {
        email: decodedToken.email.trim(),
      },
    });

    console.log("user :>> ", user);

    if (!user) {
      return res.status(400).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({
      password: hashedPassword,
    });

    res.status(200).json({ message: "Reset password successfully" });
  } catch (error) {
    res.status(httpStatusCodes.badRequest).send("Invalid or expired token");
  }
};
