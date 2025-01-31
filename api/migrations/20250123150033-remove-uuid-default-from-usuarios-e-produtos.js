'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('usuarios', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: null,
    });

    await queryInterface.changeColumn('produtos', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('usuarios', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.changeColumn('produtos', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    });
  },
};
