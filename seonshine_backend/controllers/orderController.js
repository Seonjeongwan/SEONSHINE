import dayjs from "dayjs";
import { Op, QueryTypes, Sequelize } from "sequelize";
import { UserRole } from "../constants/auth.js";
import { dateTimeFormat } from "../constants/format.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { orderItemCancelStatus, orderStatus } from "../constants/order.js";
import { sequelizeOrderDb } from "../db/dbConfig.js";
import { OrderHistory, OrderItem, User } from "../models/index.js";
import MenuItem from "../models/menuItemModel.js";
import RestaurantAssigned from "../models/restaurantAssignedModel.js";
import Settings from "../models/settingModel.js";
import { settingCategories } from "../constants/setting.js";

export const orderItemCurrentDay = async (req, res) => {
  const transactionOrderDb = await sequelizeOrderDb.transaction();
  try {
    const { item_id } = req.body;
    const menuItem = await MenuItem.findByPk(item_id, { raw: true });

    if (!menuItem) {
      res.status(httpStatusCodes.badRequest).send("Menu item not found");
    }

    const currentDate = dayjs().format("YYYY-MM-DD");

    const currentUser = req.user;

    const branchId = currentUser?.branch_id || 0;

    const restaurantId = menuItem.restaurant_id;

    const currentDateWithoutSeparation = currentDate.replace(/-/g, "");

    const currentOrderItem = await OrderItem.findOne({
      where: {
        user_id: currentUser.user_id,
        order_date: currentDate,
      },
    });

    let orderHistory = await OrderHistory.findOne({
      where: {
        order_date: currentDate,
        branch_id: branchId,
        restaurant_id: restaurantId,
      },
    });

    const isOrderNewMenuItem =
      !currentOrderItem ||
      Number(currentOrderItem.cancel_yn) ===
        Number(orderItemCancelStatus.cancel);

    if (isOrderNewMenuItem) {
      if (orderHistory) {
        orderHistory = await orderHistory.update(
          {
            total_amount: orderHistory.total_amount + 1,
          },
          {
            transaction: transactionOrderDb,
          }
        );
      } else {
        const order = {
          order_id: `${currentDateWithoutSeparation}-${branchId}-${restaurantId}`,
          branch_id: branchId,
          restaurant_id: restaurantId,
          order_date: currentDate,
          total_amount: 1,
          total_pay: 0,
          status: orderStatus.complete,
        };
        orderHistory = await OrderHistory.create(order, {
          transaction: transactionOrderDb,
        });
      }
    }

    if (currentOrderItem) {
      await currentOrderItem.update(
        {
          item_id,
          item_name: menuItem.name,
          cancel_yn: orderItemCancelStatus.reorder,
        },
        {
          transaction: transactionOrderDb,
        }
      );
    } else {
      const orderHistoryId = orderHistory.order_id;

      const orderItem = {
        order_item_id: `${currentDateWithoutSeparation}-${branchId}-${currentUser.user_id}-${restaurantId}-${item_id}`,
        order_id: orderHistoryId,
        user_id: currentUser.user_id,
        branch_id: branchId,
        restaurant_id: restaurantId,
        item_id,
        item_name: menuItem.name,
        quantity: 1,
        price: 0,
        order_date: currentDate,
        cancel_yn: "1",
      };
      await OrderItem.create(orderItem, {
        transaction: transactionOrderDb,
      });
    }

    await transactionOrderDb.commit();

    res.status(httpStatusCodes.success).json({ message: "Order successfully" });
  } catch (error) {
    await transactionOrderDb.rollback();
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const discardCurrentOrderItem = async (req, res) => {
  const transactionOrderDb = await sequelizeOrderDb.transaction();
  const currentDate = dayjs().format("YYYY-MM-DD");

  const currentUser = req.user;

  const branchId = currentUser?.branch_id || 0;

  try {
    const currentOrderItem = await OrderItem.findOne({
      where: {
        user_id: currentUser.user_id,
        order_date: currentDate,
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

    if (!currentOrderItem) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "Order not found" });
    }

    await currentOrderItem.update(
      {
        cancel_yn: 0,
      },
      { transaction: transactionOrderDb }
    );

    let orderHistory = await OrderHistory.findOne({
      where: {
        order_date: currentDate,
        branch_id: branchId,
      },
    });

    if (!orderHistory) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "Order not found" });
    }

    await orderHistory.update(
      {
        total_amount: orderHistory.total_amount - 1,
      },
      {
        transaction: transactionOrderDb,
      }
    );

    await transactionOrderDb.commit();

    res
      .status(httpStatusCodes.success)
      .json({ message: "Discard successfully" });
  } catch (error) {
    await transactionOrderDb.rollback();
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getOrderListSummary = async (req, res) => {
  const { date = "", branch_id } = req.query;
  const currentUser = req.user;
  const { user_id, role_id } = currentUser;

  try {
    let condition = {
      order_date: date,
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
    };
    if (Number(role_id) === Number(UserRole.restaurant)) {
      condition.restaurant_id = user_id;
    }

    if (branch_id) {
      condition.branch_id = branch_id;
    }

    const totalCount = await OrderItem.count({
      where: condition,
    });

    const rows = await OrderItem.findAll({
      attributes: [
        "item_id",
        "item_name",
        "restaurant_id",
        [Sequelize.fn("COUNT", Sequelize.col("item_id")), "count"],
      ],
      where: condition,
      group: ["item_name", "item_id", "restaurant_id"],
      //order: [["item_name", "ASC"]], // item_name으로 오름차순 정렬
    });

    let restaurantId = null;
    let restaurantName = null;
    if (rows?.length) {
      restaurantId = rows[0].restaurant_id;
      const restaurant = await User.findByPk(restaurantId, { raw: true });
      restaurantName = restaurant.username;
    } else {
      //TODO: After restaurant assign history done, please use history table. And remove restaurant id with normal user call
      const weekday = dayjs(date).day();
      const restaurantAssign = await RestaurantAs signed.findOne({
        attributes: ["restaurant_id"],
        where: {
          weekday: weekday,
        },
        raw: true,
      });

      const restaurant_id =
        !restaurantAssign || currentUser.role_id === String(UserRole.restaurant)
          ? currentUser.role_id === String(UserRole.admin)
            ? undefined
            : currentUser.user_id
          : restaurantAssign?.restaurant_id;

      const restaurant =
        restaurant_id &&
        (await User.findByPk(restaurant_id, {
          attributes: ["username"],
          raw: true,
        }));

      restaurantId = restaurant?.user_id || "";
      restaurantName = restaurant?.username || "";
    }

    res.status(httpStatusCodes.success).send({
      data: rows,
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      date,
      total: totalCount,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

//TODO: Check current user cannot get other branch and all, just admin can get all
export const getOrderListDetail = async (req, res) => {
  const { date = "", branch_id } = req.query;

  const clientTimezone = req.headers["timezone"] || "UTC";

  const select = `SELECT o.user_id, o.restaurant_id, o.item_id, o.item_name, u.username, u2.username as restaurant_name, o.updated_at as submitted_time, b.branch_name 
    FROM order_db.order_items o 
    JOIN user_db.users u ON o.user_id = u.user_id 
    JOIN user_db.users u2 ON o.restaurant_id = u2.user_id 
    JOIN common_db.branch_info b ON o.branch_id = b.branch_id`;

  const where = `WHERE (o.order_date = :date) AND (o.cancel_yn != 0 OR o.cancel_yn is null) ${
    branch_id ? "AND (o.branch_id = :branch_id)" : ""
  }  `;

  const orderBy = `ORDER BY u.username ASC`;

  const query = `${select} ${where} ${orderBy}`;

  try {
    const rows = await sequelizeOrderDb.query(query, {
      replacements: {
        date,
        branch_id,
      },
      type: QueryTypes.SELECT,
    });

    const rowsConvertedDate = (rows || []).map((row) => {
      return {
        ...row,
        submitted_time: dayjs(row.submitted_time)
          .tz(clientTimezone)
          .format(dateTimeFormat.full),
      };
    });

    let restaurantId = null;
    let restaurantName = null;
    if (rows?.length) {
      restaurantId = rows[0].restaurant_id;
      const restaurant = await User.findByPk(restaurantId, { raw: true });
      restaurantName = restaurant.username;
    } else {
      //TODO: After restaurant assign history done, please use history table. And remove restaurant id with normal user call
      const weekday = dayjs(date).day();
      const restaurantAssign = await RestaurantAssigned.findOne({
        attributes: ["restaurant_id"],
        where: {
          weekday: weekday,
        },
        raw: true,
      });
      if (restaurantAssign) {
        const restaurant = await User.findByPk(restaurantAssign.restaurant_id, {
          attributes: ["username"],
          raw: true,
        });
        restaurantId = restaurantAssign?.restaurant_id || "";
        restaurantName = restaurant?.username || "";
      }
    }

    const totalCount = rowsConvertedDate.length;

    res.status(httpStatusCodes.success).send({
      data: rowsConvertedDate,
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      date,
      total: totalCount,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const { from, to } = req.query;

    const currentUser = req.user;
    const { user_id, role_id } = currentUser;
    const select = `SELECT o.order_id, o.branch_id, o.restaurant_id, o.order_date, o.total_amount, u.username as restaurant_name, p.address as restaurant_address, p.profile_picture_url as restaurant_image_url, b.branch_name 
    FROM order_db.order_history o JOIN user_db.users u ON o.restaurant_id = u.user_id LEFT JOIN user_db.user_profiles p ON p.user_id = o.restaurant_id JOIN common_db.branch_info b ON b.branch_id = o.branch_id`;

    let where = "WHERE order_date between :from AND :to";

    if (Number(role_id) === Number(UserRole.restaurant)) {
      where += " AND restaurant_id = :user_id";
    }

    const query = `${select} ${where}`;

    const rows = await sequelizeOrderDb.query(query, {
      replacements: {
        from,
        to,
        user_id,
      },
      type: QueryTypes.SELECT,
    });

    res.status(httpStatusCodes.success).json({ data: rows });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const currentDate = dayjs().format(dateTimeFormat.short);

    const clientTimezone = req.headers["timezone"] || "UTC";

    const currentUser = req.user;

    const currentOrderItem = await OrderItem.findOne({
      attributes: [
        "order_item_id",
        "user_id",
        "branch_id",
        "restaurant_id",
        "item_id",
        "item_name",
        ["updated_at", "submitted_time"],
      ],
      where: {
        user_id: currentUser.user_id,
        order_date: currentDate,
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
      raw: true,
    });

    if (currentOrderItem) {
      currentOrderItem.submitted_time = dayjs(currentOrderItem.submitted_time)
        .tz(clientTimezone)
        .format(dateTimeFormat.full);

      const restaurantId = currentOrderItem.restaurant_id;
      const restaurant = await User.findByPk(restaurantId, {
        attributes: ["username"],
        raw: true,
      });
      currentOrderItem.restaurant_name = restaurant.username;

      const itemId = currentOrderItem.item_id;
      const menuItem = await MenuItem.findByPk(itemId, {
        attributes: ["image_url"],
        raw: true,
      });
      currentOrderItem.image_url = menuItem.image_url;
    }
    res.status(httpStatusCodes.success).json(currentOrderItem);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getOrderPeriod = async (req, res) => {
  try {
    const orderPeriod = await Settings.findOne({
      attributes: ["category", "data"],
      where: {
        category: settingCategories.orderPeriod,
      },
      raw: true,
    });

    const response = {};

    if (orderPeriod) {
      const data = JSON.parse(orderPeriod.data);
      response.data = typeof data === "object" ? data : JSON.parse(data);
    } else {
      response.data = JSON.stringify({
        start_hour: 7,
        start_minute: 0,
        end_hour: 11,
        end_minute: 0,
      });
    }

    res.status(httpStatusCodes.success).send(response);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};
