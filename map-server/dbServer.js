const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "markers.json");

// Чтение данных
const getMarkers = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (error) {
    console.error("Error reading markers:", error);
    return [];
  }
};

// Запись данных
const saveMarker = (marker) => {
  try {
    const markers = getMarkers();
    markers.push(marker);
    fs.writeFileSync(DB_FILE, JSON.stringify(markers, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving marker:", error);
  }
};

module.exports = { getMarkers, saveMarker };
