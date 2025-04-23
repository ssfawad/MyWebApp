let ws, playerSymbol, room, currentTurn;
let opponentConnected = false;
let useAI = false;
let cells = [];
let playMove = () => {};
let playWin = () => {};

export function initOnline(moveFn = () => {}, winFn = () => {}) {
  playMove = moveFn;
  playWin = winFn;

  const board = document.getElementById("board-online");
  const status = document.getElementById("status-online");
  const input = document.getElementById("roomCodeInput");
  board.innerHTML = "";
  cells = Array(9).fill("");
  currentTurn = "X";

  function renderBoard() {
    board.innerHTML = "";
    cells.forEach((val, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = val;
      cell.onclick = () => {
        if (!val && playerSymbol && currentTurn === playerSymbol) {
          makeMove(i, playerSymbol);
          ws.send(JSON.stringify({ type: "move", room, index: i, symbol: playerSymbol }));
        }
      };
      board.appendChild(cell);
    });
  }

  function makeMove(index, symbol) {
    cells[index] = symbol;
    currentTurn = symbol === "X" ? "O" : "X";
    playMove();
    renderBoard();
    checkWin();
  }

  function checkWin() {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of wins) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        playWin();
        return cells[a];
      }
    }
    return null;
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
        renderBoard();
        status.innerText = `Connected as ${playerSymbol} | Room: ${room}`;
        if (playerSymbol === "X") {
          setTimeout(() => {
            if (!opponentConnected) {
              useAI = true;
              status.innerText += " | No opponent found, playing vs AI";
            }
          }, 5000);
        }
      }
      if (msg.type === "move") {
        if (cells[msg.index] === "") {
          makeMove(msg.index, msg.symbol);
        }

        if (useAI && playerSymbol === "X" && currentTurn === "O") {
          setTimeout(() => {
            const empty = cells.map((c, i) => c ? null : i).filter(i => i !== null);
            const random = empty[Math.floor(Math.random() * empty.length)];
            if (random !== undefined) {
              makeMove(random, "O");
              ws.send(JSON.stringify({ type: "move", room, index: random, symbol: "O" }));
            }
          }, 1000);
        } else {
          opponentConnected = true;
        }
      }
      if (msg.type === "restart") {
        cells.fill("");
        currentTurn = "X";
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

export function restartOnline() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "restart", room }));
  }
}
