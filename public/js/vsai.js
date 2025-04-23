let cells = [];

export function initAI(playMove = () => {}, playWin = () => {}) {
  const board = document.getElementById("board-ai");
  const status = document.getElementById("status-ai");
  board.innerHTML = "";
  cells = Array(9).fill("");
  let current = "X";

  const checkWin = () => {
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
    return cells.every(c => c) ? "draw" : null;
  };

  const renderStatus = () => {
    const winner = checkWin();
    if (winner === "draw") {
      status.innerText = "It's a draw!";
    } else if (winner) {
      status.innerText = `Player ${winner} wins!`;
    } else {
      status.innerText = `Current Turn: ${current}`;
    }
  };

  const renderBoard = () => {
    board.innerHTML = "";
    cells.forEach((val, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = val;
      cell.onclick = () => {
        if (!cells[i] && !checkWin() && current === "X") {
          cells[i] = "X";
          playMove();
          current = "O";
          renderBoard();
          aiMove();
        }
      };
      board.appendChild(cell);
    });
    renderStatus();
  };

  const aiMove = () => {
    if (checkWin()) return;
    const empty = cells.map((c, i) => c ? null : i).filter(i => i !== null);
    const random = empty[Math.floor(Math.random() * empty.length)];
    setTimeout(() => {
      cells[random] = "O";
      playMove();
      current = "X";
      renderBoard();
    }, 500);
  };

  renderBoard();
}

export function restartAI() {
  initAI();
}