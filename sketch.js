// 1. GLOBALE VARIABLEN (Zuerst deklarieren!)
const baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
const affirmMap = { 
  A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, 
  E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 
};
const ex = (a,b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;

// Diese Zeile ist der Fix für deinen Fehler in Zeile 52:
let modeSelect, inputField, codeDisplay, sektS, richtungS, sliderPanel, logoImg;
let sliders = []; 
let colorIndicators = []; // Jetzt global definiert, Fehler in Zeile 52 ist weg!
let colorSeed = 1;

// 2. PRELOAD
function preload() {
  // Lädt die Schriftart
  let link = createElement('link');
  link.attribute('rel', 'stylesheet');
  link.attribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');
  
  // Da du sie in logo.png umbenannt hast, suchen wir NUR danach
  // Falls die Datei fehlt, wird nur ein Fehler in der Konsole gezeigt, das Programm läuft aber weiter!
  logoImg = loadImage('logo.png', 
    () => console.log("logo.png erfolgreich geladen!"), 
    () => console.log("HINWEIS: logo.png wurde nicht gefunden. Das Mandala wird ohne Logo gerendert.")
  );
}

// 3. SETUP
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  let isMobile = windowWidth < 600;

  // TOPBAR
  let topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50').style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 6px' : '10px 15px')
    .style('gap', isMobile ? '4px' : '15px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'flex-start').style('box-sizing', 'border-box').style('height', isMobile ? '50px' : '75px');

  function createUIGroup(labelTxt, element, wMobile, wDesktop) {
    let group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
    createSpan(labelTxt).parent(group).style('font-size', '7px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
    if (element) {
      element.parent(group).style('width', isMobile ? wMobile : wDesktop)
        .style('font-size', isMobile ? '10px' : '13px').style('background', '#34495e').style('color', '#fff')
        .style('border', 'none').style('border-radius', '3px').style('padding', isMobile ? '3px' : '6px');
    }
    return group;
  }

  modeSelect = createSelect();
  modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');
  createUIGroup("MODUS", modeSelect, "65px", "110px");

  inputField = createInput("15011987");
  createUIGroup("EINGABE", inputField, "75px", "130px");

  let codeGroup = createUIGroup("CODE", null, "auto", "auto");
  codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '9px' : '14px').style('color', '#fff').style('padding', '4px 0');

  sektS = createSelect();
  ["6","8","10","12","13"].forEach(s => sektS.option(s, s)); sektS.selected("8");
  createUIGroup("SEKTOR", sektS, "40px", "60px");

  richtungS = createSelect(); 
  richtungS.option("Außen", "a"); richtungS.option("Innen", "b");
  richtungS.selected("a");
  createUIGroup("RICHTUNG", richtungS, "55px", "100px");

  let saveBtn = createButton('DOWNLOAD').parent(topBar)
    .style('margin-left', 'auto').style('background', '#ffffff').style('color', '#2c3e50')
    .style('border', 'none').style('font-weight', 'bold').style('border-radius', '4px')
    .style('padding', isMobile ? '6px 6px' : '10px 15px')
    .style('font-size', isMobile ? '9px' : '13px').style('cursor', 'pointer').style('margin-top', isMobile ? '11px' : '14px');
  saveBtn.mousePressed(exportHighRes);

  // SLIDER PANEL
  sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
  for (let i = 1; i <= 9; i++) {
    let sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
    colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
    // Mobile Slider-Breite 75px gemäß deiner Vorgabe
    sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
  }

  updateLayout();
  [modeSelect, inputField, sektS, richtungS].forEach(e => {
    if(e.input) e.input(redraw); else e.changed(redraw);
  });
  noLoop();
}

function updateLayout() {
  let isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '12px 6px').style('gap', '8px');
    for (let i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '75px');
  } else {
    sliderPanel.style('bottom', 'auto').style('top', '95px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    for (let i = 1; i <= 9; i++) if(sliders[i]) sliders[i].style('width', '80px');
  }
}

function draw() {
  let isMobile = windowWidth < 600;
  let rawVal = inputField.value().trim();
  if (rawVal === "" || (modeSelect.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0)) return;

  background(255);
  const sector = buildSector();
  const currentColors = getColorMatrix(colorSeed);
  
  for (let i = 1; i <= 9; i++) {
