import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ExposicionObra extends Model {}
  ExposicionObra.init({
    id_exposicion: { type: DataTypes.INTEGER, primaryKey: true },
    id_obra: { type: DataTypes.INTEGER, primaryKey: true },
    orden_presentacion: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {
    sequelize,
    modelName: 'ExposicionObra',
    tableName: 'exposicion_obras',
    timestamps: false
  });
  return ExposicionObra;
};