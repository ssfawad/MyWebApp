export function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  }
  
  window.startLocal = function() {
    showScreen("screen-local");
    import("./local.js").then(module => module.initLocal());
  }
  
  window.startOnline = function() {
    showScreen("screen-online");
    import("./online.js").then(module => module.initOnline());
  }
  
  window.goHome = function() {
    location.reload();
  }
  
  // ======= online.js =======
  let ws, playerSymbol, room, currentTurn;
  
  export function initOnline() {
    const board = document.getElementById("board-online");
    const status = document.getElementById("status-online");
    const input = document.getElementById("roomCodeInput");
    board.innerHTML = "";
    const cells = Array(9).fill("");
  
    function renderBoard() {
      board.innerHTML = "";
      cells.forEach((val, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.innerText = val;
        cell.onclick = () => {
          if (!val && playerSymbol && currentTurn === playerSymbol) {
            ws.send(JSON.stringify({ type: "move", room, index: i, symbol: playerSymbol }));
          }
        };
        board.appendChild(cell);
      });
    }
  
    window.createRoom = () => {
      room = Math.random().toString(36).substring(2, 8).toUpperCase();
      status.innerText = `Room: ${room} | Waiting for player...`;
      connect();
    };
  
    window.joinRoom = () => {
      room = input.value.toUpperCase();
      if (!room) return alert("Enter room code");
      status.innerText = `Joining Room: ${room}`;
      connect();
    };
  
    function connect() {
      ws = new WebSocket(`wss://${location.host}`);
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "join", room }));
      };
  
      ws.onmessage = ({ data }) => {
        const msg = JSON.parse(data);
        if (msg.type === "init") {
          playerSymbol = msg.symbol;
          currentTurn = "X";
          status.innerText = `Connected as ${playerSymbol} | Room: ${room}`;
          renderBoard();
        }
        if (msg.type === "move") {
          cells[msg.index] = msg.symbol;
          currentTurn = msg.symbol === "X" ? "O" : "X";
          renderBoard();
        }
        if (msg.type === "full") {
          status.innerText = "Room is full.";
          ws.close();
        }
      };
    }
  
    renderBoard();
  }
  
  // ======= server.js =======
  const express = require("express");
  const http = require("http");
  const WebSocket = require("ws");
  const path = require("path");
  
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  
  const rooms = new Map();
  
  wss.on("connection", ws => {
    let roomCode, playerIndex;
  
    ws.on("message", msg => {
      const data = JSON.parse(msg);
  
      if (data.type === "join") {
        roomCode = data.room;
        if (!rooms.has(roomCode)) rooms.set(roomCode, []);
  
        const players = rooms.get(roomCode);
        if (players.length >= 2) {
          ws.send(JSON.stringify({ type: "full" }));
          ws.close();
          return;
        }
  
        playerIndex = players.length;
        players.push(ws);
        const symbol = playerIndex === 0 ? "X" : "O";
  
        ws.send(JSON.stringify({ type: "init", symbol }));
      }
  
      if (data.type === "move" && roomCode) {
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
  