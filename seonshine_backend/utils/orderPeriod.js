import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { settingCategories } from "../constants/setting.js";
import Settings from "../models/settingModel.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// 주문 가능 시간창을 해석하는 기준 타임존.
// 서버 물리 위치(싱가포르)나 사용자 디바이스 시간과 무관하게
// 항상 이 타임존을 기준으로 "지금이 주문 시간인지"를 판정한다.
export const ORDER_TIMEZONE = "Asia/Ho_Chi_Minh";

const DEFAULT_ORDER_PERIOD = {
  start_hour: 7,
  start_minute: 0,
  end_hour: 11,
  end_minute: 0,
};

// 기준 타임존 기준의 "현재 시각" (dayjs 객체)
export function nowInOrderTimezone() {
  return dayjs().tz(ORDER_TIMEZONE);
}

// 기준 타임존 기준의 오늘 날짜 (YYYY-MM-DD)
export function currentOrderDate() {
  return nowInOrderTimezone().format("YYYY-MM-DD");
}

// 설정에 저장된 주문 가능 시간창을 읽어온다. 없으면 기본값.
export async function getOrderPeriodSetting() {
  const setting = await Settings.findOne({
    attributes: ["data"],
    where: { category: settingCategories.orderPeriod },
    raw: true,
  });

  if (!setting?.data) {
    return { ...DEFAULT_ORDER_PERIOD };
  }

  let data = setting.data;
  try {
    data = JSON.parse(data);
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
  } catch {
    return { ...DEFAULT_ORDER_PERIOD };
  }

  return {
    start_hour: Number(data.start_hour),
    start_minute: Number(data.start_minute),
    end_hour: Number(data.end_hour),
    end_minute: Number(data.end_minute),
  };
}

// 기준 타임존 기준 현재 시각이 주문 가능 시간창 안에 있는지 판정.
export async function isWithinOrderPeriod(now = nowInOrderTimezone()) {
  const { start_hour, start_minute, end_hour, end_minute } =
    await getOrderPeriodSetting();

  const current = now.hour() * 60 + now.minute();
  const start = start_hour * 60 + start_minute;
  const end = end_hour * 60 + end_minute;

  return current >= start && current <= end;
}
