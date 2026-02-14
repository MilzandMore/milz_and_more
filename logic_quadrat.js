var qMatrix = [];
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
  var ts = 18;
  calcQuadratMatrix(drawCode);
  ctx.stroke(0, 30);
  for (var r = 0; r < 20; r++) {
    for (var c = 0; c < 20; c++) {
      var val = qMatrix[r][c];
      if (val !== 0) {
        var col = color(colorMatrixQuadrat[startDigit][val] || "#ccc");
        ctx.fill(hue(col), map(sliders[val].value(), 20, 100, 15, saturation(col)), brightness(col));
        ctx.rect(c*ts, r*ts, ts, ts); ctx.rect(-(c+1)*ts, r*ts, ts, ts);
        ctx.rect(c*ts, -(r+1)*ts, ts, ts); ctx.rect(-(c+1)*ts, -(r+1)*ts, ts, ts);
      }
    }
  }
}

function calcQuadratMatrix(code) {
  qMatrix = Array(20).fill().map(() => Array(20).fill(0));
  var ex = (a, b) => { var s = a + b; return s === 0 ? 0 : (s % 9 === 0 ? 9 : s % 9); };
  for(var i=0; i<8; i++) qMatrix[i][i] = code[i];
  for(var r=0; r<20; r++) { for(var c=0; c<20; c++) { if(r>0 && c>0 && qMatrix[r][c]===0) qMatrix[r][c] = ex(qMatrix[r-1][c], qMatrix[r][c-1]); } }
}
