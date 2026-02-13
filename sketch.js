// ==========================================
// SKETCH.JS - ROBUSTE HAUPTSTEUERUNG
// ==========================================

var logoImg;
var isAdmin = false;

// Wir deklarieren ALLES, was die anderen Dateien brauchen könnten
var qMatrixQuadrat, colorMatrixQuadrat = {}, mapZQuadrat = {};
var slidersQuadrat = {}, inputFieldQuadrat, charMapQuadrat = {};
var sliderPanelQuadrat;

var slidersRund = {}, modeSelectRund, inputFieldRund, richtungSRund, sektSRund;
var codeDisplayRund, affirmMapRund = {}, colorSeedRund = 1;
var sliderPanelRund;

var slidersWabe = {}, dirSWabe, colorMatrixWabe = {};
var sliderPanelWabe;

var modeSelectGlobal;

function preload() {
  try {
    logoImg = loadImage('logo.png');
  } catch (e) {
    console.log("Logo fehlt - kein Problem.");
  }
}

function setup() {
  // Erstellt die Zeichenfläche über den ganzen Bildschirm
  createCanvas(windowWidth, windowHeight);
  
  // Modus-Wahl direkt erstellen
  modeSelectGlobal = createSelect();
  modeSelectGlobal.position(20, 20);
  modeSelectGlobal.option('Quadrat');
  modeSelectGlobal.option('Rund');
  modeSelectGlobal.option('Wabe');
  
  // Wichtig: Initialisiere Daten, damit Funktionen nicht abstürzen
  initDataStructures();

  // Erstelle ein einfaches Eingabefeld, falls die anderen Dateien es brauchen
  inputFieldQuadrat = createInput('15011987');
  inputFieldQuadrat.position(20, 50);
  
  // Erstelle Slider-Dummys, damit draw() nicht bei .value() abstürzt
  for(var i=1; i<=9; i++) {
    slidersQuadrat[i] = createSlider(20, 100, 85);
    slidersQuadrat[i].hide(); // Verstecken, bis gebraucht
    slidersRund[i] = slidersQuadrat[i];
    slidersWabe[i] = slidersQuadrat[i];
  }

  // Falls sektSRund in mandala_rund.js gebraucht wird:
  sektSRund = createSlider(4, 32, 8);
  sektSRund.hide();
  richtungSRund = { value: function() { return 'a'; } };
  modeSelectRund = { value: function() { return 'Geburtstag'; } };
  dirSWabe = { value: function() { return 'innen'; } };
}

function draw() {
  background(240); // Leichtes Grau, damit wir das Canvas sehen
  
  // Test-Text: Wenn du das siehst, läuft p5.js!
  fill(0);
  noStroke();
  text("Modus: " + modeSelectGlobal.value(), 20, 100);

  translate(width / 2, height / 2);

  var m = modeSelectGlobal.value();
  
  try {
    if (m === 'Quadrat') {
      // Prüfe ob Funktion aus mandala_quadrat.js da ist
      if (typeof calcQuadratMatrixLogic === 'function') {
        var code = [1, 2, 3, 4, 5, 6, 7, 8]; 
        calcQuadratMatrixLogic(code);
        drawQuadratShape(1);
      } else {
        text("Lade mandala_quadrat.js...", 0, 0);
      }
    } 
    else if (m === 'Rund') {
      if (typeof buildSectorRund === 'function') {
        var matrix = buildSectorRund();
        var cols = getColorMatrixRund(1);
        for (var i = 0; i < 8; i++) {
          push();
          rotate(i * TWO_PI / 8);
          drawSectorRundLogic(matrix, cols);
          pop();
        }
      }
    }
    else if (m === 'Wabe') {
      if (typeof renderWabeKorrektLogic === 'function') {
        renderWabeKorrektLogic([1,2,3,4,5,6,7,8], 0);
      }
    }
  } catch (err) {
    fill(255, 0, 0);
    text("Fehler beim Zeichnen: " + err.message, -100, 0);
  }
}

function initDataStructures() {
  mapZQuadrat = {1:"#FF0000", 2:"#00008B", 3:"#00FF00", 4:"#FFFF00", 5:"#87CEEB", 6:"#40E0D0", 7:"#FFC0CB", 8:"#FFA500", 9:"#9400D3"};
  colorMatrixWabe[0] = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
