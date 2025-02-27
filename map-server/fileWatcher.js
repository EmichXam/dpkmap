const fs = require("fs");
const path = require("path");
const { getMarkers } = require("./dbServer");

const DB_FILE = path.join(__dirname, "markers.json");

let lastData = JSON.stringify(getMarkers());

const watchMarkersFile = (broadcastMarkers) => {
  fs.watchFile(DB_FILE, { interval: 1000 }, () => {
    delete require.cache[require.resolve(DB_FILE)]; // Очищаем кеш require
    const newData = JSON.stringify(getMarkers());

    if (newData !== lastData) {
      console.log("🔄 Файл markers.json изменился, обновляем клиентов...");
      lastData = newData;
      broadcastMarkers();
    }
  });
};

module.exports = { watchMarkersFile };
