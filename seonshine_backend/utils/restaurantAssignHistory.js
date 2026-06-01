import dayjs from "dayjs";
import { QueryTypes } from "sequelize";
import { weekdays } from "../constants/common.js";
import { sequelizeOrderDb } from "../db/dbConfig.js";
import RestaurantAssigned from "../models/restaurantAssignedModel.js";
import RestaurantAssignedHistory from "../models/restaurantAssignedHistoryModel.js";
import User from "../models/userModel.js";

/**
 * 특정 날짜에 배정된 식당 조회 (이력 우선, 없으면 요일 배정표 fallback)
 */
export async function getRestaurantForDate(date) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");

  const history = await RestaurantAssignedHistory.findOne({
    where: { date: dateStr },
    raw: true,
  });

  if (history?.restaurant_id) {
    return {
      restaurant_id: history.restaurant_id,
      restaurant_name: history.restaurant_name || "",
    };
  }

  const weekday = dayjs(date).day();
  if (!(weekday in weekdays)) {
    return { restaurant_id: "", restaurant_name: "" };
  }

  const assign = await RestaurantAssigned.findOne({
    attributes: ["restaurant_id"],
    where: { weekday },
    raw: true,
  });

  if (!assign?.restaurant_id) {
    return { restaurant_id: "", restaurant_name: "" };
  }

  const restaurant = await User.findByPk(assign.restaurant_id, {
    attributes: ["username"],
    raw: true,
  });

  return {
    restaurant_id: assign.restaurant_id,
    restaurant_name: restaurant?.username || "",
  };
}

/**
 * 해당 날짜의 요일 배정을 이력 테이블에 기록 (과거 날짜는 덮어쓰지 않음)
 */
export async function snapshotRestaurantAssignmentForDate(date = dayjs()) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const todayStr = dayjs().format("YYYY-MM-DD");
  const weekday = dayjs(date).day();

  const existing = await RestaurantAssignedHistory.findOne({
    where: { date: dateStr },
  });

  // 이미 기록된 과거 날짜는 변경하지 않음
  if (existing && dateStr !== todayStr) {
    return existing;
  }

  if (!(weekday in weekdays)) {
    if (existing && dateStr === todayStr) {
      await existing.destroy();
    }
    return null;
  }

  const assign = await RestaurantAssigned.findOne({
    attributes: ["restaurant_id"],
    where: { weekday },
    raw: true,
  });

  if (!assign?.restaurant_id) {
    if (existing) {
      await existing.destroy();
    }
    return null;
  }

  const restaurant = await User.findByPk(assign.restaurant_id, {
    attributes: ["username"],
    raw: true,
  });

  const payload = {
    restaurant_id: assign.restaurant_id,
    restaurant_name: restaurant?.username || "",
  };

  if (existing) {
    await existing.update(payload);
    return existing;
  }

  return RestaurantAssignedHistory.create({
    date: dateStr,
    ...payload,
  });
}

/**
 * order_history에 있는 날짜·식당으로 이력 보강 (기존 이력은 유지)
 */
export async function backfillHistoryFromOrderHistory() {
  const rows = await sequelizeOrderDb.query(
    `SELECT oh.order_date AS date, oh.restaurant_id, u.username AS restaurant_name
     FROM order_db.order_history oh
     JOIN user_db.users u ON oh.restaurant_id = u.user_id
     GROUP BY oh.order_date, oh.restaurant_id, u.username`,
    { type: QueryTypes.SELECT }
  );

  for (const row of rows) {
    const dateStr = dayjs(row.date).format("YYYY-MM-DD");
    const exists = await RestaurantAssignedHistory.findOne({
      where: { date: dateStr },
    });
    if (!exists) {
      await RestaurantAssignedHistory.create({
        date: dateStr,
        restaurant_id: row.restaurant_id,
        restaurant_name: row.restaurant_name,
      });
    }
  }
}

export function startRestaurantAssignmentHistoryScheduler() {
  const run = async () => {
    try {
      await snapshotRestaurantAssignmentForDate(dayjs());
    } catch (error) {
      console.error("restaurant assignment snapshot failed:", error);
    }
  };

  run();
  const intervalMs = 60 * 60 * 1000; // 1시간마다 오늘 날짜 스냅샷
  return setInterval(run, intervalMs);
}
