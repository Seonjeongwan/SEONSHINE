import express from 'express';
import { upload } from '../config/storage.js';
import { UserRole } from '../constants/auth.js';
import {
  changeUserAvatar,
  changeUserStatus,
  getUserDetail,
  getUserList,
  getUserWaitingConfirmList,
  updateUser,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateChangeStatus,
  validateGetUserList,
  validateUpdateUser,
} from '../middleware/validation/userValidate.js';
import { endpoints } from './endpoints.js';
import {
  userListSortKeys,
  waitingApprovalListSortKeys,
} from '../constants/validation.js';

const userRouter = express.Router();

//TODO: Validate request params with validate middleware
userRouter.get(
  endpoints.users.list,
  authenticateToken({ role: UserRole.admin }),
  validateGetUserList(userListSortKeys),
  getUserList
);

userRouter.get(
  endpoints.users.waitingConfirm,
  authenticateToken({ role: UserRole.admin }),
  validateGetUserList(waitingApprovalListSortKeys),
  getUserWaitingConfirmList
);

//TODO: Validate admin or current user can get detail
userRouter.get(endpoints.users.detail, authenticateToken(), getUserDetail);

userRouter.post(
  endpoints.users.changeStatus,
  authenticateToken({ role: UserRole.admin }),
  validateChangeStatus,
  changeUserStatus
);

userRouter.post(
  endpoints.users.changeAvatar,
  authenticateToken(),
  upload.single('file'),
  changeUserAvatar
);

userRouter.put(
  endpoints.users.edit,
  authenticateToken(),
  validateUpdateUser,
  updateUser
);

export default userRouter;
