let currentApp = 'Wabe';
let menuSelect;

function preload() {
    // Zentrales Laden des Logos
    logoImg = loadImage('logo.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // 1. Initialisiere alle drei Apps (die umbenannten Setups)
    setupWabe();
    setupRund();
    setupQuadrat();

    // 2. Erstelle das Hauptmenü zur Auswahl
    createMainMenu();

    // 3. Initialer Status: Nur Wabe zeigen
    switchApp('Wabe');
}

function createMainMenu() {
    let navContainer = createDiv("").style('position', 'fixed').style('top', '15px').style('left', '10px').style('z-index', '1000');
    
    menuSelect = createSelect().parent(navContainer);
    menuSelect.option('Wabe');
    menuSelect.option('Rund');
    menuSelect.option('Quadrat');
    
    // Style das Menü professionell
    menuSelect.style('padding', '5px 10px').style('border-radius', '4px').style('background', '#ecf0f1').style('font-weight', 'bold');
    
    menuSelect.changed(() => {
        switchApp(menuSelect.value());
    });
}

function switchApp(appName) {
    currentApp = appName;

    // Alle Topbars und Slider-Panels verstecken
    // (Hinweis: Stelle sicher, dass du in den 3 Dateien die Variablen topBar und sliderPanel 
    // ebenfalls eindeutig benannt hast, z.B. topBarWabe, sliderPanelWabe)
    
    [topBarWabe, sliderPanelWabe].forEach(e => e.hide());
    [topBarRund, sliderPanelRund].forEach(e => e.hide());
    [topBarQuadrat, sliderPanelQuadrat].forEach(e => e.hide());

    // Nur die aktive App zeigen
    if (appName === 'Wabe') { topBarWabe.show(); sliderPanelWabe.show(); }
    if (appName === 'Rund') { topBarRund.show(); sliderPanelRund.show(); }
    if (appName === 'Quadrat') { topBarQuadrat.show(); sliderPanelQuadrat.show(); }
    
    redraw();
}

function draw() {
    background(255);
    
    // Führe nur die draw-Logik der gewählten App aus
    if (currentApp === 'Wabe') drawWabe();
    else if (currentApp === 'Rund') drawRund();
    else if (currentApp === 'Quadrat') drawQuadrat();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Alle Layouts anpassen
    updateLayoutWabe();
    updateLayoutRund();
    updateLayoutQuadrat();
    redraw();
}
