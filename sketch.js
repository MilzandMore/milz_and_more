let currentMandala;
let logo;

function preload() {
  // Logo laden, falls die Datei existiert
  try {
    logo = loadImage('logo.png');
  } catch (e) {
    console.log("Logo nicht gefunden, fahre ohne fort.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Wir nutzen HSB für die Slider-Logik (Sättigung/Helligkeit)
  colorMode(HSB, 360, 100, 100, 1);
  
  // Die obere Leiste in deiner HTML (ID: ui-bar)
  let uiContainer = select('#ui-bar'); 
  
  // 1. Start-Instanz erstellen (Standard: Rund)
  currentMandala = new MandalaRund();
  currentMandala.init(uiContainer);
  
  // 2. Den Form-Wechsler (Dropdown) überwachen
  // WICHTIG: Die ID 'form-select' muss in deiner HTML existieren
  let formSelect = select('#form-select');
  if (formSelect) {
    formSelect.changed(() => {
      let val = formSelect.value();
      
      // Alte UI-Elemente und Slider der vorherigen Form entfernen
      if (currentMandala) currentMandala.hide();
      
      // Neue Instanz je nach Auswahl
      if (val === 'Rund') {
        currentMandala = new MandalaRund();
      } else if (val === 'Wabe') {
        currentMandala = new MandalaWabe();
      } else if (val === 'Quadrat') {
        currentMandala = new MandalaQuadrat();
      }
      
      // Neue Form initialisieren
      currentMandala.init(uiContainer);
      redraw();
    });
  }
  
  noLoop(); // Nur neu zeichnen, wenn sich Eingaben ändern
}

function draw() {
  background(255);
  if (currentMandala) {
    currentMandala.render();
  }
  
  // Logo unten links einblenden, falls geladen
  if (logo) {
    image(logo, 20, height - 60, 100, 40);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (currentMandala) {
    currentMandala.updateLayout();
  }
  redraw();
}
