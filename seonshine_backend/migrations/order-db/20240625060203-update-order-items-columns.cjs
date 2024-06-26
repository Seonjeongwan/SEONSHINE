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
    const tableInfo = await queryInterface.describeTable("order_items");

    if (!tableInfo.item_name) {
      await queryInterface.addColumn("order_items", "item_name", {
        type: Sequelize.STRING(100),
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
    const tableInfo = await queryInterface.describeTable("order_items");

    if (tableInfo.item_name) {
      await queryInterface.removeColumn("order_items", "item_name");
    }
  },
};
