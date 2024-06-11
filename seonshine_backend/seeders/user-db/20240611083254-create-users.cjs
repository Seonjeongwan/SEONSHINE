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
      "users",
      [
        {
          user_id: "shinhanadmin",
          role_id: "0",
          username: "Shinhan Admin",
          phone_number: "0123456789",
          branch_id: "1",
          email: "shinhanadmin@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
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
    await queryInterface.bulkDelete("users", null, {});
  },
};
