let cells = [];

export function initLocal() {
  const board = document.getElementById("board-local");
  const status = document.getElementById("status-local");
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

  cells.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.onclick = () => {
      if (!cells[i] && !checkWin()) {
        cells[i] = current;
        cell.innerText = current;
        current = current === "X" ? "O" : "X";
        renderStatus();
      }
    };
    board.appendChild(cell);
  });

  renderStatus();
}

export function restartLocal() {
  initLocal(); // Simply re-initialize the local game
}
