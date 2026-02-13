// MASTER CONTROL FOR MILZ & MORE APP
let currentMode = 'Wabe'; // Start-Modus
let mandalaWabe, mandalaRund, mandalaQuadrat;

function preload() {
  // Zentrales Laden des Logos für alle Module
  logoImg = loadImage('logo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Navigation hinzufügen
  createNavigation();

  // Initialisierung der drei Teil-Apps
  // Hinweis: Ich habe deine Setups in Funktionen umgewandelt
  initWabe(); 
  initRund();
  initQuadrat();
  
  showMode(currentMode);
}

function createNavigation() {
  let navGroup = createDiv("").style('position', 'fixed').style('top', '80px').style('left', '10px').style('z-index', '300');
  let sel = createSelect().parent(navGroup).style('padding', '10px').style('border-radius', '5px').style('background', '#2c3e50').style('color', 'white');
  sel.option('Wabe');
  sel.option('Rund');
  sel.option('Quadrat');
  sel.changed(() => {
    currentMode = sel.value();
    showMode(currentMode);
  });
}

function showMode(mode) {
  // Verstecke alle Slider-Panels und Topbars der anderen Modi
  // Zeige nur das Panel des gewählten Modus
  [panelWabe, panelRund, panelQuadrat].forEach(p => p.hide());
  [topWabe, topRund, topQuadrat].forEach(t => t.hide());
  
  if(mode === 'Wabe') { panelWabe.show(); topWabe.show(); }
  if(mode === 'Rund') { panelRund.show(); topRund.show(); }
  if(mode === 'Quadrat') { panelQuadrat.show(); topQuadrat.show(); }
  redraw();
}

function draw() {
  background(255);
  if (currentMode === 'Wabe') drawWabe();
  else if (currentMode === 'Rund') drawRund();
  else if (currentMode === 'Quadrat') drawQuadrat();
}

// ... Hier folgen die drei originalen Codes, jeweils in ihre 
// eigene draw-Funktion gekapselt ...
