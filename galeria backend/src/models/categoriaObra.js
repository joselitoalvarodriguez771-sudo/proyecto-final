import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class CategoriaObra extends Model {
    static associate(models) {
      CategoriaObra.belongsTo(models.Usuario, { foreignKey: 'id_creador', as: 'creador' });
      CategoriaObra.hasMany(models.Obra, { foreignKey: 'id_categoria', as: 'obras' });
    }
  }
  CategoriaObra.init({
    id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_creador: { type: DataTypes.INTEGER, allowNull: true },
    nombre_categoria: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'CategoriaObra',
    tableName: 'categorias_obra',
    timestamps: false
  });
  return CategoriaObra;
};