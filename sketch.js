// ===============================
// APP STATE
// ===============================
let currentApp = "quadrat";
let apps = {};

// Umschalten von außen (Buttons)
function setApp(name) {
  if (apps[currentApp]?.teardown) {
    apps[currentApp].teardown();
  }
  currentApp = name;
  if (apps[currentApp]?.init) {
    apps[currentApp].init();
  }

  document.querySelectorAll('#appNav button').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().includes(name));
  });
}

// ===============================
// P5 GLOBALS
// ===============================
function preload() {
  apps.quadrat.preload();
  apps.rund.preload();
  apps.wabe.preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setApp(currentApp);
}

function draw() {
  if (apps[currentApp]?.draw) {
    apps[currentApp].draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (apps[currentApp]?.windowResized) {
    apps[currentApp].windowResized();
  }
}
