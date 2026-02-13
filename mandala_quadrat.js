class MandalaQuadrat {
  constructor() {
    // Einheitliche Palette (wie Rund & Wabe)
    this.baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
    this.charMap = {
      'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,
      'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9
    };
    this.qMatrix = [];
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
    this.modeSelect.option('Geburtstag');
    this.modeSelect.option('Text');
    createUIGroup("MODUS", this.modeSelect, "80px", "110px");

    this.inputField = createInput('15011987');
    createUIGroup("EINGABE", this.inputField, "75px", "140px");

    // NEU: Code Anzeige (einheitlich mit den anderen Klassen)
    this.codeDisplay = createSpan("00000000");
    let cGroup = createUIGroup("CODE", null, "70px", "100px");
    this.codeDisplay.parent(cGroup).style('font-family', 'monospace').style('font-size', isMobile ? '10px' : '14px').style('color', '#ecf0f1').style('margin-top', '5px');

    this.dirSelect = createSelect();
    this.dirSelect.option('Außen');
    this.dirSelect.option('Innen');
    createUIGroup("RICHTUNG", this.dirSelect, "65px", "100px");

    // Slider Panel
    this.sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
      let sRow = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','8px').style('margin-bottom', '4px');
      this.colorIndicators[i] = createDiv("").parent(sRow).style('width', isMobile ? '10px' : '12px').style('height', isMobile ? '10px' : '12px').style('border-radius', '50%').style('border', '1px solid rgba(255,255,255,0.2)');
      this.sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }

    this.updateLayout();
    [this.modeSelect, this.dirSelect, this.inputField].forEach(e => e.input ? e.input(() => redraw()) : e.changed(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%')
        .style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto')
        .style('display', 'flex').style('flex-direction', 'column').style('padding', '12px').style('border-radius', '0 8px 8px 0');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '100px');
    }
  }

  // Hilfsfunktion für die rotierende Farbmatrix
  getColorMatrix(seed) {
    let s = (seed === 0 || !seed) ? 1 : seed;
    let shift = (s - 1) % 9;
    return this.baseColors.slice(shift).concat(this.baseColors.slice(0, shift));
  }

  render() {
    let isMobile = windowWidth < 600;
    let baseCode = (this.modeSelect.value().includes('Geburtstag')) ? this.getCodeFromDate() : this.getCodeFromText();
    
    // Code Anzeige aktualisieren
    if (this.codeDisplay) this.codeDisplay.html(baseCode.join(""));
    
    let seed = baseCode[0] || 1;
    let currentColors = this.getColorMatrix(seed); // Rotiert basierend auf Code
    let drawCode = (this.dirSelect.value().includes('Innen')) ? [...baseCode].reverse() : baseCode;

    // Farbpunkte am Slider rotieren lassen
    for (let i = 1; i <= 9; i++) {
      if(this.colorIndicators[i]) this.colorIndicators[i].style('background-color', currentColors[i-1]);
    }

    push();
    let scaleFactor = (min(width, height) / 850) * (isMobile ? 0.80 : 0.95);
    let centerY = isMobile ? height / 2 - 40 : height / 2 + 20;
    translate(width / 2, centerY);
    scale(scaleFactor);

    this.calcQuadratMatrix(drawCode);
    this.drawQuadrat(currentColors); // Matrix übergeben
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

  drawQuadrat(colors, target) {
    let ctx = target || window;
    let ts = 16;
    ctx.stroke(0, 35);
    ctx.strokeWeight(0.5);
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 20; c++) {
        let val = this.qMatrix[r][c];
        if (val >= 1 && val <= 9) {
          let hex = colors[val - 1];
          let col = color(hex);
          let sVal = this.sliders[val] ? this.sliders[val].value() : 85;
          ctx.fill(hue(col), map(sVal, 20, 100, 15, saturation(col)), map(sVal, 20, 100, 98, brightness(col)));
          
          ctx.rect(c * ts, -(r + 1) * ts, ts, ts); 
          ctx.rect(-(c + 1) * ts, -(r + 1) * ts, ts, ts); 
          ctx.rect(c * ts, r * ts, ts, ts); 
          ctx.rect(-(c + 1) * ts, r * ts, ts, ts);             
        } else if (val === 0) {
          ctx.fill(255);
          ctx.rect(c * ts, -(r + 1) * ts, ts, ts);
        }
      }
    }
  }

  getCodeFromDate() { 
    let val = this.inputField.value().replace(/[^0-9]/g, ""); 
    let res = val.split('').map(Number); 
    while (res.length < 8) res.push(0); 
    return res.slice(0, 8); 
  }

  getCodeFromText() { 
    let textStr = this.inputField.value().toUpperCase().replace(/[^A-ZÄÖÜß]/g, ""); 
    if (textStr.length === 0) return [1,1,1,1,1,1,1,1];
    let firstRow = [];
    for (let char of textStr) { if (this.charMap[char]) firstRow.push(this.charMap[char]); }
    let currentRow = firstRow; while(currentRow.length < 8) currentRow.push(9);
    while (currentRow.length > 8) { 
      let nextRow = []; 
      for (let i = 0; i < currentRow.length - 1; i++) { 
        let sum = currentRow[i] + currentRow[i+1]; 
        nextRow.push(sum % 9 === 0 ? 9 : sum % 9); 
      } 
      currentRow = nextRow; 
    }
    return currentRow;
  }

  hide() { this.uiElements.forEach(e => e.style('display', 'none')); this.sliderPanel.style('display', 'none'); }
  show() { this.uiElements.forEach(e => e.style('display', 'flex')); this.sliderPanel.style('display', 'flex'); if (windowWidth < 600) this.sliderPanel.style('display', 'grid'); }
}
