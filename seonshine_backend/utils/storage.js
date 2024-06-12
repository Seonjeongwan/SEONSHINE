import redisClient from "../db/redisClient.js";

export const saveToTemporaryDb = async (key, value, expireTimeInSeconds) => {
  console.log("access saveToTemporaryDb");
  await redisClient.set(key, JSON.stringify(value), {
    EX: expireTimeInSeconds,
  });
};

export const getFromTemporaryDb = async (key) => {
  const value = await redisClient.get(key);
  return JSON.parse(value);
}
