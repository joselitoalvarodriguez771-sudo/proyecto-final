'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exposicion_obras', {
      id_exposicion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'exposiciones', key: 'id_exposicion' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_obra: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'obras', key: 'id_obra' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orden_presentacion: { 
        type: Sequelize.INTEGER, 
        defaultValue: 1 
      },
      createdAt: { 
        allowNull: false, 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: { 
        allowNull: false, 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') 
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exposicion_obras');
  }
};