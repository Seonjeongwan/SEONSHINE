import dayjs from "dayjs";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { orderItemCancelStatus, orderStatus } from "../constants/order.js";
import { OrderHistory, OrderItem } from "../models/index.js";
import MenuItem from "../models/menuItemModel.js";

export const orderItemCurrentDay = async (req, res) => {
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

    let orderHistory = await OrderHistory.findOne({
      where: {
        order_date: currentDate,
        branch_id: branchId,
        restaurant_id: restaurantId,
      },
    });

    if (orderHistory) {
      orderHistory = await orderHistory.update({
        total_amount: orderHistory.total_amount + 1,
      });
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
      orderHistory = await OrderHistory.create(order);
    }

    const currentOrderItem = await OrderItem.findOne({
      where: {
        user_id: currentUser.user_id,
        order_date: currentDate,
      },
    });

    if (currentOrderItem) {
      await currentOrderItem.update({
        item_id,
        item_name: menuItem.name,
        cancel_yn: orderItemCancelStatus.reorder,
      });
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
      await OrderItem.create(orderItem);
    }

    res
      .status(httpStatusCodes.success)
      .json({ message: "Update successfully" });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

//TODO: Discard
export const discardCurrentOrderItem = async (req, res) => {
  try {
    res
      .status(httpStatusCodes.success)
      .json({ message: "Discard successfully" });
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

//TODO: Get order list by current date
export const getOrderListByDate = async (req, res) => {
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
