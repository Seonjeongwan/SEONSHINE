"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists("restaurant_assigned_history");
    if (!tableExists) {
      await queryInterface.createTable("restaurant_assigned_history", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          comment: "History Id",
        },
        date: {
          type: Sequelize.DATEONLY,
          comment: "Assign date",
        },
        restaurant_id: {
          type: Sequelize.STRING(50),
          comment: "Restaurant id",
        },
        restaurant_name: {
          type: Sequelize.STRING(100),
          comment: "Restaurant name",
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          comment: "변경일자",
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          comment: "변경일자",
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("restaurant_assigned_history");
  },
};
