class MandalaWabe {
  constructor() {
    this.qMatrix = [];
    this.mapZ = { 1: "#FF0000", 2: "#00008B", 3: "#00FF00", 4: "#FFFF00", 5: "#87CEEB", 6: "#40E0D0", 7: "#FFC0CB", 8: "#FFA500", 9: "#9400D3" };
    this.charMap = {
      'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
      'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
    };
    this.uiElements = [];
    this.sliders = [];
    this.colorIndicators = [];
  }

  init(container) {
    let isMobile = windowWidth < 600;
    const createUIGroup = (labelTxt, element, wMobile, wDesktop) => {
      let group = createDiv("").parent(container).style('display', 'flex').style('flex-direction', 'column');
      createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('font-weight', 'bold');
      if (element) {
        element.parent(group).style('width', isMobile ? wMobile : wDesktop)
          .style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px');
      }
      this.uiElements.push(group);
      return group;
    };

    this.modeSelect = createSelect();
    this.modeSelect.option('Geburtstag');
    this.modeSelect.option('Text');
    createUIGroup("MODUS", this.modeSelect, "80px", "110px");

    this.inputField = createInput('15011987');
    createUIGroup("EINGABE", this.inputField, "75px", "140px");

    this.dirSelect = createSelect();
    this.dirSelect.option('Außen');
    this.dirSelect.option('Innen');
    createUIGroup("RICHTUNG", this.dirSelect, "65px", "100px");

    this.sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.9)').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
      let sRow = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','5px');
      this.colorIndicators[i] = createDiv("").parent(sRow).style('width', '10px').style('height', '10px').style('border-radius', '50%');
      this.sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }

    this.updateLayout();
    [this.modeSelect, this.dirSelect, this.inputField].forEach(e => e.input(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '5px');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column').style('padding', '10px');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '80px');
    }
  }

  render() {
    let isMobile = windowWidth < 600;
    let baseCode = (this.modeSelect.value().includes('Geburtstag')) ? this.getCodeFromDate() : this.getCodeFromText();
    let drawCode = (this.dirSelect.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;

    for (let i = 1; i <= 9; i++) {
      if(this.colorIndicators[i]) this.colorIndicators[i].style('background-color', this.mapZ[i]);
    }

    push();
    let scaleFactor = (min(width, height) / 950) * (isMobile ? 0.75 : 0.9);
    translate(width / 2, height / 2 + (isMobile ? -30 : 20));
    scale(scaleFactor);

    this.calcWabeMatrix(drawCode);
    this.drawWabe();
    pop();
  }

  ex(a, b) { let s = (a || 0) + (b || 0); return (s % 9 === 0) ? 9 : s % 9; }

  calcWabeMatrix(code) {
    this.qMatrix = Array(25).fill().map(() => Array(25).fill(0));
    for (let i = 0; i < 8; i++) this.qMatrix[0][i] = code[i];
    for (let r = 1; r < 24; r++) {
      for (let c = 0; c < 24 - r; c++) {
        this.qMatrix[r][c] = this.ex(this.qMatrix[r - 1][c], this.qMatrix[r - 1][c + 1]);
      }
    }
  }

  drawWabe() {
    let size = 12;
    let h = sqrt(3) * size;
    for (let s = 0; s < 6; s++) {
      push();
      rotate(radians(s * 60));
      for (let r = 0; r < 24; r++) {
        for (let c = 0; c < 24 - r; c++) {
          let val = this.qMatrix[r][c];
          if (val === 0) continue;
          let baseCol = color(this.mapZ[val]);
          let sVal = this.sliders[val] ? this.sliders[val].value() : 85;
          fill(hue(baseCol), map(sVal, 20, 100, 15, saturation(baseCol)), map(sVal, 20, 100, 98, brightness(baseCol)));
          stroke(0, 30);
          let x = (c + r * 0.5) * (size * 1.5);
          let y = r * (h * 0.5);
          this.drawHex(x, y, size);
        }
      }
      pop();
    }
  }

  drawHex(x, y, size) {
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = radians(60 * i);
      vertex(x + cos(angle) * size, y + sin(angle) * size);
    }
    endShape(CLOSE);
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
