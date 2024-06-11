import { sequelizeCommonDb } from "./dbConfig";

const syncDatabases = async () => {
  try {
    await sequelizeCommonDb.sync({force: true});
    console.log('common db synchronized');
  } catch (error) {
    console.error("Error synchronizing databases:", error);
  }
}

syncDatabases();