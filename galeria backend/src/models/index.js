import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar la configuración desde config/config.json
const configPath = path.resolve(__dirname, '../config/config.json');
const configJson = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Leer solo archivos .js dentro de esta misma carpeta que no sean este index.js
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== path.basename(__filename) &&
    file.endsWith('.js')
  );
});

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  const { default: modelInit } = await import(fileUrl);
  const model = modelInit(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;