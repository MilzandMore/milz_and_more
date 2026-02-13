class MandalaQuadrat {
  constructor() {
    this.qMatrix = [];
    this.mapZ = { 1: "#FFD670", 2: "#DEAAFF", 3: "#FF686B", 4: "#7A5BEC", 5: "#74FB92", 6: "#E9FF70", 7: "#C0FDFF", 8: "#B2C9FF", 9: "#FFCBF2" };
    this.colorMatrix = {
      1: { 1: "#FF0000", 2: "#0000FF", 3: "#00FF00", 4: "#FFFF00", 5: "#00B0F0", 6: "#00FFFF", 7: "#FF66FF", 8: "#FF9900", 9: "#9900FF" },
      2: { 1: "#0000FF", 2: "#00FF00", 3: "#FFFF00", 4: "#00B0F0", 5: "#00FFFF", 6: "#FF66FF", 7: "#FF9900", 8: "#9900FF", 9: "#FF0000" },
      3: { 1: "#00FF00", 2: "#FFFF00", 3: "#00B0F0", 4: "#00FFFF", 5: "#FF66FF", 6: "#FF9900", 7: "#9900FF", 8: "#FF0000", 9: "#0000FF" },
      4: { 1: "#FFFF00", 2: "#00B0F0", 3: "#00FFFF", 4: "#FF66FF", 5: "#FF9900", 6: "#9900FF", 7: "#FF0000", 8: "#0000FF", 9: "#00FF00" },
      5: { 1: "#00B0F0", 2: "#00FFFF", 3: "#FF66FF", 4: "#FF9900", 5: "#9900FF", 6: "#FF0000", 7: "#0000FF", 8: "#00FF00", 9: "#FFFF00" },
      6: { 1: "#00FFFF", 2: "#FF66FF", 3: "#FF9900", 4: "#9900FF", 5: "#FF0000", 6: "#0000FF", 7: "#00FF00", 8: "#FFFF00", 9: "#00B0F0" },
      7: { 1: "#FF66FF", 2: "#FF9900", 3: "#9900FF", 4: "#FF0000", 5: "#0000FF", 6: "#00FF00", 7: "#FFFF00", 8: "#00B0F0", 9: "#00FFFF" },
      8: { 1: "#FF9900", 2: "#9900FF", 3: "#FF0000", 4: "#0000FF", 5: "#00FF00", 6: "#FFFF00", 7: "#00B0F0", 8: "#00FFFF", 9: "#FF66FF" },
      9: { 1: "#9900FF", 2: "#FF0000", 3: "#0000FF", 4: "#00FF00", 5: "#FFFF00", 6: "#00B0F0", 7: "#00FFFF", 8: "#FF66FF", 9: "#FF9900" }
    };
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
    let startDigit = baseCode[0] || 1;
    let drawCode = (this.dirSelect.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;

    for (let i = 1; i <= 9; i++) {
      let hex = (this.colorMatrix[startDigit] && this.colorMatrix[startDigit][i]) ? this.colorMatrix[startDigit][i] : this.mapZ[i];
      if(this.colorIndicators[i]) this.colorIndicators[i].style('background-color', hex);
    }

    push();
    let scaleFactor = (min(width, height) / 850) * (isMobile ? 0.8 : 0.95);
    translate(width / 2, height / 2 + (isMobile ? -40 : 20));
    scale(scaleFactor);

    this.calcQuadratMatrix(drawCode);
    this.drawQuadrat(startDigit);
    pop();
  }

  ex(a, b) { 
    let s = (a || 0) + (b || 0); 
    return (s === 0) ? 0 : (s % 9 === 0 ? 9 : s % 9); 
  }

  calcQuadratMatrix(code) {
    this.qMatrix = Array(20).fill().map(() => Array(20).fill(0));
    let d = [code[0], code[1]], m = [code[2], code[3]], j1 = [code[4], code[5]], j2 = [code[6], code[7]];
    
    const set2 = (r, c, v1, v2) => { 
      if (r >= 20 || c >= 20) return; 
      this.qMatrix[r][c] = v1; 
      if(c+1 < 20) this.qMatrix[r][c+1] = v2; 
      if(r+1 < 20) this.qMatrix[r+1][c] = v2; 
      if(r+1 < 20 && c+1 < 20) this.qMatrix[r+1][c+1] = v1; 
    };

    for(let i = 0; i < 8; i+=2) set2(i, i, d[0], d[1]);
    for(let i = 0; i < 6; i+=2) { set2(i, i+2, m[0], m[1]); set2(i+2, i, m[0], m[1]); }
    for(let i = 0; i < 4; i+=2) { set2(i, i+4, j1[0], j1[1]); set2(i+4, i, j1[0], j1[1]); }
    set2(0, 6, j2[0], j2[1]); set2(6, 0, j2[0], j2[1]);

    for(let r = 0; r < 8; r++) { 
      for(let c = 8; c < 20; c++) this.qMatrix[r][c] = this.ex(this.qMatrix[r][c-2], this.qMatrix[r][c-1]); 
    }
    for(let c = 0; c < 20; c++) { 
      for(let r = 8; r < 20; r++) this.qMatrix[r][c] = this.ex(this.qMatrix[r-2][c], this.qMatrix[r-1][c]); 
    }
  }

  drawQuadrat(startDigit, target) {
    let ctx = target || window;
    let ts = 16;
    ctx.stroke(0, 35);
    ctx.strokeWeight(0.5);
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 20; c++) {
        let val = this.qMatrix[r][c];
        if (val !== 0) {
          let hex = (this.colorMatrix[startDigit] && this.colorMatrix[startDigit][val]) ? this.colorMatrix[startDigit][val] : this.mapZ[val];
          let col = color(hex);
          let sVal = this.sliders[val] ? this.sliders[val].value() : 85;
          ctx.fill(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
          
          ctx.rect(c * ts, -(r + 1) * ts, ts, ts); 
          ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
          ctx.rect(c * ts, r * ts, ts, ts); 
          ctx.rect(-(c + 1) * ts, r * ts, ts, ts);             
        }
      }
    }
  }

  getCodeFromDate() { 
    let val = this.inputField.value().replace(/\D/g, ""); 
    let res = val.split('').map(Number); 
    while (res.length < 8) res.push(0); 
    return res.slice(0, 8); 
  }

  getCodeFromText() { 
    let textStr = this.inputField.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, ""); 
    if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
    let row = textStr.split('').map(char => this.charMap[char] || 9);
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
