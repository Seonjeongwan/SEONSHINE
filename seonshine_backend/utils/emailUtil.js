const nodemailer = require("nodemailer");
const mailerConfig = require("../config/mailer");

const transporter = nodemailer.createTransport(mailerConfig);

exports.sendVerificationCode = (email, code, callback) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "인증번호 요청",
    text: `SEONSHINE에서 보낸 메일입니다. 인증번호는 ${code}입니다.`,
  };

  transporter.sendMail(mailOptions, callback);
};
