import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Especialidad extends Model {
    static associate(models) {
      Especialidad.hasMany(models.Usuario, { foreignKey: 'id_especialidad', as: 'usuarios' });
    }
  }
  Especialidad.init({
    id_especialidad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'Especialidad',
    tableName: 'especialidades',
    timestamps: false
  });
  return Especialidad;
};