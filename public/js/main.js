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
  
  window.restartLocal = function() {
    import("./local.js").then(module => module.restartLocal());
  }
  
  window.restartOnline = function() {
    import("./online.js").then(module => module.restartOnline());
  }
  
  window.goHome = function() {
    location.reload();
  }
  