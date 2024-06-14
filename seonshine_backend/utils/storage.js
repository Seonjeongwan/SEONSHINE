import redisClient from "../db/redisClient.js";

export const saveToTemporaryDb = async (key, value, expireTimeInSeconds) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: expireTimeInSeconds,
  });
};

export const getFromTemporaryDb = async (key) => {
  const value = await redisClient.get(key);
  return JSON.parse(value);
};

export const deleteFromTemporaryDb = async (key) => {
  await redisClient.del(key);
};
