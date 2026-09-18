'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('especialidades', [
      {
        id_especialidad: 1,
        nombre: 'Música',
        descripcion: 'Especialidad en interpretación musical, teoría y expresión sonora',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_especialidad: 2,
        nombre: 'Artes Visuales',
        descripcion: 'Especialidad en medios visuales, arte contemporáneo y composición',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_especialidad: 3,
        nombre: 'Pintura',
        descripcion: 'Especialidad en artes plásticas, técnicas cromáticas y pintura',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_especialidad: 4,
        nombre: 'Escultura',
        descripcion: 'Especialidad en modelado, tridimensionalidad y escultura',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('especialidades', null, {});
  }
};