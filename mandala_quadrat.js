// ==========================================
// 1. MANDALA_QUADRAT.JS - LOGIK & ZEICHNUNG
// ==========================================

/**
 * Hilfsfunktion für die numerologische Berechnung (1-9)
 */
function exQuadrat(a, b) { 
  var s = (a || 0) + (b || 0); 
  return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); 
}

/**
 * Zeichnet das quadratische Mandala basierend auf der berechneten Matrix
 */
function drawQuadratShape(startDigit, target) {
  var ctx = target || window;
  var ts = 16; // Kachelgröße
  ctx.stroke(0, 35);
  ctx.strokeWeight(0.5);

  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrixQuadrat[r][c];
      if (val !== 0) {
        // Farbauswahl basierend auf der Startziffer (Farbrad-Verschiebung)
        var hex = (colorMatrixQuadrat[startDigit] && colorMatrixQuadrat[startDigit][val]) 
                  ? colorMatrixQuadrat[startDigit][val] 
                  : mapZQuadrat[val];
        
        var col = color(hex);
        // Sättigung und Helligkeit über Slider steuern
        var sVal = slidersQuadrat[val] ? slidersQuadrat[val].value() : 85;
        
        ctx.fill(
          hue(col), 
          map(sVal, 20, 100, 15, saturation(col)), 
          map(sVal, 20, 100, 98, brightness(col))
        );

        // Spiegelung in alle 4 Quadranten
        ctx.rect(c * ts, -(r + 1) * ts, ts, ts);      // Oben Rechts
        ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); // Oben Links
        ctx.rect(c * ts, r * ts, ts, ts);             // Unten Rechts
        ctx.rect(-(c + 1) * ts, r * ts, ts, ts);      // Unten Links
      }
    }
  }
}

/**
 * Berechnet die Matrix für das quadratische Mandala
 */
function calcQuadratMatrixLogic(code) {
  qMatrixQuadrat = Array(20).fill().map(() => Array(20).fill(0));
  
  // Segmentierung des Codes
  var d = [code[0], code[1]];
  var m = [code[2], code[3]];
  var j1 = [code[4], code[5]];
  var j2 = [code[6], code[7]];

  // Hilfsfunktion zum Setzen von 2x2 Blöcken
  function set2(r, c, v1, v2) { 
    if (r >= 20 || c >= 20) return; 
    qMatrixQuadrat[r][c] = v1; 
    if(c+1 < 20) qMatrixQuadrat[r][c+1] = v2; 
    if(r+1 < 20) qMatrixQuadrat[r+1][c] = v2; 
    if(r+1 < 20 && c+1 < 20) qMatrixQuadrat[r+1][c+1] = v1; 
  }

  // Grundmuster füllen
  for(var i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
  for(var i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
  for(var i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
  set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);

  // Matrix-Expansion (Berechnung der restlichen Felder)
  for(var r = 0; r < 8; r++) { 
    for(var c = 8; c < 20; c++) {
      qMatrixQuadrat[r][c] = exQuadrat(qMatrixQuadrat[r][c-2], qMatrixQuadrat[r][c-1]); 
    }
  }
  for(var c = 0; c < 20; c++) { 
    for(var r = 8; r < 20; r++) {
      qMatrixQuadrat[r][c] = exQuadrat(qMatrixQuadrat[r-2][c], qMatrixQuadrat[r-1][c]); 
    }
  }
}

/**
 * Wandelt Text in numerischen Code um
 */
function getCodeFromTextQuadrat() { 
  var textStr = inputFieldQuadrat.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, ""); 
  if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
  
  var firstRow = [];
  for (var char of textStr) { 
    if (charMapQuadrat[char]) firstRow.push(charMapQuadrat[char]); 
  }
  
  var currentRow = firstRow; 
  while(currentRow.length < 8) currentRow.push(9);
  
  while (currentRow.length > 8) { 
    var nextRow = []; 
    for (var i = 0; i < currentRow.length - 1; i++) { 
      var sum = currentRow[i] + currentRow[i+1]; 
      nextRow.push(sum % 9 === 0 ? 9 : sum % 9); 
    } 
    currentRow = nextRow; 
  } 
  return currentRow;
}

/**
 * Layout-Anpassung (Mobile/Desktop)
 */
function updateLayoutQuadrat() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanelQuadrat.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
    
    // Mobile Slider Breite fixieren [cite: 2026-02-11]
    for (var i = 1; i <= 9; i++) {
      if(slidersQuadrat[i]) slidersQuadrat[i].style('width', '75px');
    }
  } else {
    sliderPanelQuadrat.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    
    for (var i = 1; i <= 9; i++) {
      if(slidersQuadrat[i]) slidersQuadrat[i].style('width', '80px');
    }
  }
}
