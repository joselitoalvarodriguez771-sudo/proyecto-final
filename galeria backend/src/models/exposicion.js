import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Exposicion extends Model {
    static associate(models) {
      Exposicion.belongsTo(models.Usuario, { foreignKey: 'id_creador', as: 'creador' });
      Exposicion.belongsToMany(models.Obra, { 
        through: models.ExposicionObra, 
        foreignKey: 'id_exposicion', 
        otherKey: 'id_obra', 
        as: 'obras' 
      });
    }
  }
  Exposicion.init({
    id_exposicion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_creador: { type: DataTypes.INTEGER, allowNull: false },
    titulo_exposicion: { type: DataTypes.STRING(150), allowNull: false },
    descripción: { type: DataTypes.TEXT },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
    banner_url: { type: DataTypes.STRING(255) }
  }, {
    sequelize,
    modelName: 'Exposicion',
    tableName: 'exposiciones',
    timestamps: false
  });
  return Exposicion;
};