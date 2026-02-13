function calcWabeMatrixLogic(path) {
  let m = Array(17).fill().map(() => Array(17).fill(0));
  for (let i = 0; i < 16; i++) m[16][i] = path[i % path.length];
  for (let r = 15; r >= 1; r--) {
    for (let i = 0; i < r; i++) {
      m[r][i] = (m[r+1][i] + m[r+1][i+1]) % 9 || 9;
    }
  }
  return m;
}

function drawWabe(code, cKey) {
  let sz = 16.2;
  let path = [...code, ...[...code].reverse()];
  let m = calcWabeMatrixLogic(path);

  for (let s = 0; s < 6; s++) {
    push(); rotate(s * PI / 3);
    for (let r = 1; r <= 16; r++) {
      for (let i = 0; i < r; i++) {
        let val = m[r][i];
        fill(baseColors[(val-1+cKey)%9]); // Vereinfachte Farblogik
        let x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
        beginShape(); for (let a = PI/6; a < TWO_PI; a += PI/3) vertex(x + cos(a)*sz, y + sin(a)*sz); endShape(CLOSE);
      }
    }
    pop();
  }
}
