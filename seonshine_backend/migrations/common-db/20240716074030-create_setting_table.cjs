"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists("settings");
    if (!tableExists) {
      await queryInterface.createTable("settings", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(100),
        },
        data: {
          type: Sequelize.STRING(500),
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("settings");
  },
};
