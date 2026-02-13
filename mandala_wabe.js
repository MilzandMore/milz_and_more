// mandala_wabe.js
class MandalaWabe {
  constructor() {
    this.colorMatrix = {
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
    this.charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
    this.ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);
    this.inputD = null; this.dirS = null; this.modeS = null; this.codeDisplay = null;
    this.sliders = []; this.colorIndicators = []; this.sliderPanel = null;
  }

  init(topBarContainer) {
    let isMobile = windowWidth < 600;
    const createUIGroup = (labelTxt, element, wMobile, wDesktop) => {
      let group = createDiv("").parent(topBarContainer).style('display', 'flex').style('flex-direction', 'column').style('justify-content', 'center');
      createSpan(labelTxt).parent(group).style('font-size', isMobile ? '8px' : '10px').style('color', '#bdc3c7').style('text-transform', 'uppercase').style('font-weight', 'bold').style('margin-bottom', '2px');
      if (element) {
        element.parent(group).style('width', isMobile ? wMobile : wDesktop).style('font-size', isMobile ? '11px' : '13px').style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px').style('padding', isMobile ? '3px 5px' : '6px 8px').style('height', isMobile ? '22px' : '32px');
      }
      return group;
    };

    this.modeS = createSelect(); this.modeS.option('Geburtstag'); this.modeS.option('Affirmation');
    createUIGroup("MODUS", this.modeS, "80px", "110px");

    this.inputD = createInput('15011987');
    createUIGroup("EINGABE", this.inputD, "75px", "140px");

    let codeGroup = createUIGroup("CODE", null, "auto", "auto");
    this.codeDisplay = createSpan("").parent(codeGroup).style('font-size', isMobile ? '11px' : '14px').style('color', '#fff').style('font-weight', '600');

    this.dirS = createSelect(); this.dirS.option('Außen', 'nach außen'); this.dirS.option('Innen', 'nach innen');
    createUIGroup("RICHTUNG", this.dirS, "65px", "100px");

    this.sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
        let sRow = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
        this.colorIndicators[i] = createDiv("").parent(sRow).style('width', '8px').style('height', '8px').style('border-radius', '50%');
        this.sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }
    this.updateLayout();
    [this.inputD, this.dirS, this.modeS].forEach(e => e.input ? e.input(() => redraw()) : e.changed(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('top', 'auto').style('bottom', '0').style('left', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)').style('padding', '8px 4px');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('bottom', 'auto').style('top', '90px').style('left', '0').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column').style('padding', '12px');
      for (let i = 1; i <= 9; i++) if(this.sliders[i]) this.sliders[i].style('width', '80px');
    }
  }

  render() {
    let isMobile = windowWidth < 600;
    let rawVal = this.inputD.value().trim();
    if (rawVal === "" || (this.modeS.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0)) return;

    let code = (this.modeS.value() === 'Affirmation') ? this.getCodeFromText(rawVal) : rawVal.replace(/\D/g, "").split('').map(Number);
    while (code.length < 8) code.push(0);
    code = code.slice(0, 8);
    if(this.codeDisplay) this.codeDisplay.html(code.join(""));
    
    let cKey = code[0] || 1;
    for (let i = 1; i <= 9; i++) { this.colorIndicators[i].style('background-color', this.colorMatrix[cKey][i - 1]); }

    push();
    translate(width/2, height/2 + (isMobile ? -40 : 20));
    scale((min(width, height) / 520) * (isMobile ? 0.45 : 0.48));
    this.renderWabeKorrekt(code, cKey);
    pop();
  }

  renderWabeKorrekt(code, cKey, target) {
    let ctx = target || window; let sz = 16.2; ctx.stroke(0, 35);
    let path = (this.dirS.value().includes('innen')) ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for (let s = 0; s < 6; s++) {
        ctx.push(); ctx.rotate(s * PI / 3);
        let m = Array(17).fill().map(() => Array(17).fill(0));
        for (let i = 0; i < 16; i++) m[16][i] = path[i % path.length];
        for (let r = 15; r >= 1; r--) for (let i = 0; i < r; i++) m[r][i] = this.ex(m[r+1][i], m[r+1][i+1]);
        for (let r = 1; r <= 16; r++) {
            for (let i = 0; i < r; i++) {
                let val = m[r][i];
                if (val >= 1 && val <= 9) {
                    let col = color(this.colorMatrix[cKey][val - 1]);
                    ctx.fill(hue(col), map(this.sliders[val].value(), 20, 100, 15, saturation(col)), map(this.sliders[val].value(), 20, 100, 98, brightness(col)));
                } else ctx.fill(255);
                let x = (i - (r - 1) / 2) * sz * sqrt(3), y = -(r - 1) * sz * 1.5;
                ctx.beginShape(); for (let a = PI / 6; a < TWO_PI; a += PI / 3) ctx.vertex(x + cos(a) * sz, y + sin(a) * sz); ctx.endShape(CLOSE);
            }
        }
        ctx.pop();
    }
  }

  getCodeFromText(textStr) {
    let cleanText = textStr.toUpperCase().replace(/[^A-ZÄÖÜß]/g, "");
    if (cleanText.length === 0) return [0,0,0,0,0,0,0,0];
    let currentRow = cleanText.split("").map(c => this.charMap[c]).filter(n => n);
    while(currentRow.length < 8) currentRow.push(9);
    while (currentRow.length > 8) {
        let nextRow = [];
        for (let i = 0; i < currentRow.length - 1; i++) nextRow.push(this.ex(currentRow[i], currentRow[i+1]));
        currentRow = nextRow;
    }
    return currentRow;
  }

  hide() { if(this.sliderPanel) this.sliderPanel.hide(); if(this.modeS) { this.modeS.hide(); this.inputD.hide(); this.dirS.hide(); this.codeDisplay.hide(); } }
  show() { if(this.sliderPanel) this.sliderPanel.show(); if(this.modeS) { this.modeS.show(); this.inputD.show(); this.dirS.show(); this.codeDisplay.show(); } }
}
