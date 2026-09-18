import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Obra extends Model {
    static associate(models) {
      Obra.belongsTo(models.Usuario, { foreignKey: 'id_estudiante', as: 'estudiante' });
      Obra.belongsTo(models.CategoriaObra, { foreignKey: 'id_categoria', as: 'categoria' });
      Obra.hasMany(models.RevisionDocente, { foreignKey: 'id_obra', as: 'revisiones' });
      Obra.belongsToMany(models.Exposicion, { 
        through: models.ExposicionObra, 
        foreignKey: 'id_obra', 
        otherKey: 'id_exposicion', 
        as: 'exposiciones' 
      });
    }
  }
  Obra.init({
    id_obra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
    id_categoria: { type: DataTypes.INTEGER, allowNull: false },
    título: { type: DataTypes.STRING(150), allowNull: false },
    descripción: { type: DataTypes.TEXT },
    técnica: { type: DataTypes.STRING(100) },
    dimensiones: { type: DataTypes.STRING(50) },
    anio_creacion: { type: DataTypes.INTEGER },
    imagen_url: { type: DataTypes.STRING(255), allowNull: false },
    estado_publicacion: { 
      type: DataTypes.ENUM('Pendiente', 'Publicado', 'Rechazado'), 
      defaultValue: 'Pendiente' 
    },
    fecha_subida: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Obra',
    tableName: 'obras',
    timestamps: false
  });
  return Obra;
};