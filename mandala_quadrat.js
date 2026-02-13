// MANDALA_QUADRAT.JS

/**
 * Berechnet die Matrix für das Quadrat-Mandala basierend auf dem 8-stelligen Code.
 */
function calcQuadratMatrix(code) {
  // Initialisierung der Matrix (20x20)
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  
  var d = [code[0], code[1]];
  var m = [code[2], code[3]];
  var j1 = [code[4], code[5]];
  var j2 = [code[6], code[7]];

  // Hilfsfunktion zum Setzen von 2x2 Blöcken
  function set2(r, c, v1, v2) { 
    if (r >= 20 || c >= 20) return; 
    qMatrix[r][c] = v1; 
    if(c+1 < 20) qMatrix[r][c+1] = v2; 
    if(r+1 < 20) qMatrix[r+1][c] = v2; 
    if(r+1 < 20 && c+1 < 20) qMatrix[r+1][c+1] = v1; 
  }

  // Kern-Logik Aufbau
  for(var i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
  for(var i = 0; i < 6; i+=2) { 
    set2(i, i+2, m[0], m[1]); 
    set2(i+2, i, m[0], m[1]); 
  }
  for(var i = 0; i < 4; i+=2) { 
    set2(i, i+4, j1[0], j1[1]); 
    set2(i+4, i, j1[0], j1[1]); 
  }
  set2(0, 6, j2[0], j2[1]); 
  set2(6, 0, j2[0], j2[1]);

  // Numerologische Auffüllung der Matrix
  for(var r = 0; r < 8; r++) { 
    for(var c = 8; c < 20; c++) qMatrix[r][c] = ex(qMatrix[r][c-2], qMatrix[r][c-1]); 
  }
  for(var c = 0; c < 20; c++) { 
    for(var r = 8; r < 20; r++) qMatrix[r][c] = ex(qMatrix[r-2][c], qMatrix[r-1][c]); 
  }
}

/**
 * Zeichnet das Quadrat-Mandala mit 4-facher Spiegelsymmetrie.
 */
function drawQuadrat(startDigit, target) {
  var ctx = target || window;
  var ts = 16; // Kachelgröße
  
  ctx.stroke(0, 35);
  ctx.strokeWeight(0.5);

  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];
      if (val !== 0) {
        // Farbauswahl basierend auf der Startziffer
        var hex = (colorMatrix[startDigit] && colorMatrix[startDigit][val]) ? colorMatrix[startDigit][val] : mapZ[val];
        var col = color(hex);
        
        // Helligkeits- und Sättigungssteuerung über die Slider
        var sVal = sliders[val] ? sliders[val].value() : 85;
        ctx.fill(
          hue(col), 
          map(sVal, 20, 100, 15, saturation(col)), 
          map(sVal, 20, 100, 98, brightness(col))
        );

        // Zeichnen der vier Quadranten (Spiegelung)
        ctx.rect(c * ts, -(r + 1) * ts, ts, ts); 
        ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
        ctx.rect(c * ts, r * ts, ts, ts); 
        ctx.rect(-(c + 1) * ts, r * ts, ts, ts);        
      }
    }
  }
}

/**
 * Hilfsfunktion für die numerologische Quersummen-Logik (1-9).
 */
function ex(a, b) { 
  var s = (a || 0) + (b || 0); 
  return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); 
}

/**
 * Aktualisiert die Slider-Breite speziell für das Quadrat-Modul.
 */
function updateLayoutQuadrat() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    // Mobile Slider auf 75px Breite setzen [cite: 2026-02-11]
    for (var i = 1; i <= 9; i++) {
      if(sliders[i]) sliders[i].style('width', '75px');
    }
  } else {
    for (var i = 1; i <= 9; i++) {
      if(sliders[i]) sliders[i].style('width', '80px');
    }
  }
}
