const http = require("http");
const express = require("express");
const { PORT } = require("./config"); // Загружаем конфиг
const setupWebSocket = require("./wsHandler"); // WebSocket обработчик
const { watchMarkersFile } = require("./fileWatcher"); // Следим за изменениями файла
const { getMarkers, saveMarker } = require("./dbServer"); // Работа с БД (позже заменим на Prisma)

const app = express();
app.use(express.json());

const server = http.createServer(app);
const { broadcastMarkers } = setupWebSocket(server);

// **REST API (если нужно)**
app.get("/api/markers", async (req, res) => {
  const markers = await getMarkers();
  res.json(markers);
});

app.post("/api/markers", async (req, res) => {
  const { lat, lng, name } = req.body;
  if (!lat || !lng || !name) {
    return res.status(400).json({ error: "Invalid marker data" });
  }

  await saveMarker({ lat, lng, name });
  broadcastMarkers(); // Обновляем клиентов
  res.status(201).json({ message: "Marker added" });
});

// **Отслеживаем изменения в markers.json (временно, потом уберём)**
watchMarkersFile(broadcastMarkers);

// **Запуск сервера**
server.listen(PORT, () => {
  console.log(`🚀 Сервер работает на http://localhost:${PORT}`);
});
