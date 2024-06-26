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
    const tableInfo = await queryInterface.describeTable("menu_items");

    if (!tableInfo.image_url) {
      await queryInterface.addColumn("menu_items", "image_url", {
        type: Sequelize.STRING(255),
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
    const tableInfo = await queryInterface.describeTable("menu_items");

    if (tableInfo.image_url) {
      await queryInterface.removeColumn("menu_items", "image_url");
    }
  },
};
