// ... (Globale Variablen und Preload bleiben gleich)

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    var isMobile = windowWidth < 600;

    // Topbar Erstellung
    var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
        .style('background', '#2c3e50').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
        .style('gap', isMobile ? '8px' : '20px').style('z-index', '200').style('align-items', 'center').style('height', isMobile ? '55px' : '75px').style('box-sizing', 'border-box');

    // UI Hilfsfunktion
    function createUIGroup(labelTxt, element, wMobile, wDesktop) {
        var group = createDiv("").parent(topBar).style('display', 'flex').style('flex-direction', 'column');
        createSpan(labelTxt).parent(group).style('font-size', '8px').style('color', '#bdc3c7').style('font-weight', 'bold');
        if (element) {
            element.parent(group).style('width', isMobile ? wMobile : wDesktop)
                   .style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px')
                   .style('font-size', isMobile ? '11px' : '13px').style('height', isMobile ? '22px' : '32px');
        }
        return group;
    }

    // Elemente
    designSelect = createSelect(); ["Quadrat", "Rund", "Wabe"].forEach(d => designSelect.option(d));
    createUIGroup("DESIGN", designSelect, "75px", "100px");

    modeSelect = createSelect(); modeSelect.option('Geburtstag'); modeSelect.option('Affirmation');
    createUIGroup("MODUS", modeSelect, "80px", "110px");

    inputField = createInput('15011987');
    createUIGroup("EINGABE", inputField, "75px", "130px");

    var codeGroup = createUIGroup("CODE", null, "auto", "auto");
    codeDisplay = createSpan("").parent(codeGroup).style('color', '#fff').style('font-weight', 'bold');

    sektS = createSelect(); ["6","8","10","12","13"].forEach(s => sektS.option(s)); sektS.selected("8");
    sektGroup = createUIGroup("SEKTOR", sektS, "40px", "60px");

    dirSelect = createSelect(); dirSelect.option('Außen'); dirSelect.option('Innen');
    createUIGroup("RICHTUNG", dirSelect, "65px", "95px");

    // DOWNLOAD BUTTON - Zurück auf "Download"
    var saveBtn = createButton('Download').parent(topBar).style('margin-left', 'auto').style('background', '#fff').style('border-radius', '4px').style('font-weight', 'bold').style('padding', '5px 10px');
    saveBtn.mousePressed(exportHighRes);

    // Slider
    sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.95)').style('z-index', '150').style('padding', '8px');
    for (var i = 1; i <= 9; i++) {
        var sRow = createDiv("").parent(sliderPanel).style('display','flex').style('align-items','center').style('gap','5px');
        colorIndicators[i] = createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%');
        sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }

    updateLayout();
    [designSelect, modeSelect, dirSelect, inputField, sektS].forEach(e => e.input ? e.input(redraw) : e.changed(redraw));
}

function updateLayout() {
    if (!sliderPanel || !sliders[1]) return;
    var isMobile = windowWidth < 600;
    
    if (isMobile) {
        sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
    } else {
        sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column');
    }
    
    for (var i = 1; i <= 9; i++) {
        // Hier wird deine Anweisung für 75px Breite auf Mobile umgesetzt
        if (sliders[i]) sliders[i].style('width', isMobile ? '75px' : '80px');
    }
}

// ... (draw() Funktion bleibt weitgehend gleich, achte auf die Skalierung)

function exportHighRes() {
    // A4 Hochformat 300dpi: 2480 x 3508
    var pg = createGraphics(2480, 3508); 
    pg.colorMode(HSB, 360, 100, 100); 
    pg.background(255);
    
    var design = designSelect.value();
    var rawVal = inputField.value();
    var baseCode = (modeSelect.value() === 'Affirmation') ? getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (baseCode.length < 8) baseCode.push(0);
    var startDigit = baseCode[0] || 1;
    var drawCode = (dirSelect.value() === 'Innen') ? [...baseCode].reverse() : baseCode;
    
    pg.push(); 
    // Zentrierung im oberen Bereich für Platz für Text/Logo unten
    pg.translate(pg.width / 2, pg.height * 0.45); 
    
    // Optimierte Skalierung für High-Res
    if(design === "Quadrat") { 
        pg.scale(2.8); // Leicht reduziert, damit nichts abgeschnitten wird
        calcQuadratMatrix(drawCode); 
        renderQuadrat(startDigit, pg); 
    }
    else if(design === "Rund") { 
        pg.scale(2.5); 
        renderRund(drawCode, startDigit, pg); 
    }
    else if(design === "Wabe") { 
        pg.scale(2.2); 
        renderWabe(drawCode, startDigit, pg); 
    }
    pg.pop();

    // Wasserzeichen / Logo unten rechts oder zentriert
    if (logoImg && logoImg.width > 1) {
        var lW = 600; // Größeres Logo für den Druck
        var lH = (logoImg.height / logoImg.width) * lW;
        // Positioniert 150px vom Rand entfernt
        pg.image(logoImg, pg.width - lW - 150, pg.height - lH - 150, lW, lH);
    }
    
    save(pg, 'MilzMore_' + design + '_' + inputField.value() + '.png');
}
