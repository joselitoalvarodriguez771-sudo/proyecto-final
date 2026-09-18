import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      Rol.hasMany(models.Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
    }
  }
  Rol.init({
    id_rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_rol: { type: DataTypes.STRING(50), allowNull: false }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'roles',
    timestamps: false
  });
  return Rol;
};