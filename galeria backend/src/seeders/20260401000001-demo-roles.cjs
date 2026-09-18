'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id_rol: 1,
        nombre_rol: 'Administrador',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_rol: 2,
        nombre_rol: 'Estudiante',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_rol: 3,
        nombre_rol: 'Docente',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};