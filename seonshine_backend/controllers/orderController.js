import dayjs from "dayjs";
import { Op, Sequelize } from "sequelize";
import { UserRole } from "../constants/auth.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { orderItemCancelStatus, orderStatus } from "../constants/order.js";
import { sequelizeOrderDb } from "../db/dbConfig.js";
import { OrderHistory, OrderItem, User } from "../models/index.js";
import MenuItem from "../models/menuItemModel.js";

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

    const isOrderNewMenuItem = !currentOrderItem;

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
        cancel_yn: {
          [Op.not]: orderItemCancelStatus.cancel,
        },
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
  const { date = "" } = req.query;
  const currentUser = req.user;
  const { user_id, role_id } = currentUser;

  try {
    let condition = { order_date: date };
    if (Number(role_id) === Number(UserRole.restaurant)) {
      condition.restaurant_id = user_id;
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
    });

    let restaurantId = null;
    let restaurantName = null;
    if (rows?.length) {
      restaurantId = rows[0].restaurant_id;
      const restaurant = await User.findByPk(restaurantId, { raw: true });
      restaurantName = restaurant.username;
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

//TODO: Get Order History
export const getOrderHistory = async (req, res) => {
  try {
    const { date } = req.query;
    const list = [];
    let total = 0;
    const currentDate = dayjs().format("YYYY-MM-DD");
    res
      .status(httpStatusCodes.success)
      .json({ total: total, data: list, date: currentDate });
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getOrderPeriod = async (req, res) => {
  const startTime = process.env.ORDER_START_HOUR_MINUTE;
  const endTime = process.env.ORDER_END_HOUR_MINUTE;
  const [startHour, startMinute] = startTime.split(":");
  const [endHour, endMinute] = endTime.split(":");
  res.status(httpStatusCodes.success).json({
    startHour: Number(startHour),
    startMinute: Number(startMinute),
    endHour: Number(endHour),
    endMinute: Number(endMinute),
  });
};
