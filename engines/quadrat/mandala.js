let ready = false;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent(document.body);

  background(20);
  rectMode(CENTER);
  noFill();
  stroke(255);

  // Loading entfernen
  const loading = document.getElementById("loading");
  if (loading) loading.remove();

  ready = true;
}

function draw() {
  if (!ready) return;

  translate(width / 2, height / 2);
  rotate(frameCount * 0.005);

  strokeWeight(1);
  rect(0, 0, 300, 300);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(20);
}
