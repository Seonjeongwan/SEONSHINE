import nodemailer from "nodemailer";
import mailerConfig from "../config/mailer.js";

const transporter = nodemailer.createTransport(mailerConfig);

export const sendVerificationCode = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "인증번호 요청",
      text: `SEONSHINE에서 보낸 메일입니다. 인증번호는 ${code}입니다.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email send info :>> ", info);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};
