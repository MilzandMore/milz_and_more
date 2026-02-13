class MandalaRund {
  constructor() {
    this.qMatrix = [];
    this.mapZ = { 1: "#FF0000", 2: "#00008B", 3: "#00FF00", 4: "#FFFF00", 5: "#87CEEB", 6: "#40E0D0", 7: "#FFC0CB", 8: "#FFA500", 9: "#9400D3" };
    this.charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
    this.uiElements = [];
    this.sliders = [];
    this.colorIndicators = [];
  }

  init(container) {
    let isMobile = windowWidth < 600;
    const createUIGroup = (labelTxt, element, wMobile, wDesktop) => {
      let group = createDiv("").parent(container).style('display', 'flex').style('flex-direction', 'column');
      createSpan(labelTxt).parent(group).style('font-size', '8px').style('color', '#bdc3c7').style('font-weight', 'bold');
      element.parent(group).style('width', isMobile ? wMobile : wDesktop).style('background', '#34495e').style('color', '#fff').style('border', 'none');
      this.uiElements.push(group);
    };

    this.modeSelect = createSelect();
    this.modeSelect.option('Geburtstag');
    this.modeSelect.option('Text');
    createUIGroup("MODUS", this.modeSelect, "70px", "100px");

    this.inputField = createInput('15011987');
    createUIGroup("EINGABE", this.inputField, "75px", "120px");

    this.sektorSelect = createSelect();
    [8, 12, 16, 24, 32].forEach(v => this.sektorSelect.option(v));
    this.sektorSelect.selected(8);
    createUIGroup("SEKTOR", this.sektorSelect, "40px", "60px");

    this.sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.9)').style('padding', '10px').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
      let sRow = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','5px').style('margin-bottom','3px');
      this.colorIndicators[i] = createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%').style('background', this.mapZ[i]);
      this.sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }
    this.updateLayout();
    [this.modeSelect, this.inputField, this.sektorSelect].forEach(e => e.input(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('bottom', '0').style('left', '0').style('top', 'auto').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('top', '80px').style('left', '0').style('bottom', 'auto').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '80px');
    }
  }

  render() {
    let baseCode = (this.modeSelect.value() === 'Geburtstag') ? this.getCodeFromDate() : this.getCodeFromText();
    push();
    translate(width/2, height/2 + 20);
    let scaleFactor = (min(width, height) / 900) * (windowWidth < 600 ? 0.7 : 0.9);
    scale(scaleFactor);
    this.calcMatrix(baseCode);
    this.drawMandala(int(this.sektorSelect.value()));
    pop();
  }

  ex(a, b) { let s = a + b; return (s % 9 === 0) ? 9 : s % 9; }

  calcMatrix(code) {
    this.qMatrix = Array(25).fill().map(() => Array(25).fill(0));
    for (let i = 0; i < 8; i++) this.qMatrix[0][i] = code[i];
    for (let r = 1; r < 24; r++) {
      for (let c = 0; c < 24 - r; c++) {
        this.qMatrix[r][c] = this.ex(this.qMatrix[r-1][c], this.qMatrix[r-1][c+1]);
      }
    }
  }

  drawMandala(sektoren) {
    let angle = 360 / sektoren;
    for (let s = 0; s < sektoren; s++) {
      push();
      rotate(radians(s * angle));
      if (s % 2 === 1) scale(1, -1);
      this.drawSektor();
      pop();
    }
  }

  drawSektor() {
    let h = 15, w = 10;
    for (let r = 0; r < 24; r++) {
      for (let c = 0; c < 24 - r; c++) {
        let val = this.qMatrix[r][c];
        if (val === 0) continue;
        let baseCol = color(this.mapZ[val]);
        let sVal = this.sliders[val].value();
        fill(hue(baseCol), map(sVal, 20, 100, 10, saturation(baseCol)), map(sVal, 20, 100, 100, brightness(baseCol)));
        stroke(0, 40);
        let x = c * w + r * (w/2);
        let y = r * h;
        quad(x, y, x + w/2, y + h, x, y + 2*h, x - w/2, y + h);
      }
    }
  }

  getCodeFromDate() {
    let d = this.inputField.value().replace(/\D/g, '');
    let res = d.split('').map(Number);
    while (res.length < 8) res.push(0);
    return res.slice(0, 8);
  }

  getCodeFromText() {
    let t = this.inputField.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, '');
    if (!t) return [1,1,1,1,1,1,1,1];
    let row = t.split('').map(c => this.charMap[c] || 9);
    while (row.length < 8) row.push(9);
    while (row.length > 8) {
      let next = [];
      for (let i = 0; i < row.length - 1; i++) next.push(this.ex(row[i], row[i+1]));
      row = next;
    }
    return row;
  }

  hide() { this.uiElements.forEach(e => e.hide()); this.sliderPanel.hide(); }
  show() { this.uiElements.forEach(e => e.show()); this.sliderPanel.show(); }
}
