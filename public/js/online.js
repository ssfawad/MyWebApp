let ws, playerSymbol, room;

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
        if (!val && playerSymbol && ws) {
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
        status.innerText = `Connected as ${playerSymbol} | Room: ${room}`;
      }
      if (msg.type === "move") {
        cells[msg.index] = msg.symbol;
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
