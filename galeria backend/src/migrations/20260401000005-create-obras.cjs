'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('obras', {
      id_obra: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_estudiante: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categorias_obra', key: 'id_categoria' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      título: { 
        type: Sequelize.STRING(150), 
        allowNull: false 
      },
      descripción: { 
        type: Sequelize.TEXT 
      },
      técnica: { 
        type: Sequelize.STRING(100) 
      },
      dimensiones: { 
        type: Sequelize.STRING(50) 
      },
      anio_creacion: { 
        type: Sequelize.INTEGER 
      },
      imagen_url: { 
        type: Sequelize.STRING(255), 
        allowNull: false 
      },
      estado_publicacion: {
        type: Sequelize.ENUM('Pendiente', 'Publicado', 'Rechazado'),
        defaultValue: 'Pendiente'
      },
      fecha_subida: { 
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
    await queryInterface.dropTable('obras');
  }
};