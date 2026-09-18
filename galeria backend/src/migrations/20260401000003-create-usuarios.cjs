'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id_rol' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_especialidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'especialidades', key: 'id_especialidad' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nombres: { type: Sequelize.STRING(100), allowNull: false },
      apellidos: { type: Sequelize.STRING(100), allowNull: false },
      correo_electronico: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING(20), allowNull: true },
      contraseña: { type: Sequelize.STRING(255), allowNull: false },
      biografía: { type: Sequelize.TEXT, allowNull: true },
      foto_perfil: { type: Sequelize.STRING(255), allowNull: true },
      estado: {
        type: Sequelize.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
      },
      codigo_verificacion: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      codigo_expiracion: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('usuarios');
  }
};