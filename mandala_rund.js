// ==========================================
// 1. MANDALA_RUND.JS - LOGIK & ZEICHNUNG
// ==========================================

/**
 * Hilfsfunktion für die numerologische Berechnung (1-9)
 */
function exRund(a, b) {
  return (a + b) % 9 === 0 ? 9 : (a + b) % 9;
}

/**
 * Zeichnet einen einzelnen Sektor des runden Mandalas
 */
function drawSectorRundLogic(m, colors, target) {
  var ctx = target || window;
  var step = 20;
  var sc = int(sektSRund.value());
  var angle = TWO_PI / sc;
  var h = tan(angle / 2) * step;
  
  ctx.stroke(0, 35); 
  ctx.strokeWeight(0.5);

  for (var r = 0; r < m.length; r++) {
    for (var c = 0; c <= r; c++) {
      var v = m[r][c];
      var x = r * step; 
      var y = (c - r / 2) * h * 2;
      
      if (v >= 1 && v <= 9) {
        var baseCol = color(colors[v - 1]);
        // Sättigung und Helligkeit über Slider steuern
        var sVal = slidersRund[v] ? slidersRund[v].value() : 85;
        ctx.fill(
          hue(baseCol), 
          map(sVal, 20, 100, 15, saturation(baseCol)), 
          map(sVal, 20, 100, 98, brightness(baseCol))
        );
      } else {
        ctx.fill(255); 
      }
      
      // Zeichnet die Rauten-Form des Sektors
      ctx.beginShape(); 
      ctx.vertex(x, y); 
      ctx.vertex(x + step, y - h); 
      ctx.vertex(x + step * 2, y); 
      ctx.vertex(x + step, y + h); 
      ctx.endShape(CLOSE);
    }
  }
}

/**
 * Berechnet die numerische Matrix für den runden Sektor
 */
function buildSectorRund() {
  var n = 16;
  var m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
  var isAffirm = modeSelectRund.value() === 'Affirmation';
  
  // Code generieren
  var raw = isAffirm 
    ? codeFromAffirmRund(inputFieldRund.value()) 
    : inputFieldRund.value().replace(/\D/g, "").split("").map(Number);
    
  while (raw.length < 8) raw.push(0);
  raw = raw.slice(0, 8);
  colorSeedRund = raw[0];
  
  if(codeDisplayRund) codeDisplayRund.html(raw.join(""));
  
  // Spiegelung je nach Richtung
  var frame = (richtungSRund.value() === "b") ? [...raw].reverse() : [...raw];
  var base = [...frame].reverse().concat(frame);
  
  // Befüllung der Matrix-Ränder
  for (var i = 0; i < 16; i++) m[15][i] = base[i];
  for (var i = 0; i < 16; i++) { 
    var r = 15 - i; 
    m[r][0] = base[i]; 
    m[r][r] = base[i]; 
  }
  
  // Innere Berechnung (vereinfachte Darstellung der Logik)
  for (var c = 1; c <= 13; c++) m[14][c] = exRund(m[15][c], m[15][c + 1]);
  
  var fillMap = (c, coords) => coords.forEach(([r, k]) => m[r][k] = m[14][c]);
  fillMap(1, [[2, 1]]); 
  fillMap(2, [[3, 1], [3, 2], [13, 1], [13, 12]]);
  fillMap(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
  // ... (Restliche Matrix-Logik bleibt wie in deinem Original)
  
  return m;
}

/**
 * Erzeugt die verschobene Farbmatrix basierend auf der ersten Ziffer
 */
function getColorMatrixRund(seed) {
  var baseColorsRund = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
  var s = (seed === 0 || !seed) ? 1 : seed;
  var shift = (s - 1) % 9;
  return baseColorsRund.slice(shift).concat(baseColorsRund.slice(0, shift));
}

/**
 * Text zu Numerologie-Code Konvertierung
 */
function codeFromAffirmRund(text) {
  var arr = []; 
  text = text.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
  for (var c of text) if (affirmMapRund[c]) arr.push(affirmMapRund[c]);
  
  while (arr.length > 8) {
    var n = []; 
    for (var i = 0; i < arr.length - 1; i++) n.push(exRund(arr[i], arr[i + 1]));
    arr = n;
  }
  while (arr.length < 8) arr.push(0);
  return arr.slice(0, 8);
}

/**
 * Layout-Anpassung für Mobile (Slider 75px)
 */
function updateLayoutRund() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanelRund.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
    
    // Mobile Slider Breite [cite: 2026-02-11]
    for (var i = 1; i <= 9; i++) {
      if(slidersRund[i]) slidersRund[i].style('width', '75px');
    }
  } else {
    sliderPanelRund.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    
    for (var i = 1; i <= 9; i++) {
      if(slidersRund[i]) slidersRund[i].style('width', '80px');
    }
  }
}
