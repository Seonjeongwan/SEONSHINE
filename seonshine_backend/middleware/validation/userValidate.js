import { ValidationError } from "sequelize";
import { UserRole, UserStatus } from "../../constants/auth.js";
import { httpStatusCodes } from "../../constants/http.js";
import User from "../../models/userModel.js";
import UpdateUser from "../../models/updateUserModel.js";
import GetUserListValidationModel from "../../models/getUserListModel.js";
import { userIdRegex } from "../../constants/regex.js";

export const validateChangeStatus = (req, res, next) => {
  const { status, user_id } = req.body;
  const currentUser = req.user;
  const roleId = Number(currentUser?.role_id);
  const userStatus = Number(currentUser?.user_status);

  if (!status) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Status is required" });
  }

  if (!Object.values(UserStatus).includes(Number(status))) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid status" });
  }

  if (!user_id) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "User Id is require" });
  }

  if (roleId === UserRole.admin) {
    if (status === UserStatus.inactive) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Admin user can't change this status" });
    }
  } else {
    if (user_id !== currentUser.user_id) {
      return res.status(httpStatusCodes.badRequest).json({
        error: "Restaurant/ normal users can only change their own status",
      });
    }
    if (status === UserStatus.inactiveByAdmin) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Restaurant/ normal users can't change this status" });
    }
    if (status === UserStatus.active) {
      if (userStatus !== UserStatus.inactive) {
        return res.status(httpStatusCodes.badRequest).json({
          error:
            "Only restaurant/ normal users can active if their account status is inactive",
        });
      }
    }
  }

  next();
};

export const validateUser = async (req, res, next) => {
  // Create a temporary User instance to validate the input data
  const user = User.build(req.body);

  try {
    await user.validate();
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => err.message);
      return res
        .status(httpStatusCodes.badRequest)
        .json({ errors: validationErrors });
    }
    next(error);
  }
};

export const validateUpdateUser = async (req, res, next) => {
  const dataUpdateUser = UpdateUser.build(req.body);

  try {
    await dataUpdateUser.validate();
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => err.message);
      return res
        .status(httpStatusCodes.badRequest)
        .json({ errors: validationErrors });
    }
  }
};

export const validateGetUserList = (sortableFields) => {
  return async (req, res, next) => {
    GetUserListValidationModel.setSortableFields(sortableFields);
    const getUserListParams = GetUserListValidationModel.build(req.query);

    try {
      await getUserListParams.validate();
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors = error.errors.map((err) => err.message);
        return res
          .status(httpStatusCodes.badRequest)
          .json({ errors: validationErrors });
      }
      next(error);
    }
  };
};

export const validateGetUserDetail = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "User id is required." });
  }

  if (id.trim() === "") {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "User id cannot be empty." });
  }

  if (!userIdRegex.test(id)) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid User id" });
  }
  next();
};

export const validateChangeAvatar = async (req, res, next) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 5 * 1024 * 1024;
  try {
    const file = req.file;
    const userId = req.params.id;
    const currentUser = req.user;

    if (
      currentUser.role_id !== UserRole.admin &&
      currentUser.user_id !== userId
    ) {
      return res
        .status(httpStatusCodes.forbidden)
        .json({ message: "You do not have permission to change this avatar." });
    }

    if (file) {
      if (!allowedFileTypes.includes(file.mimetype)) {
        return res.status(httpStatusCodes.badRequest).json({
          message: "Invalid file type. Only JPEG, JPG, and PNG are allowed.",
        });
      }

      if (file.size > maxSize) {
        return res
          .status(httpStatusCodes.badRequest)
          .json({ message: "File size exceeds the limit of 5MB." });
      }
    }

    next();
  } catch (error) {
    console.error("Error in validation middleware:", error);
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ error: "Internal Server Error" });
  }
};
