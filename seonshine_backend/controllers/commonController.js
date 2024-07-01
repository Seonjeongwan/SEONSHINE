import dayjs from "dayjs";
import { Op, Sequelize } from "sequelize";
import { UserRole, UserStatus } from "../constants/auth.js";
import { dateTimeFormat } from "../constants/format.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { orderItemCancelStatus } from "../constants/order.js";
import Branch from "../models/branchModel.js";
import OrderItem from "../models/orderItemModel.js";
import RestaurantAssigned from "../models/restaurantAssignedModel.js";
import User from "../models/userModel.js";
import { getResponseErrors } from "../utils/responseParser.js";

export const getAllBranch = async (req, res) => {
  const branches = await Branch.findAll({
    attributes: { exclude: ["created_at", "updated_at"] },
  });
  res.status(httpStatusCodes.success).send(branches);
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, { raw: true });
    if (branch) {
      res.status(httpStatusCodes.success).json(branch);
    } else {
      res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Branch not found" });
    }
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const addBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(httpStatusCodes.created).json(branch);
  } catch (error) {
    const response = getResponseErrors(error);
    res.status(response.status).json({ errors: response.errors });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const currentUser = req.user;
    const { user_id, role_id } = currentUser;
    let response = {};

    if (Number(role_id) === Number(UserRole.admin)) {
      response = await getAdminDashboardSummary();
    } else if (Number(role_id) === Number(UserRole.user)) {
      response = await getUserDashboardSummary(user_id);
    } else if (Number(role_id) === Number(UserRole.restaurant)) {
      response = await getRestaurantDashboardSummary(user_id);
    }

    return res.status(httpStatusCodes.success).json(response);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

const getUserDashboardSummary = async (currentUserId) => {
  let response = {
    today_restaurant_name: "",
    current_order_status: 0,
    current_order_item_name: 0,
    current_order_item_id: 0,
    today_order_users_count: 0,
  };
  const currentWeekDay = dayjs().day();
  const restaurantAssign = await RestaurantAssigned.findOne({
    attributes: ["restaurant_id"],
    where: {
      weekday: currentWeekDay,
    },
    raw: true,
  });

  const todayRestaurantId = restaurantAssign.restaurant_id;

  if (todayRestaurantId) {
    const restaurant = await User.findByPk(todayRestaurantId, {
      attributes: ["username"],
    });
    response.today_restaurant_name = restaurant?.username;
  }

  const currentDateByFormat = dayjs().format(dateTimeFormat.short);

  const orderUsersCount = await OrderItem.count({
    where: {
      order_date: currentDateByFormat,
      [Op.or]: [
        {
          cancel_yn: {
            [Op.not]: orderItemCancelStatus.cancel,
          },
        },
        {
          cancel_yn: {
            [Op.is]: null,
          },
        },
      ],
    },
  });

  response.today_order_users_count = orderUsersCount;

  const currentOrderItem = await OrderItem.findOne({
    attributes: ["item_id", "item_name"],
    where: {
      user_id: currentUserId,
      order_date: currentDateByFormat,
      cancel_yn: {
        [Op.not]: orderItemCancelStatus.cancel,
      },
    },
    raw: true,
  });

  if (currentOrderItem) {
    response.current_order_item_id = currentOrderItem.item_id;
    response.current_order_item_name = currentOrderItem.item_name;
    response.current_order_status = 1; //Ordered
  }

  return response;
};

const getRestaurantDashboardSummary = async (restaurantId) => {
  let response = {
    assigned_weekdays: [],
  };

  const restaurantAssigned = await RestaurantAssigned.findAll({
    attributes: ["weekday"],
    where: {
      restaurant_id: restaurantId,
    },
  });

  response.assigned_weekdays = restaurantAssigned.map((item) => item.weekday);

  return response;
};

const getAdminDashboardSummary = async () => {
  let response = {
    today_restaurant_id: "",
    today_restaurant_name: "",
    ordered_users_count: 0,
    active_users_count: 0,
    waiting_approval_users_count: 0,
  };
  const currentWeekDay = dayjs().day();
  const restaurantAssign = await RestaurantAssigned.findOne({
    attributes: ["restaurant_id"],
    where: {
      weekday: currentWeekDay,
    },
    raw: true,
  });

  const todayRestaurantId = restaurantAssign.restaurant_id;

  if (todayRestaurantId) {
    const restaurant = await User.findByPk(todayRestaurantId, {
      attributes: ["username"],
    });
    response.today_restaurant_id = todayRestaurantId;
    response.today_restaurant_name = restaurant?.username;
  }

  const userSummaryByStatus = await User.findAll({
    attributes: [
      "user_status",
      [Sequelize.fn("COUNT", Sequelize.col("user_status")), "count"],
    ],
    where: {
      role_id: {
        [Op.not]: UserRole.admin,
      },
      user_status: {
        [Op.in]: [UserStatus.active, UserStatus.waitingConfirm],
      },
    },
    group: ["user_status"],
    raw: true,
  });

  response.waiting_approval_users_count =
    userSummaryByStatus?.find(
      (item) => Number(item.user_status) === Number(UserStatus.waitingConfirm)
    )?.count || 0;

  response.active_users_count =
    userSummaryByStatus?.find(
      (item) => Number(item.user_status) === Number(UserStatus.active)
    )?.count || 0;

  const currentDateByFormat = dayjs().format(dateTimeFormat.short);

  const orderUsersCount = await OrderItem.count({
    where: {
      order_date: currentDateByFormat,
      [Op.or]: [
        {
          cancel_yn: {
            [Op.not]: orderItemCancelStatus.cancel,
          },
        },
        {
          cancel_yn: {
            [Op.is]: null,
          },
        },
      ],
    },
  });

  response.ordered_users_count = orderUsersCount;

  return response;
};
