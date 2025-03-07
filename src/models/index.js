"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.js";
// import { configDotenv } from "dotenv";
// configDotenv({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbconfig = configFile[env];
const db = {};

let sequelize;
if (dbconfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbconfig.use_env_variable], dbconfig);
} else {
  sequelize = new Sequelize(
    dbconfig.database,
    dbconfig.username,
    dbconfig.password,
    dbconfig
  );
}

// Hàm async để load tất cả models
const loadModels = async () => {
  // console.log("DB_USER:", process.env.DB_USER);
  // console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
  // console.log("DB_NAME:", process.env.DB_NAME);
  // console.log("DB_HOST:", process.env.DB_HOST);

  const modelFiles = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
    );

  const modelImports = modelFiles.map((file) =>
    import(pathToFileURL(path.join(__dirname, file)).href)
  );

  const modules = await Promise.all(modelImports);

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const file = modelFiles[i]; // Lấy file tương ứng để debug nếu có lỗi

    if (typeof module.default === "function") {
      const model = module.default(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      console.error(`❌ Model ${file} không xuất mặc định một function.`);
    }
  }

  // Thiết lập các mối quan hệ (associations)
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
};

// **Tạo một hàm để khởi tạo models mà không sử dụng top-level await**
const initDB = async () => {
  await loadModels();
  // console.log("✅ Models loaded:", Object.keys(db));
  return db;
};

export default initDB;
