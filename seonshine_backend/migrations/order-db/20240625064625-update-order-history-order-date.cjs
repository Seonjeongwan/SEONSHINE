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
    const tableInfo = await queryInterface.describeTable("order_history");

    if (tableInfo.order_date) {
      await queryInterface.changeColumn("order_history", "order_date", {
        type: Sequelize.DATEONLY,
        allowNull: false,
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
  },
};
