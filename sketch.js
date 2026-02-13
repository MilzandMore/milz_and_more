let currentMandala;
let logo;

function preload() {
  logo = loadImage('logo.png'); // Falls vorhanden
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  
  // Container für die UI oben
  let uiContainer = select('#ui-bar'); 
  
  // Start-Instanz (Standard: Rund)
  currentMandala = new MandalaRund();
  currentMandala.init(uiContainer);
  
  // Event-Listener für den Form-Wechsel (muss in deiner HTML existieren)
  let formSelect = select('#form-select');
  formSelect.changed(() => {
    let val = formSelect.value();
    currentMandala.hide(); // Alte UI verstecken
    
    if (val === 'Rund') currentMandala = new MandalaRund();
    else if (val === 'Wabe') currentMandala = new MandalaWabe();
    else if (val === 'Quadrat') currentMandala = new MandalaQuadrat();
    
    currentMandala.init(uiContainer);
    redraw();
  });
  
  noLoop();
}

function draw() {
  background(255);
  if (currentMandala) currentMandala.render();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (currentMandala) currentMandala.updateLayout();
}
