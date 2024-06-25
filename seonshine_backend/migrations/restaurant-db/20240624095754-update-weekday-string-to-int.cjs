"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const tableInfo = await queryInterface.describeTable("restaurant_assigned");

    if (tableInfo.weekday) {
      await queryInterface.changeColumn("restaurant_assigned", "weekday", {
        type: Sequelize.INTEGER,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const tableInfo = await queryInterface.describeTable("restaurant_assigned");

    if (tableInfo.weekday) {
      await queryInterface.changeColumn("restaurant_assigned", "weekday", {
        type: Sequelize.STRING(25),
      });
    }
  },
};
