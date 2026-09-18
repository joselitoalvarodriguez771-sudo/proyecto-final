import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RevisionDocente extends Model {
    static associate(models) {
      RevisionDocente.belongsTo(models.Obra, { foreignKey: 'id_obra', as: 'obra' });
      RevisionDocente.belongsTo(models.Usuario, { foreignKey: 'id_docente', as: 'docente' });
    }
  }
  RevisionDocente.init({
    id_revision: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_obra: { type: DataTypes.INTEGER, allowNull: false },
    id_docente: { type: DataTypes.INTEGER, allowNull: false },
    estado_evaluacion: { 
      type: DataTypes.ENUM('Aprobado', 'Observado', 'Rechazado'), 
      allowNull: false 
    },
    observaciones: { type: DataTypes.TEXT },
    calificacion: { type: DataTypes.DECIMAL(4, 2) },
    fecha_revision: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'RevisionDocente',
    tableName: 'revisiones_docente',
    timestamps: false
  });
  return RevisionDocente;
};