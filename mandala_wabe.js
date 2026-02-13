function exWabe(a, b) {
  var s = (a || 0) + (b || 0);
  return s === 0 ? 0 : (s % 9 === 0 ? 9 : s % 9);
}

function renderWabeKorrektLogic(code, cKey, target) {
  var ctx = target || window;
  var sz = 16.2; 
  ctx.stroke(0, 35);
  
  var path = (dirSWabe.value().includes('innen')) 
    ? [...code, ...[...code].reverse()] 
    : [...[...code].reverse(), ...code];

  for (var s = 0; s < 6; s++) {
    ctx.push();
    ctx.rotate(s * PI / 3);
    
    var m = Array(17).fill().map(() => Array(17).fill(0));
    for (var i = 0; i < 16; i++) m[16][i] = path[i % path.length];
    
    for (var r = 15; r >= 1; r--) {
      for (var i = 0; i < r; i++) {
        m[r][i] = exWabe(m[r+1][i], m[r+1][i+1]);
      }
    }

    for (var r = 1; r <= 16; r++) {
      for (var i = 0; i < r; i++) {
        var val = m[r][i];
        if (val >= 1 && val <= 9) {
          var col = color(colorMatrixWabe[cKey][val - 1]);
          var sVal = slidersWabe[val] ? slidersWabe[val].value() : 85;
          ctx.fill(
            hue(col), 
            map(sVal, 20, 100, 15, saturation(col)), 
            map(sVal, 20, 100, 98, brightness(col))
          );
        } else {
          ctx.fill(255);
        }

        var x = (i - (r - 1) / 2) * sz * sqrt(3);
        var y = -(r - 1) * sz * 1.5;
        
        ctx.beginShape();
        for (var a = PI / 6; a < TWO_PI; a += PI / 3) {
          ctx.vertex(x + cos(a) * sz, y + sin(a) * sz);
        }
        ctx.endShape(CLOSE);
      }
    }
    ctx.pop();
  }
}

function getCodeFromTextWabe(textStr) {
  var charMapWabe = {
    'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
    'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
  };
  
  var cleanText = textStr.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
  if (cleanText.length === 0) return [0,0,0,0,0,0,0,0];
  
  var currentRow = cleanText.split("").map(c => charMapWabe[c]).filter(n => n);
  
  while(currentRow.length < 8) currentRow.push(9);
  
  while (currentRow.length > 8) {
    var nextRow = [];
    for (var i = 0; i < currentRow.length - 1; i++) {
      nextRow.push(exWabe(currentRow[i], currentRow[i+1]));
    }
    currentRow = nextRow;
  }
  return currentRow;
}

function updateLayoutWabe() {
  var isMobile = windowWidth < 600;
  if (isMobile) {
    sliderPanelWabe.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
      .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
    
    for (var i = 1; i <= 9; i++) {
      if(slidersWabe[i]) slidersWabe[i].style('width', '75px');
    }
  } else {
    sliderPanelWabe.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
      .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
    
    for (var i = 1; i <= 9; i++) {
      if(slidersWabe[i]) slidersWabe[i].style('width', '80px');
    }
  }
}
