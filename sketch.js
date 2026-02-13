// Ganz oben in sketch.js
var logoImg;
var isAdmin = false;

// Alle globalen Variablen für die Mandala-Logiken
var qMatrixQuadrat, colorMatrixQuadrat, mapZQuadrat, slidersQuadrat, inputFieldQuadrat, charMapQuadrat;
var slidersRund, modeSelectRund, inputFieldRund, richtungSRund, sektSRund, codeDisplayRund, affirmMapRund;
var slidersWabe, dirSWabe, colorMatrixWabe;

function preload() {
  // Versuche das Logo zu laden, aber verhindere Absturz wenn Datei fehlt
  try {
    logoImg = loadImage('logo.png');
  } catch (e) {
    console.log("Logo konnte nicht geladen werden");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Hier folgt dein restlicher Setup-Code...
}
