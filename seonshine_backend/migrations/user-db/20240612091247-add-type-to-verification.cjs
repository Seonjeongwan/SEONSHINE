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
    const tableInfo = await queryInterface.describeTable('verification');

    if (!tableInfo.type) {
      await queryInterface.addColumn('verification', "type", {
        type: Sequelize.STRING(50),
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
    const tableInfo = await queryInterface.describeTable('verification');

    if (tableInfo.type) {
      await queryInterface.removeColumn('verification', "type");
    }
  },
};
