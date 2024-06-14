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
        {
          user_id: "shinhanuser1",
          role_id: "1",
          username: "Shinhan User 1",
          phone_number: "0123456789",
          branch_id: "1",
          email: "shinhanuser1@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser2",
          role_id: "1",
          username: "Shinhan User 2",
          phone_number: "0123456781",
          branch_id: "2",
          email: "shinhanuser2@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser3",
          role_id: "1",
          username: "Shinhan User 3",
          phone_number: "0123456782",
          branch_id: "1",
          email: "shinhanuser3@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser4",
          role_id: "1",
          username: "Shinhan User 4",
          phone_number: "0123456783",
          branch_id: "2",
          email: "shinhanuser4@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser5",
          role_id: "1",
          username: "Shinhan User 5",
          phone_number: "0123456784",
          branch_id: "1",
          email: "shinhanuser5@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser6",
          role_id: "1",
          username: "Shinhan User 6",
          phone_number: "0123456789",
          branch_id: "2",
          email: "shinhanuser6@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser7",
          role_id: "1",
          username: "Shinhan User 7",
          phone_number: "0123456784",
          branch_id: "1",
          email: "shinhanuser7@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser8",
          role_id: "1",
          username: "Shinhan User 8",
          phone_number: "0123456783",
          branch_id: "2",
          email: "shinhanuser8@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser9",
          role_id: "2",
          username: "Shinhan User 9",
          phone_number: "0123456782",
          branch_id: "1",
          email: "shinhanuser9@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser16",
          role_id: "2",
          username: "Shinhan User 16",
          phone_number: "0123456781",
          branch_id: "2",
          email: "shinhanuser16@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser10",
          role_id: "2",
          username: "Shinhan User 10",
          phone_number: "0123456785",
          branch_id: "1",
          email: "shinhanuser10@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser11",
          role_id: "2",
          username: "Shinhan User 11",
          phone_number: "0123456789",
          branch_id: "2",
          email: "shinhanuser11@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser12",
          role_id: "2",
          username: "Shinhan User 12",
          phone_number: "0123456789",
          branch_id: "1",
          email: "shinhanuser12@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser13",
          role_id: "2",
          username: "Shinhan User 13",
          phone_number: "0123456787",
          branch_id: "2",
          email: "shinhanuser13@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser14",
          role_id: "2",
          username: "Shinhan User 14",
          phone_number: "0123456788",
          branch_id: "1",
          email: "shinhanuser14@gmail.com",
          password_hash:
            "$2b$10$G4XrCG5LEm6gTzp9xAta3u4jd9tNltZTPerBtX7cB9zgfjq.Ex0R2",
          user_status: "1",
        },
        {
          user_id: "shinhanuser15",
          role_id: "2",
          username: "Shinhan User 15",
          phone_number: "0123456789",
          branch_id: "2",
          email: "shinhanuser15@gmail.com",
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
