import { httpStatusCodes } from "../../constants/http.js";
import { UserRole } from "../../constants/auth.js";

export const validateCreateMenuItem = async (req, res, next) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 5 * 1024 * 1024;
  try {
    const { name, restaurant_id } = req.body;
    const file = req.file;
    const currentUser = req.user;

    if (!name) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Menu item name is required" });
    }

    if (!restaurant_id) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Restaurant id is required" });
    }

    if (
      currentUser.role_id == UserRole.user ||
      (currentUser.role_id == UserRole.restaurant &&
        currentUser.user_id != restaurant_id)
    ) {
      return res
        .status(httpStatusCodes.forbidden)
        .json({ message: "You do not have permission to create menu item." });
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

export const validateUpdateMenuItem = async (req, res, next) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 5 * 1024 * 1024;
  try {
    const { name } = req.body;
    const file = req.file;
    if (!name) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Menu item name is required" });
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
