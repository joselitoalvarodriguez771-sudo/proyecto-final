import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
      Usuario.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad', as: 'especialidad' });
      Usuario.hasMany(models.Obra, { foreignKey: 'id_estudiante', as: 'obras' });
      Usuario.hasMany(models.CategoriaObra, { foreignKey: 'id_creador', as: 'categorias_creadas' });
      Usuario.hasMany(models.Exposicion, { foreignKey: 'id_creador', as: 'exposiciones_creadas' });
      Usuario.hasMany(models.RevisionDocente, { foreignKey: 'id_docente', as: 'revisiones' });
    }
  }
  Usuario.init({
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_rol: { type: DataTypes.INTEGER, allowNull: false },
    id_especialidad: { type: DataTypes.INTEGER, allowNull: true },
    nombres: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(100), allowNull: false },
    correo_electronico: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    contraseña: { type: DataTypes.STRING(255), allowNull: false },
    biografía: { type: DataTypes.TEXT, allowNull: true },
    foto_perfil: { type: DataTypes.STRING(255), allowNull: true },
    estado: { type: DataTypes.ENUM('Activo', 'Inactivo'), defaultValue: 'Activo' },
    codigo_verificacion: { type: DataTypes.STRING(10), allowNull: true },
    codigo_expiracion: { type: DataTypes.DATE, allowNull: true }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true
  });
  return Usuario;
};