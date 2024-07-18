"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "settings",
      [
        {
          category: "orderPeriod",
          data: `"{\\"start_hour\\":8,\\"start_minute\\":30,\\"end_hour\\":10,\\"end_minute\\":40}"`,
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("settings", null, {});
  },
};
