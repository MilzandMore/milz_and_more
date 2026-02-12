// 1️⃣ App-Registry
let apps = {};
let currentApp = "quadrat";

// 2️⃣ ALLE MODULE DEFINIEREN
apps.quadrat = (() => {
  // kompletter Originalcode
  return { preload, init: setup, draw, windowResized, teardown };
})();

apps.rund = (() => {
  // kompletter Originalcode
  return { preload, init: setup, draw, windowResized, teardown };
})();

apps.wabe = (() => {
  // kompletter Originalcode
  return { preload, init: setup, draw, windowResized, teardown };
})();

// 3️⃣ ERST JETZT p5 ENTRY POINTS
function preload() {
  Object.values(apps).forEach(app => app.preload?.());
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setApp(currentApp);
}

function draw() {
  apps[currentApp]?.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  apps[currentApp]?.windowResized?.();
}
// =====================================================
// APP STATE MANAGER
// =====================================================
let currentApp = "quadrat";
let apps = {};

function setApp(name) {
  if (apps[currentApp]?.teardown) {
    apps[currentApp].teardown();
  }
  currentApp = name;
  if (apps[currentApp]?.init) {
    apps[currentApp].init();
  }

  const buttons = document.querySelectorAll("#appNav button");
  buttons.forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.textContent.toLowerCase().includes(name)
    );
  });
}

// =====================================================
// GLOBAL P5 ENTRY
// =====================================================
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

// =====================================================
// ================== APP 1: QUADRAT ====================
// =====================================================
apps.quadrat = (() => {

  // ---------- ORIGINAL CODE (UNVERÄNDERT) ----------
  let gridSize = 6;
  let matrix = [];
  let colors = [];
  let sliders = [];
  let logoImg;
  let exportButton;
  let sliderPanel;

  function preload() {
    logoImg = loadImage("logo.png");
  }

  function setup() {
    generateMatrix();
    createUI();
  }

  function generateMatrix() {
    matrix = [];
    for (let i = 0; i < gridSize; i++) {
      matrix[i] = [];
      for (let j = 0; j < gridSize; j++) {
        matrix[i][j] = floor(random(0, 6));
      }
    }
  }

  function createUI() {
    sliderPanel = createDiv().style("position", "absolute").style("top", "10px").style("left", "10px");

    for (let i = 0; i < 6; i++) {
      let s = createSlider(0, 255, random(50, 200));
      s.parent(sliderPanel);
      sliders.push(s);
    }

    exportButton = createButton("Export");
    exportButton.parent(sliderPanel);
    exportButton.mousePressed(exportImage);
  }

  function draw() {
    background(255);
    drawMatrix();
    image(logoImg, width - 120, height - 120, 100, 100);
  }

  function drawMatrix() {
    let size = min(width, height) * 0.6;
    let cell = size / gridSize;
    let startX = width / 2 - size / 2;
    let startY = height / 2 - size / 2;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let idx = matrix[i][j];
        fill(sliders[idx].value());
        rect(startX + i * cell, startY + j * cell, cell, cell);
      }
    }
  }

  function exportImage() {
    saveCanvas("quadrat", "png");
  }

  function windowResized() {}

  function teardown() {
    sliderPanel?.remove();
    sliders = [];
  }

  // ---------- MODULE EXPORT ----------
  return { preload, init: setup, draw, windowResized, teardown };
})();

// =====================================================
// =================== APP 2: RUND =====================
// =====================================================
apps.rund = (() => {

  // ---------- ORIGINAL CODE (UNVERÄNDERT) ----------
  let sectors = 12;
  let sliderPanel;
  let sliders = [];
  let logoImg;

  function preload() {
    logoImg = loadImage("logo.png");
  }

  function setup() {
    createUI();
  }

  function createUI() {
    sliderPanel = createDiv().style("position", "absolute").style("top", "10px").style("left", "10px");

    for (let i = 0; i < sectors; i++) {
      let s = createSlider(0, 255, random(50, 200));
      s.parent(sliderPanel);
      sliders.push(s);
    }
  }

  function draw() {
    background(255);
    translate(width / 2, height / 2);
    noStroke();

    let angleStep = TWO_PI / sectors;
    let radius = min(width, height) * 0.35;

    for (let i = 0; i < sectors; i++) {
      fill(sliders[i].value());
      arc(0, 0, radius * 2, radius * 2, i * angleStep, (i + 1) * angleStep, PIE);
    }

    resetMatrix();
    image(logoImg, width - 120, height - 120, 100, 100);
  }

  function windowResized() {}

  function teardown() {
    sliderPanel?.remove();
    sliders = [];
  }

  // ---------- MODULE EXPORT ----------
  return { preload, init: setup, draw, windowResized, teardown };
})();

// =====================================================
// =================== APP 3: WABE =====================
// =====================================================
apps.wabe = (() => {

  // ---------- ORIGINAL CODE (UNVERÄNDERT) ----------
  let cols = 7;
  let rows = 7;
  let size = 40;
  let sliderPanel;
  let sliders = [];
  let logoImg;

  function preload() {
    logoImg = loadImage("logo.png");
  }

  function setup() {
    createUI();
  }

  function createUI() {
    sliderPanel = createDiv().style("position", "absolute").style("top", "10px").style("left", "10px");

    for (let i = 0; i < 6; i++) {
      let s = createSlider(0, 255, random(50, 200));
      s.parent(sliderPanel);
      sliders.push(s);
    }
  }

  function draw() {
    background(255);
    translate(width / 2, height / 2);

    for (let y = -rows / 2; y < rows / 2; y++) {
      for (let x = -cols / 2; x < cols / 2; x++) {
        let px = x * size * 1.5;
        let py = y * size * sqrt(3) + (x % 2) * size * sqrt(3) / 2;

        fill(sliders[(x + y + sliders.length) % sliders.length].value());
        drawHex(px, py, size);
      }
    }

    resetMatrix();
    image(logoImg, width - 120, height - 120, 100, 100);
  }

  function drawHex(x, y, r) {
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
      vertex(x + cos(a) * r, y + sin(a) * r);
    }
    endShape(CLOSE);
  }

  function windowResized() {}

  function teardown() {
    sliderPanel?.remove();
    sliders = [];
  }

  // ---------- MODULE EXPORT ----------
  return { preload, init: setup, draw, windowResized, teardown };
})();


