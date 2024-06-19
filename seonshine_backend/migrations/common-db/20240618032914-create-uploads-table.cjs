"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists("uploads");
    if (!tableExists) {
      await queryInterface.createTable("uploads", {
        file_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          comment: "File Id",
        },
        original_name: {
          type: Sequelize.STRING(200),
          comment: "Original name",
        },
        type: {
          type: Sequelize.STRING(100),
          comment: "File type",
        },
        filename: {
          type: Sequelize.STRING(50),
          comment: "File name",
        },
        full_path: {
          type: Sequelize.STRING(200),
          comment: "File full path",
        },
        size: {
          type: Sequelize.INTEGER,
          comment: "Size of file",
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
    await queryInterface.dropTable("uploads");
  },
};
