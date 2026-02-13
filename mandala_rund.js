class MandalaRund {
  constructor() {
    this.baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
    this.affirmMap = { 
      A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, 
      E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 
    };
    this.colorSeed = 1;
    this.uiElements = [];
    this.sliders = [];
    this.colorIndicators = [];
  }

  init(container) {
    let isMobile = windowWidth < 600;
    const createUIGroup = (labelTxt, element, wMobile, wDesktop) => {
      let group = createDiv("").parent(container).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
      createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
      if (element) {
        element.parent(group).style('width', isMobile ? wMobile : wDesktop)
          .style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff')
          .style('border', 'none').style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px')
          .style('height', isMobile ? '22px' : '32px');
      }
      this.uiElements.push(group);
      return group;
    };

    this.modeSelect = createSelect();
    this.modeSelect.option('Geburtstag'); this.modeSelect.option('Affirmation');
    createUIGroup("MODUS", this.modeSelect, "80px", "110px");

    this.inputField = createInput("15011987");
    createUIGroup("EINGABE", this.inputField, "75px", "140px");

    this.sektS = createSelect();
    ["6","8","10","12","13"].forEach(s => this.sektS.option(s, s)); this.sektS.selected("8");
    createUIGroup("SEKTOR", this.sektS, "40px", "60px");

    this.richtungS = createSelect(); 
    this.richtungS.option("Außen", "a"); this.richtungS.option("Innen", "b");
    this.richtungS.selected("a");
    createUIGroup("RICHTUNG", this.richtungS, "65px", "100px");

    this.sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
      let sRow = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
      this.colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
      this.sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }

    this.updateLayout();
    [this.modeSelect, this.inputField, this.sektS, this.richtungS].forEach(e => e.input ? e.input(() => redraw()) : e.changed(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
        .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px').style('gap', '4px');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
        .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '80px');
    }
  }

  render() {
    let isMobile = windowWidth < 600;
    let rawVal = this.inputField.value().trim();
    if (rawVal === "" || (this.modeSelect.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0)) return;

    let sector = this.buildSector();
    let currentColors = this.getColorMatrix(this.colorSeed);
    
    push();
    let centerY = isMobile ? height / 2 - 40 : height / 2 + 20;
    let centerX = width / 2; 
    translate(centerX, centerY);
    
    let scaleFactor = (min(width, height) / 900) * (isMobile ? 0.85 : 0.95);
    scale(scaleFactor);
    
    let sc = int(this.sektS.value());
    let angle = TWO_PI / sc;
    for (let i = 0; i < sc; i++) {
      push(); rotate(i * angle); this.drawSector(sector, currentColors); pop();
    }
    pop();
  }

  ex(a,b) { return (a + b) % 9 === 0 ? 9 : (a + b) % 9; }

  buildSector() {
    let n = 16;
    let m = Array.from({length: n}, (_, r) => Array(r + 1).fill(0));
    let isAffirm = this.modeSelect.value() === 'Affirmation';
    let raw = isAffirm ? this.codeFromAffirm(this.inputField.value()) : this.inputField.value().replace(/\D/g, "").split("").map(Number);
    while (raw.length < 8) raw.push(0);
    raw = raw.slice(0, 8);
    this.colorSeed = raw[0];
    
    let frame = (this.richtungS.value() === "b") ? [...raw].reverse() : [...raw];
    let base = [...frame].reverse().concat(frame);
    for (let i = 0; i < 16; i++) m[15][i] = base[i];
    for (let i = 0; i < 16; i++) { let r = 15 - i; m[r][0] = base[i]; m[r][r] = base[i]; }
    for (let c = 1; c <= 13; c++) m[14][c] = this.ex(m[15][c], m[15][c + 1]);
    
    let c14 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[14][c]);
    c14(1, [[2, 1]]); c14(2, [[3, 1], [3, 2], [13, 1], [13, 12]]); c14(3, [[4, 1], [4, 3], [12, 1], [12, 11]]);
    c14(4, [[5, 1], [5, 4], [11, 1], [11, 10]]); c14(5, [[6, 1], [6, 5], [10, 1], [10, 9]]);
    c14(6, [[7, 1], [7, 6], [9, 1], [9, 8]]); c14(7, [[8, 1], [8, 7]]);
    
    for (let c = 2; c <= 10; c++) m[13][c] = this.ex(m[14][c], m[14][c + 1]);
    let c13 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[13][c]);
    c13(2, [[4, 2], [13, 11]]); c13(3, [[12, 2], [12, 10], [5, 2], [5, 3]]);
    c13(4, [[11, 2], [11, 9], [6, 4], [6, 2]]); c13(5, [[10, 2], [10, 8], [7, 5], [7, 2]]);
    c13(6, [[9, 2], [9, 7], [8, 6], [8, 2]]);
    
    for (let j = 3; j <= 8; j++) m[12][j] = this.ex(m[13][j], m[13][j+1]);
    let c12 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[12][c]);
    c12(3, [[12, 9], [6, 3]]); c12(4, [[11, 3], [11, 8], [7, 4], [7, 3]]);
    c12(5, [[10, 3], [10, 7], [8, 5], [8, 3]]); c12(6, [[9, 3], [9, 6]]);
    
    m[11][4] = this.ex(m[12][4], m[12][5]); m[11][5] = this.ex(m[12][5], m[12][6]); m[11][6] = this.ex(m[12][6], m[12][7]);
    let c11 = (c, t) => t.forEach(([r, k]) => m[r][k] = m[11][c]);
    c11(4, [[11, 7], [8, 4]]); c11(5, [[10, 4], [10, 6], [9, 4], [9, 5]]);
    m[10][5] = this.ex(m[11][5], m[11][6]);
    return m;
  }

  drawSector(m, colors, target) {
    let ctx = target || window;
    let step = 20;
    let sc = int(this.sektS.value());
    let angle = TWO_PI / sc;
    let h = tan(angle / 2) * step;
    ctx.stroke(0, 35); 
    ctx.strokeWeight(0.5);
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c <= r; c++) {
        let v = m[r][c];
        let x = r * step; 
        let y = (c - r / 2) * h * 2;
        if (v >= 1 && v <= 9) {
          let baseCol = color(colors[v - 1]);
          let sVal = this.sliders[v] ? this.sliders[v].value() : 85;
          ctx.fill(hue(baseCol), map(sVal, 20, 100, 15, saturation(baseCol)), map(sVal, 20, 100, 98, brightness(baseCol)));
        } else ctx.fill(255); 
        
        ctx.beginShape(); 
        ctx.vertex(x, y); 
        ctx.vertex(x + step, y - h); 
        ctx.vertex(x + step * 2, y); 
        ctx.vertex(x + step, y + h); 
        ctx.endShape(CLOSE);
      }
    }
  }

  codeFromAffirm(text) {
    let arr = []; text = text.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    for (let c of text) if (this.affirmMap[c]) arr.push(this.affirmMap[c]);
    while (arr.length > 8) {
      let n = []; for (let i = 0; i < arr.length - 1; i++) n.push(this.ex(arr[i], arr[i + 1]));
      arr = n;
    }
    while (arr.length < 8) arr.push(0);
    return arr.slice(0, 8);
  }

  getColorMatrix(seed) {
    let s = (seed === 0 || !seed) ? 1 : seed;
    let shift = (s - 1) % 9;
    return this.baseColors.slice(shift).concat(this.baseColors.slice(0, shift));
  }

  hide() { this.uiElements.forEach(e => e.hide()); this.sliderPanel.hide(); }
  show() { this.uiElements.forEach(e => e.show()); this.sliderPanel.show(); }
}
