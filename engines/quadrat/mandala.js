alert("mandala.js wurde geladen ✅");
console.log("mandala.js läuft");
}

function setup() {
  console.log("🟢 setup läuft");

  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  console.log("🟢 draw läuft");

  background(30);

  // Test-Text (ersetzt dein "Loading…")
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("QUADRAT LÄUFT ✅", width / 2, height / 2);

  // Logo optional anzeigen
  if (logoImg) {
    imageMode(CENTER);
    image(logoImg, width / 2, height / 2 + 80, 120, 120);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
