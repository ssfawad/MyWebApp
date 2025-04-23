const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map(); // Map<roomCode, [ws1, ws2]>

wss.on("connection", ws => {
  let roomCode, playerIndex;

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      roomCode = data.room;
      if (!rooms.has(roomCode)) {
        rooms.set(roomCode, []);
      }

      const players = rooms.get(roomCode);
      if (players.length >= 2) {
        ws.send(JSON.stringify({ type: "full" }));
        ws.close();
        return;
      }

      playerIndex = players.length;
      players.push(ws);

      ws.send(JSON.stringify({ type: "init", symbol: playerIndex === 0 ? "X" : "O" }));

    } else if (data.type === "move" && roomCode) {
      const players = rooms.get(roomCode) || [];
      players.forEach(p => {
        if (p.readyState === WebSocket.OPEN) {
          p.send(JSON.stringify({ type: "move", index: data.index, symbol: data.symbol }));
        }
      });
    }
  });

  ws.on("close", () => {
    if (roomCode && rooms.has(roomCode)) {
      const players = rooms.get(roomCode).filter(p => p !== ws);
      if (players.length === 0) {
        rooms.delete(roomCode);
      } else {
        rooms.set(roomCode, players);
      }
    }
  });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
