// In sketch.js - Suche die Stelle, wo die topBar erstellt wird:
var topBar = createDiv("").style('position', 'fixed').style('top', '0').style('left', '0').style('width', '100%')
    .style('background', '#2c3e50') // Wieder das professionelle Dunkelblau
    .style('color', '#fff').style('display', 'flex').style('padding', isMobile ? '4px 8px' : '10px 20px')
    .style('gap', isMobile ? '8px' : '20px').style('font-family', '"Inter", sans-serif').style('z-index', '200')
    .style('align-items', 'center').style('box-sizing', 'border-box').style('height', isMobile ? '55px' : '75px');
