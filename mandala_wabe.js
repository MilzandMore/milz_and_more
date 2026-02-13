class MandalaWabe {
  constructor() {
    this.colorMatrix = { 1: ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"], 2: ["#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000"], 3: ["#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B"], 4: ["#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00"], 5: ["#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00"], 6: ["#40E0D0", "#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB"], 7: ["#FFC0CB", "#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0"], 8: ["#FFA500", "#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB"], 9: ["#9400D3", "#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500"] };
    this.charMap = { 'A':1,'J':1,'S':1,'Ä':1,'B':2,'K':2,'T':2,'Ö':2,'C':3,'L':3,'U':3,'Ü':3,'D':4,'M':4,'V':4,'ß':4,'E':5,'N':5,'W':5,'F':6,'O':6,'X':6,'G':7,'P':7,'Y':7,'H':8,'Q':8,'Z':8,'I':9,'R':9 };
    this.ex = (a, b) => (a + b === 0) ? 0 : ((a + b) % 9 === 0 ? 9 : (a + b) % 9);
    this.uiElements = []; this.sliders = []; this.colorIndicators = [];
  }

  init(container) {
    let isMobile = windowWidth < 600;
    const createUI = (lbl, el, wM, wD) => {
      let g = createDiv("").parent(container).style('display','flex').style('flex-direction','column');
      createSpan(lbl).parent(g).style('font-size','10px').style('color','#bdc3c7').style('font-weight','bold');
      el.parent(g).style('width', isMobile ? wM : wD).style('background','#34495e').style('color','#fff').style('border','none').style('border-radius','4px').style('height', isMobile ? '22px' : '32px');
      this.uiElements.push(g);
    };

    this.modeS = createSelect(); ['Geburtstag','Affirmation'].forEach(o => this.modeS.option(o));
    createUI("MODUS", this.modeS, "80px", "110px");

    this.inputD = createInput('15011987');
    createUI("EINGABE", this.inputD, "75px", "140px");

    this.dirS = createSelect(); this.dirS.option('Außen'); this.dirS.option('Innen');
    createUI("RICHTUNG", this.dirS, "65px", "100px");

    this.sliderPanel = createDiv("").style('position','fixed').style('background','rgba(44,62,80,0.98)').style('z-index','150');
    for (let i = 1; i <= 9; i++) {
      let r = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
      this.colorIndicators[i] = createDiv("").parent(r).style('width','8px').style('height','8px').style('border-radius','50%');
      this.sliders[i] = createSlider(20, 100, 85).parent(r).input(() => redraw());
    }
    this.updateLayout();
    [this.inputD, this.dirS, this.modeS].forEach(el => el.input(() => redraw()));
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
    let raw = this.inputD.value().trim();
    if (!raw) return;
    let code = (this.modeS.value()==='Affirmation') ? this.getAffCode(raw) : raw.replace(/\D/g,"").split('').map(Number);
    while(code.length<8) code.push(0);
    code = code.slice(0,8);
    let cKey = code[0] || 1;
    for(let i=1;i<=9;i++) this.colorIndicators[i].style('background', this.colorMatrix[cKey][i-1]);

    push();
    translate(width/2, height/2 + (windowWidth<600?-40:20));
    scale((min(width, height)/520)*(windowWidth<600?0.45:0.48));
    this.drawW(code, cKey);
    pop();
  }

  drawW(code, cKey, target) {
    let ctx = target || window; let sz = 16.2; ctx.stroke(0, 35);
    let p = (this.dirS.value()==='Innen') ? [...code, ...[...code].reverse()] : [...[...code].reverse(), ...code];
    for(let s=0; s<6; s++){
      ctx.push(); ctx.rotate(s * PI/3);
      let m = Array(17).fill().map(()=>Array(17).fill(0));
      for(let i=0; i<16; i++) m[16][i] = p[i%p.length];
      for(let r=15; r>=1; r--) for(let i=0; i<r; i++) m[r][i] = this.ex(m[r+1][i], m[r+1][i+1]);
      for(let r=1; r<=16; r++) for(let i=0; i<r; i++){
        let v = m[r][i];
        if(v>0){
          let b = color(this.colorMatrix[cKey][v-1]);
          ctx.fill(hue(b), map(this.sliders[v].value(),20,100,15,saturation(b)), map(this.sliders[v].value(),20,100,98,brightness(b)));
        } else ctx.fill(255);
        let x = (i-(r-1)/2)*sz*sqrt(3), y = -(r-1)*sz*1.5;
        ctx.beginShape(); for(let a=PI/6; a<TWO_PI; a+=PI/3) ctx.vertex(x+cos(a)*sz, y+sin(a)*sz); ctx.endShape(CLOSE);
      }
      ctx.pop();
    }
  }

  getAffCode(t) {
    let a = t.toUpperCase().replace(/[^A-ZÄÖÜß]/g,"").split("").map(c=>this.charMap[c]).filter(n=>n);
    while(a.length<8) a.push(9);
    while(a.length>8){let n=[]; for(let i=0;i<a.length-1;i++) n.push(this.ex(a[i],a[i+1])); a=n;}
    return a;
  }

  exportHighRes(logo) {
    let pg = createGraphics(2480, 3508); pg.colorMode(HSB, 360, 100, 100); pg.background(255);
    pg.push(); pg.translate(1240, 1400); pg.scale(2.4);
    let code = (this.modeS.value()==='Affirmation')?this.getAffCode(this.inputD.value()):this.inputD.value().replace(/\D/g,"").split('').map(Number);
    this.drawW(code, code[0]||1, pg);
    pg.pop();
    if(logo) pg.image(logo, 2480-600, 3508-400, 500, 300);
    save(pg, "Mandala_Wabe.png");
  }

  hide() { this.uiElements.forEach(e => e.hide()); this.sliderPanel.hide(); }
  show() { this.uiElements.forEach(e => e.show()); this.sliderPanel.show(); }
}
