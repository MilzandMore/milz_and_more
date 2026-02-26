console.log("Setup läuft");
console.log(window.parent.document.getElementById("loading"));
let ready = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 🔥 Loading im Parent-Dokument ausblenden
  const loading = window.parent.document.getElementById("loading");
  if (loading) loading.style.display = "none";
}

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
