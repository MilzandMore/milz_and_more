// main.js - Kernsteuerung
var modeS, shapeS, inputD, dirS, sektS, codeDisplay, sliders = [], colorIndicators = [], sliderPanel;
var logoImg, isAdmin = false;

function preload() { logoImg = loadImage('logo.png'); }

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    var params = getURLParams();
    if (params.access === 'milz_secret') isAdmin = true;

    setupUI(); // Erstellt die einheitliche Topbar
    updateLayout();
}

function draw() {
    background(255);
    let shape = shapeS.value();
    let isMobile = windowWidth < 600;
    
    // UI-Elemente je nach Form ein/ausblenden
    if (shape === 'Rund') sektS.parent().show(); else sektS.parent().hide();

    push();
    // Dynamische Zentrierung für alle Mandalas
    translate(width / 2, isMobile ? height / 2 - 40 : height / 2 + 20);
    
    // WEICHE: Hier werden deine unberührten Logiken aufgerufen
    if (shape === 'Quadrat') {
        renderQuadratLogic(); 
    } else if (shape === 'Rund') {
        renderRundLogic();
    } else if (shape === 'Wabe') {
        renderWabeLogic();
    }
    pop();

    drawWatermark(isMobile); // Schutz vor Screenshots
}

// ... (Hilfsfunktionen für UI & Layout bleiben wie von dir geliefert) ...

