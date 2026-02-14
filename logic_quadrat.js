var qMatrix = [];
const mapZ = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };

var colorMatrixQuadrat = {
  1: { 1: "#FF0000", 2: "#0000FF", 3: "#00FF00", 4: "#FFFF00", 5: "#00B0F0", 6: "#00FFFF", 7: "#FF66FF", 8: "#FF9900", 9: "#9900FF" },
  2: { 1: "#0000FF", 2: "#00FF00", 3: "#FFFF00", 4: "#00B0F0", 5: "#00FFFF", 6: "#FF66FF", 7: "#FF9900", 8: "#9900FF", 9: "#FF0000" },
  3: { 1: "#00FF00", 2: "#FFFF00", 3: "#00B0F0", 4: "#00FFFF", 5: "#FF66FF", 6: "#FF9900", 7: "#9900FF", 8: "#FF0000", 9: "#0000FF" },
  4: { 1: "#FFFF00", 2: "#00B0F0", 3: "#00FFFF", 4: "#FF66FF", 5: "#FF9900", 6: "#9900FF", 7: "#FF0000", 8: "#0000FF", 9: "#00FF00" },
  5: { 1: "#00B0F0", 2: "#00FFFF", 3: "#FF66FF", 4: "#FF9900", 5: "#9900FF", 6: "#FF0000", 7: "#0000FF", 8: "#00FF00", 9: "#FFFF00" },
  6: { 1: "#00FFFF", 2: "#FF66FF", 3: "#FF9900", 4: "#9900FF", 5: "#FF0000", 6: "#0000FF", 7: "#00FF00", 8: "#FFFF00", 9: "#00B0F0" },
  7: { 1: "#FF66FF", 2: "#FF9900", 3: "#9900FF", 4: "#FF0000", 5: "#0000FF", 6: "#00FF00", 7: "#FFFF00", 8: "#00B0F0", 9: "#00FFFF" },
  8: { 1: "#FF9900", 2: "#9900FF", 3: "#FF0000", 4: "#0000FF", 5: "#00FF00", 6: "#FFFF00", 7: "#00B0F0", 8: "#00FFFF", 9: "#FF66FF" },
  9: { 1: "#9900FF", 2: "#FF0000", 3: "#0000FF", 4: "#00FF00", 5: "#FFFF00", 6: "#00B0F0", 7: "#00FFFF", 8: "#FF66FF", 9: "#FF9900" }
};

function renderQuadrat(drawCode, startDigit, target) {
  var ctx = target || window;
  var ts = 16;
  calcQuadratMatrix(drawCode);
  ctx.stroke(0, 35);
  ctx.strokeWeight(0.5);
  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];
      if (val !== 0) {
        var hex = (colorMatrixQuadrat[startDigit] && colorMatrixQuadrat[startDigit][val]) ? colorMatrixQuadrat[startDigit][val] : mapZ[val];
        var col = color(hex);
        var sVal = sliders[val] ? sliders[val].value() : 85;
        ctx.fill(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
        ctx.rect(c * ts, -(r + 1) * ts, ts, ts); ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
        ctx.rect(c * ts, r * ts, ts, ts); ctx.rect(-(c + 1) * ts, r * ts, ts, ts);        
      }
    }
  }
}

function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  var d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];
  function set2(r, c, v1, v2) { if (r >= 20 || c >= 20) return; qMatrix[r][c] = v1; if(c+1 < 20) qMatrix[r][c+1] = v2; if(r+1 < 20) qMatrix[r+1][c] = v2; if(r+1 < 20 && c+1 < 20) qMatrix[r+1][c+1] = v1; }
  for(var i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
  for(var i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
  for(var i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
  set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);
  var exQ = (a, b) => { var s = (a || 0) + (b || 0); return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); };
  for(var r = 0; r < 8; r++) { for(var c = 8; c < 20; c++) qMatrix[r][c] = exQ(qMatrix[r][c-2], qMatrix[r][c-1]); }
  for(var c = 0; c < 20; c++) { for(var r = 8; r < 20; r++) qMatrix[r][c] = exQ(qMatrix[r-2][c], qMatrix[r-1][c]); }
}
