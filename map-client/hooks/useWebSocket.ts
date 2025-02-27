import { useEffect, useState } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  name: string;
}

export const useWebSocket = (wsUrl: string) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("✅ WebSocket подключен");

    ws.onmessage = (event) => {
      try {
        const data: MarkerData[] = JSON.parse(event.data);
        setMarkers(data);
      } catch (error) {
        console.error("❌ Ошибка обработки WebSocket:", error);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket отключен");

    return () => ws.close();
  }, [wsUrl]);

  return { markers };
};
