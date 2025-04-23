function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  }
  
  function startLocal() {
    showScreen("screen-local");
    import('./local.js').then(module => module.initLocal());
  }
  
  function startOnline() {
    showScreen("screen-online");
    import('./online.js').then(module => module.initOnline());
  }
  
  function goHome() {
    location.reload(); // easy reset
  }
  