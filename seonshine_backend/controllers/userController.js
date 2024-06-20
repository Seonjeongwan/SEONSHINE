import FormData from "form-data";
import { Op, QueryTypes, Sequelize } from "sequelize";
import httpUpload from "../config/axiosUpload.js";
import { UserRole, UserStatus } from "../constants/auth.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { sequelizeUserDb } from "../db/dbConfig.js";
import Branch from "../models/branchModel.js";
import { User, UserProfile } from "../models/index.js";
import Upload from "../models/uploadModel.js";

export const getUserList = async (req, res) => {
  const {
    page_size = 25,
    page_number = 1,
    sort_key = "updated_at",
    sort_type = "asc",
    user_id = "",
    username = "",
    branch_name = "",
  } = req.query;
  const offset = (page_number - 1) * page_size;
  const select =
    "SELECT u.user_id, u.username, u.user_status, b.branch_name FROM user_db.users u LEFT JOIN common_db.branch_info b ON u.branch_id = b.branch_id";
  const where =
    "WHERE user_status IN(:user_status) AND role_id = 1 AND user_id LIKE :user_id AND username LIKE :username AND branch_name LIKE :branch_name";
  const sorting = `ORDER BY ${sort_key} ${sort_type.toUpperCase()}`;
  const paging = "LIMIT :page_size OFFSET :offset";
  const query = `${select} ${where} ${sorting} ${paging}`;

  const countSelect = `SELECT COUNT(*) AS total FROM user_db.users u LEFT JOIN common_db.branch_info b ON u.branch_id = b.branch_id`;
  const countQuery = `${countSelect} ${where}`;
  const queryParams = {
    page_size: Number(page_size),
    offset: Number(offset),
    user_id: `%${user_id}%`,
    username: `%${username}%`,
    branch_name: `%${branch_name}%`,
    user_status: ["1", "2", "9"],
  };

  try {
    const users = await sequelizeUserDb.query(query, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    const usersWithoutPassword = users.map((user) => {
      delete user.password_hash;
      return user;
    });

    const countResult = await sequelizeUserDb.query(countQuery, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    const totalRecords = countResult?.[0]?.total || 0;

    res.status(httpStatusCodes.success).send({
      data: usersWithoutPassword,
      page_number,
      page_size,
      sort_key,
      sort_type,
      total: totalRecords,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getUserWaitingConfirmList = async (req, res) => {
  const {
    page_size = 25,
    page_number = 1,
    sort_key = "updated_at",
    sort_type = "asc",
    user_id = "",
    username = "",
  } = req.query;
  const offset = (page_number - 1) * page_size;

  try {
    const { count, rows } = await User.findAndCountAll({
      attributes: ["user_id", "username", "role_id", "email", "user_status"],
      where: {
        user_id: {
          [Op.like]: `%${user_id}%`,
        },
        username: {
          [Op.like]: `%${username}%`,
        },
        user_status: UserStatus.waitingConfirm,
      },
      order: [[sort_key, sort_type.toUpperCase()]],
      offset: Number(offset),
      limit: Number(page_size),
    });

    res.status(httpStatusCodes.success).send({
      data: rows,
      page_number,
      page_size,
      sort_key,
      sort_type,
      total: count,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

//TODO: User just change status with 2, admin can change status 2 and 9
export const changeUserStatus = async (req, res) => {
  try {
    const { user_id, status } = req.body;
    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "User not found" });
    }

    user.user_status = status;
    user.updated_at = Sequelize.literal("CURRENT_TIMESTAMP");

    await user.save();

    res
      .status(httpStatusCodes.success)
      .json({ message: "Change status successfully" });
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      where: { user_id: id },
      attributes: [
        "user_id",
        "role_id",
        "username",
        "email",
        "branch_id",
        "phone_number",
        "user_status",
      ],
      include: {
        model: UserProfile,
        as: "profile",
        attributes: ["birth_date", "address", "profile_picture_url"],
      },
      raw: true,
      nest: true,
    });

    if (!user) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "User not found" });
    }

    const userData = {
      ...user,
      ...user.profile,
    };
    delete userData.profile;

    const branchId = user.branch_id;
    let branchName = null;

    if (branchId) {
      const branch = await Branch.findByPk(branchId, { raw: true });
      branchName = branch?.branch_name;
    }

    userData.branch_name = branchName;

    res.status(httpStatusCodes.success).json(userData);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const changeUserAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "User not found" });
    }

    const profile = await UserProfile.findOne({
      where: {
        user_id: userId,
      },
    });

    // Delete avatar
    if (!file) {
      if (profile) {
        profile.profile_picture_url = null;
        profile.updated_at = Sequelize.literal("CURRENT_TIMESTAMP");
        await profile.save();
      } else {
        const profile = {
          user_id: userId,
          profile_picture_url: null,
        };
        await UserProfile.create(profile);
      }

      return res
        .status(httpStatusCodes.success)
        .json({ message: "Remove avatar successfully" });
    }

    // Create a FormData object and append the file buffer
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    // Send the file to another API
    const response = await httpUpload.post("/upload", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response?.data?.file) {
      const { originalname, mimetype, filename, path, size } =
        response.data.file;
      const upload = {
        original_name: originalname,
        type: mimetype,
        filename,
        full_path: path,
        size,
      };

      await Upload.create(upload);

      if (profile) {
        profile.profile_picture_url = path;
        profile.updated_at = Sequelize.literal("CURRENT_TIMESTAMP");
        await profile.save();
      } else {
        const profile = {
          user_id: userId,
          profile_picture_url: path,
        };
        await UserProfile.create(profile);
      }

      return res.status(httpStatusCodes.success).json({
        message: "Update avatar successfully",
        profile_picture_url: path,
      });
    }

    return res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, branch_id, address, phone_number, birth_date } = req.body;
  const transactionUserDb = await sequelizeUserDb.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: userId, role_id: UserRole.user },
      transaction: transactionUserDb,
    });

    if (!user) {
      res.status(httpStatusCodes.badRequest).json({ error: "User not found" });
    }

    const userUpdates = {
      username,
      phone_number,
      branch_id,
    };

    await user.update(userUpdates, { transaction: transactionUserDb });

    const profileUpdates = {
      address,
      birth_date,
    };

    const profile = await UserProfile.findOne({
      where: {
        user_id: userId,
      },
    });

    if (profile) {
      await profile.update(profileUpdates, {
        transaction: transactionUserDb,
      });
    } else {
      const profile = {
        ...profileUpdates,
        user_id: userId,
      };
      await UserProfile.create(profile, { transaction: transactionUserDb });
    }

    await transactionUserDb.commit();

    res
      .status(httpStatusCodes.success)
      .json({ message: "Updated successfully" });
  } catch (error) {
    await transactionUserDb.rollback();
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};
