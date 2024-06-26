import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const generateToken = (user) => {
  const secretKey = process.env.TOKEN_SECRET_KEY;
  const expireInHours = process.env.TOKEN_EXPIRE_IN_HOURS;
  const { user_id, username, role_id, user_status, branch_id } = user;
  const payload = {
    user_id,
    username,
    role_id,
    user_status,
    branch_id,
  };

  const options = {
    expiresIn: `${expireInHours}h`,
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};
