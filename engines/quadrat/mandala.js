console.log("QUADRAT LOADED ✅");
window.onerror = function (msg, src, line, col, err) {
  console.error("🔥 JS ERROR:", msg, "at", line + ":" + col, src);
  if (err) console.error(err);
};
let logoImg;

function preload(){
  logoImg = loadImage("../../assets/Logo.png");
}

function setup(){
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw(){
  background(12);
  fill(200,80,80);
  rect(100,100,400,400);

  // Test: Logo sichtbar?
  if (logoImg) image(logoImg, 20, 20, 120, 40);
}
