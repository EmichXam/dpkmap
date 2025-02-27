const WebSocket = require("ws");
const { readMarkers, writeMarkers } = require("./db");

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // Функция отправки обновлений всем клиентам
  const broadcastMarkers = () => {
    const data = JSON.stringify(readMarkers());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on("connection", (ws) => {
    console.log("🔗 Клиент подключен");

    // Отправляем текущие метки новому клиенту
    ws.send(JSON.stringify(readMarkers()));

    // Обрабатываем входящие сообщения
    ws.on("message", (message) => {
      try {
        const newMarker = JSON.parse(message);
        if (!newMarker.lat || !newMarker.lng || !newMarker.name) return;

        const markers = readMarkers();
        markers.push(newMarker);
        writeMarkers(markers);

        // Рассылаем обновленные метки всем клиентам
        broadcastMarkers();
      } catch (error) {
        console.error("❌ Ошибка обработки сообщения:", error);
      }
    });

    ws.on("close", () => console.log("❌ Клиент отключен"));
  });

  return { broadcastMarkers };
};

module.exports = setupWebSocket;
