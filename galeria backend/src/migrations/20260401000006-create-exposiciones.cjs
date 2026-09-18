'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exposiciones', {
      id_exposicion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_creador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      titulo_exposicion: { 
        type: Sequelize.STRING(150), 
        allowNull: false 
      },
      descripción: { 
        type: Sequelize.TEXT 
      },
      fecha_inicio: { 
        type: Sequelize.DATEONLY, 
        allowNull: false 
      },
      fecha_fin: { 
        type: Sequelize.DATEONLY, 
        allowNull: false 
      },
      banner_url: { 
        type: Sequelize.STRING(255) 
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
    await queryInterface.dropTable('exposiciones');
  }
};