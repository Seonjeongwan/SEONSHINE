import {
  sequelizeCommonDb,
  sequelizeOrderDb,
  sequelizeRestaurantDb,
  sequelizeUserDb,
} from "./dbConfig.js";

export const syncDatabases = async () => {
  try {
    await sequelizeCommonDb.sync({ force: true });
    await sequelizeOrderDb.sync({ force: true });
    await sequelizeRestaurantDb.sync({ force: true });
    await sequelizeUserDb.sync({ force: true });
    console.log("common db synchronized");
  } catch (error) {
    console.error("Error synchronizing databases:", error);
  }
};

syncDatabases();
