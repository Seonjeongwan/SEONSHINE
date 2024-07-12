import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { httpStatusCodes } from '../constants/http.js';
dotenv.config();

export const authenticateToken = (options = {}) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Extract authorize token from Bearer
    const secretKey = process.env.TOKEN_SECRET_KEY;

    if (!token) return res.sendStatus(httpStatusCodes.unauthorized);

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(httpStatusCodes.forbidden);
      const { role = '' } = options;
      if ((role || role === 0) && String(role) !== String(user.role_id)) {
        return res.sendStatus(httpStatusCodes.forbidden);
      }
      req.user = user;
      next();
    });
  };
};
