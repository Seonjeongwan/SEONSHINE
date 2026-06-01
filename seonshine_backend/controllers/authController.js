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
import {
  OTP_MAX_ATTEMPTS,
  getOtpAttempts,
  getResendCooldownRemaining,
  incrementOtpAttempts,
  resetOtpAttempts,
  startResendCooldown,
} from "../utils/otpSecurity.js";
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

    // 발송 남용 방지: 쿨다운 중이면 거부
    const cooldown = await getResendCooldownRemaining(
      verificationTypes.signUp,
      email
    );
    if (cooldown > 0) {
      return res.status(httpStatusCodes.tooManyRequests).send({
        message: messageErrors.resendCooldown,
        error: messageErrors.resendCooldown,
        retryAfter: cooldown,
      });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.signUp
    );

    if (isSuccessSendingEmailCode) {
      await saveToTemporaryDb(`signup-user-${email}`, user, 86400);
      await startResendCooldown(verificationTypes.signUp, email);
      await resetOtpAttempts(verificationTypes.signUp, email);
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

    // 무차별 대입 방지: 실패 시도 누적이 한도를 넘으면 새 코드 발급 전까지 차단
    const attempts = await getOtpAttempts(verificationTypes.signUp, email);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return res
        .status(httpStatusCodes.tooManyRequests)
        .json({ message: messageErrors.verifyCodeTooManyAttempts });
    }

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
      if (!userInfo) {
        // 임시 저장된 가입 정보가 만료/소실된 경우 (응답 누락으로 인한 요청 hang 방지)
        return res
          .status(httpStatusCodes.badRequest)
          .json({ message: messageErrors.signupSessionExpired });
      }
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
      await resetOtpAttempts(verificationTypes.signUp, email);
      return res.status(httpStatusCodes.created).json(userResponse);
    } else {
      const currentAttempts = await incrementOtpAttempts(
        verificationTypes.signUp,
        email
      );
      const attemptsRemaining = Math.max(OTP_MAX_ATTEMPTS - currentAttempts, 0);
      return res.status(httpStatusCodes.badRequest).json({
        message: messageErrors.verifyCodeIncorrect,
        attemptsRemaining,
      });
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

    // 발송 남용 방지: 쿨다운 중이면 거부
    const cooldown = await getResendCooldownRemaining(
      verificationTypes.signUp,
      email
    );
    if (cooldown > 0) {
      return res.status(httpStatusCodes.tooManyRequests).send({
        message: messageErrors.resendCooldown,
        error: messageErrors.resendCooldown,
        retryAfter: cooldown,
      });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.signUp
    );

    if (isSuccessSendingEmailCode) {
      await startResendCooldown(verificationTypes.signUp, email);
      await resetOtpAttempts(verificationTypes.signUp, email);
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

    // 존재하지 않는 이메일이면 여기서 종료 (return 누락으로 인한 이중 응답 버그 수정)
    if (!isExist) {
      return res
        .status(httpStatusCodes.notFound)
        .json({ error: "Email not found" });
    }

    // 발송 남용 방지: 쿨다운 중이면 거부
    const cooldown = await getResendCooldownRemaining(
      verificationTypes.forgotPassword,
      email
    );
    if (cooldown > 0) {
      return res.status(httpStatusCodes.tooManyRequests).send({
        message: messageErrors.resendCooldown,
        error: messageErrors.resendCooldown,
        retryAfter: cooldown,
      });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.forgotPassword
    );

    if (isSuccessSendingEmailCode) {
      await startResendCooldown(verificationTypes.forgotPassword, email);
      await resetOtpAttempts(verificationTypes.forgotPassword, email);
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

    // 등록되지 않은 이메일로의 코드 발송(이메일 스팸) 방지
    const user = await User.findOne({ where: { email: email.trim() } });
    if (!user) {
      return res
        .status(httpStatusCodes.notFound)
        .json({ error: "Email not found" });
    }

    // 발송 남용 방지: 쿨다운 중이면 거부
    const cooldown = await getResendCooldownRemaining(
      verificationTypes.forgotPassword,
      email
    );
    if (cooldown > 0) {
      return res.status(httpStatusCodes.tooManyRequests).send({
        message: messageErrors.resendCooldown,
        error: messageErrors.resendCooldown,
        retryAfter: cooldown,
      });
    }

    const isSuccessSendingEmailCode = await sendAndSaveEmailVerificationCode(
      email,
      verificationTypes.forgotPassword
    );

    if (isSuccessSendingEmailCode) {
      await startResendCooldown(verificationTypes.forgotPassword, email);
      await resetOtpAttempts(verificationTypes.forgotPassword, email);
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

    // 무차별 대입 방지: 실패 시도 누적이 한도를 넘으면 새 코드 발급 전까지 차단
    const attempts = await getOtpAttempts(
      verificationTypes.forgotPassword,
      email
    );
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return res
        .status(httpStatusCodes.tooManyRequests)
        .json({ message: messageErrors.verifyCodeTooManyAttempts });
    }

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
      // 코드 재사용 방지: 검증 성공 시 해당 이메일의 비밀번호 찾기 코드 모두 삭제
      await Verification.destroy({
        where: {
          email: email,
          type: verificationTypes.forgotPassword,
        },
      });
      await resetOtpAttempts(verificationTypes.forgotPassword, email);
      const secretKey = process.env.TOKEN_SECRET_KEY;
      const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
      return res
        .status(httpStatusCodes.success)
        .json({ message: "OTP verified", token: token });
    } else {
      const currentAttempts = await incrementOtpAttempts(
        verificationTypes.forgotPassword,
        email
      );
      const attemptsRemaining = Math.max(OTP_MAX_ATTEMPTS - currentAttempts, 0);
      return res.status(httpStatusCodes.badRequest).json({
        message: messageErrors.verifyCodeIncorrect,
        attemptsRemaining,
      });
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

    // 서버측 비밀번호 정책 검증 (회원가입 정책과 동일: 6~50자)
    if (typeof password !== "string" || password.length < 6 || password.length > 50) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: messageErrors.passwordPolicy });
    }

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
