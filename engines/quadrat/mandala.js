let ready = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Loading sicher entfernen (liegt im selben Dokument)
  const loading = document.getElementById("loading");
  if (loading) loading.remove();

  ready = true;
}

function draw() {
  if (!ready) return;

  background(10);

  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);
  stroke(255);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  rect(0, 0, 260, 260);
  pop();

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text("QUADRAT LÄUFT ✅", width / 2, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
