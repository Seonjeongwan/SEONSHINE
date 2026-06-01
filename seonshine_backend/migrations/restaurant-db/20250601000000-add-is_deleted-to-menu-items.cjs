"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 컬럼이 이미 있으면 건너뜀 (운영 DB에는 수동으로 추가돼 있을 수 있어 중복 에러 방지)
    const tableInfo = await queryInterface.describeTable("menu_items");

    if (!tableInfo.is_deleted) {
      await queryInterface.addColumn("menu_items", "is_deleted", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "삭제 여부(소프트 삭제) 0:정상 1:삭제됨",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("menu_items");

    if (tableInfo.is_deleted) {
      await queryInterface.removeColumn("menu_items", "is_deleted");
    }
  },
};
