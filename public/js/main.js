function playMove() {
  const audio = document.getElementById("move-sfx");
  if (audio) audio.play();
}

function playWin() {
  const audio = document.getElementById("win-sfx");
  if (audio) audio.play();
  if (window.confetti) {
    window.confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

function playRestart() {
  const audio = document.getElementById("restart-sfx");
  if (audio) audio.play();
}

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

window.startLocal = function () {
  showScreen("screen-local");
  import("./local.js").then(module => module.initLocal(playMove, playWin));
};

window.startOnline = function () {
  showScreen("screen-online");
  import("./online.js").then(module => module.initOnline(playMove, playWin));
};

window.startAI = function () {
  showScreen("screen-ai");
  import("./vsai.js").then(module => module.initAI(playMove, playWin));
};

window.restartLocal = function () {
  playRestart();
  import("./local.js").then(module => module.restartLocal());
};

window.restartOnline = function () {
  playRestart();
  import("./online.js").then(module => module.restartOnline());
};

window.restartAI = function () {
  playRestart();
  import("./vsai.js").then(module => module.restartAI());
};

window.goHome = function () {
  location.reload();
};