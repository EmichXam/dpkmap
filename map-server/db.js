const fs = require("fs");
const path = require("path");
const { DB_FILE } = require("./config");

const filePath = path.join(__dirname, DB_FILE);

// Функция чтения данных из файла
const readMarkers = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("❌ Ошибка чтения БД:", error);
    return [];
  }
};

// Функция записи данных в файл
const writeMarkers = (markers) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(markers, null, 2), "utf-8");
  } catch (error) {
    console.error("❌ Ошибка записи в БД:", error);
  }
};

module.exports = { readMarkers, writeMarkers };
