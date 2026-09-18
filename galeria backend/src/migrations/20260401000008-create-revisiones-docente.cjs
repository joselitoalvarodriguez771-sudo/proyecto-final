'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('revisiones_docente', {
      id_revision: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_obra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'obras', key: 'id_obra' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_docente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      estado_evaluacion: {
        type: Sequelize.ENUM('Aprobado', 'Observado', 'Rechazado'),
        allowNull: false
      },
      observaciones: { 
        type: Sequelize.TEXT 
      },
      calificacion: { 
        type: Sequelize.DECIMAL(4, 2) 
      },
      fecha_revision: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
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
    await queryInterface.dropTable('revisiones_docente');
  }
};