class MandalaQuadrat {
  constructor() {
    this.qMatrix = {
      1: ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"],
      2: ["#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000"],
      3: ["#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B"],
      4: ["#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00"],
      5: ["#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00"],
      6: ["#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB"],
      7: ["#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0"],
      8: ["#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB"],
      9: ["#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500"]
    };
    this.charMap = { A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 };
    this.ex = (a, b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;
    
    this.uiElements = [];
    this.sliders = [];
    this.colorIndicators = [];
  }

  init(container) {
    let isMobile = windowWidth < 600;
    const createUI = (lbl, el, wM, wD) => {
      let g = createDiv("").parent(container).style('display','flex').style('flex-direction','column');
      createSpan(lbl).parent(g).style('font-size','10px').style('color','#bdc3c7').style('font-weight','bold');
      el.parent(g).style('width', isMobile ? wM : wD).style('background','#34495e').style('color','#fff').style('border','none').style('border-radius','4px').style('height', isMobile ? '22px' : '32px');
      this.uiElements.push(g);
    };

    this.modeSelect = createSelect();
    ['Geburtstag','Affirmation'].forEach(o => this.modeSelect.option(o));
    createUI("MODUS", this.modeSelect, "80px", "110px");

    this.inputField = createInput("15011987");
    createUI("EINGABE", this.inputField, "75px", "140px");

    this.sliderPanel = createDiv("").style('position','fixed').style('background','rgba(44,62,80,0.98)').style('z-index','150');
    for (let i = 1; i <= 9; i++) {
      let r = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
      this.colorIndicators[i] = createDiv("").parent(r).style('width','8px').style('height','8px').style('border-radius','50%');
      this.sliders[i] = createSlider(20,100,85).parent(r).input(() => redraw());
    }
    
    this.updateLayout();
    [this.modeSelect, this.inputField].forEach(el => el.input(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('top','auto').style('bottom','0').style('left','0').style('width','100%').style('display','grid').style('grid-template-columns','repeat(3,1fr)').style('padding','8px');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('bottom','auto').style('top','90px').style('left','0').style('width','auto').style('display','flex').style('flex-direction','column').style('padding','12px');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '80px');
    }
  }

  render() {
    let raw = this.inputField.value().trim();
    if (!raw) return;
    let code = (this.modeSelect.value() === 'Affirmation') ? this.getAffirmCode(raw) : raw.replace(/\D/g, "").split("").map(Number);
    while (code.length < 8) code.push(0);
    code = code.slice(0, 8);
    let cKey = code[0] || 1;
    let colors = this.qMatrix[cKey];

    for (let i = 1; i <= 9; i++) this.colorIndicators[i].style('background', colors[i-1]);

    push();
    translate(width/2, height/2 + (windowWidth < 600 ? -40 : 20));
    let sc = (min(width, height) / 550) * (windowWidth < 600 ? 0.8 : 1.0);
    scale(sc);
    this.drawMandala(code, colors);
    pop();
  }

  drawMandala(code, colors, target) {
    let ctx = target || window;
    let m = Array(16).fill().map(() => Array(16).fill(0));
    for (let i = 0; i < 8; i++) { m[0][i] = code[i]; m[0][15-i] = code[i]; }
    for (let r = 1; r < 16; r++) {
      for (let c = 0; c < 16 - r; c++) m[r][c] = this.ex(m[r-1][c], m[r-1][c+1]);
    }
    let sz = 15;
    ctx.stroke(0, 40);
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16 - r; c++) {
        let v = m[r][c];
        if (v > 0) {
          let base = color(colors[v-1]);
          let s = this.sliders[v].value();
          ctx.fill(hue(base), map(s, 20, 100, 15, saturation(base)), map(s, 20, 100, 98, brightness(base)));
          ctx.rect((c + r/2 - 8) * sz, (r - 8) * sz, sz, sz);
          ctx.rect((-(c + r/2) + 7) * sz, (r - 8) * sz, sz, sz);
          ctx.rect((c + r/2 - 8) * sz, (7 - r) * sz, sz, sz);
          ctx.rect((-(c + r/2) + 7) * sz, (7 - r) * sz, sz, sz);
        }
      }
    }
  }

  getAffirmCode(t) {
    let a = t.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "").split("").map(c => this.charMap[c]).filter(n => n);
    while (a.length < 8) a.push(9);
    while (a.length > 8) {
      let n = [];
      for (let i = 0; i < a.length - 1; i++) n.push(this.ex(a[i], a[i+1]));
      a = n;
    }
    return a;
  }

  exportHighRes(logo, admin) {
    let pg = createGraphics(2480, 3508);
    pg.colorMode(HSB, 360, 100, 100); pg.background(255);
    let code = (this.modeSelect.value() === 'Affirmation') ? this.getAffirmCode(this.inputField.value()) : this.inputField.value().replace(/\D/g, "").split("").map(Number);
    while (code.length < 8) code.push(0);
    let cKey = code[0] || 1;
    pg.push(); pg.translate(1240, 1500); pg.scale(4.5);
    this.drawMandala(code.slice(0,8), this.qMatrix[cKey], pg);
    pg.pop();
    if (logo) pg.image(logo, 2480-600, 3508-400, 500, 300);
    save(pg, "Mandala_Quadrat.png");
  }

  hide() { this.uiElements.forEach(e => e.hide()); this.sliderPanel.hide(); }
  show() { this.uiElements.forEach(e => e.show()); this.sliderPanel.show(); }
}
