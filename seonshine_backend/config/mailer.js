import dotenv from "dotenv";
dotenv.config();

export default {
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

//module.exports = transporter;
