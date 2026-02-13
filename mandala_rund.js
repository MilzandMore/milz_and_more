class MandalaRund {
  constructor() {
    this.baseColors = ["#FF0000", "#00008B", "#00FF00", "#FFFF00", "#87CEEB", "#40E0D0", "#FFC0CB", "#FFA500", "#9400D3"];
    this.affirmMap = { A:1,J:1,S:1,Ä:1, B:2,K:2,T:2,Ö:2, C:3,L:3,U:3,Ü:3, D:4,M:4,V:4,ß:4, E:5,N:5,W:5, F:6,O:6,X:6, G:7,P:7,Y:7, H:8,Q:8,Z:8, I:9,R:9 };
    this.ex = (a,b) => (a + b) % 9 === 0 ? 9 : (a + b) % 9;
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

    this.modeSelect = createSelect(); ['Geburtstag','Affirmation'].forEach(o => this.modeSelect.option(o));
    createUI("MODUS", this.modeSelect, "80px", "110px");

    this.inputField = createInput("15011987");
    createUI("EINGABE", this.inputField, "75px", "140px");

    this.sektS = createSelect(); ["6","8","10","12"].forEach(s => this.sektS.option(s)); this.sektS.selected("8");
    createUI("SEKTOR", this.sektS, "40px", "60px");

    this.sliderPanel = createDiv("").style('position','fixed').style('background','rgba(44,62,80,0.98)').style('z-index','150');
    for (let i = 1; i <= 9; i++) {
      let r = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','4px');
      this.colorIndicators[i] = createDiv("").parent(r).style('width','8px').style('height','8px').style('border-radius', '50%');
      this.sliders[i] = createSlider(20,100,85).parent(r).input(() => redraw());
    }
    this.updateLayout();
    [this.modeSelect, this.inputField, this.sektS].forEach(el => el.input(() => redraw()));
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    if (isMobile) {
      this.sliderPanel.style('top','auto').style('bottom','0').style('left','0').style('width','100%').style('display','grid').style('grid-template-columns','repeat(3,1fr)').style('padding','8px');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '75px');
    } else {
      this.sliderPanel.style('bottom','auto').style('top', '90px').style('left','0').style('width','auto').style('display','flex').style('flex-direction','column').style('padding','12px');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '80px');
    }
  }

  render() {
    let raw = this.inputField.value().trim();
    if (!raw) return;
    let code = (this.modeSelect.value()==='Affirmation') ? this.getAffCode(raw) : raw.replace(/\D/g,"").split("").map(Number);
    while(code.length<8) code.push(0);
    let shift = (code[0]||1)-1;
    let colors = this.baseColors.slice(shift).concat(this.baseColors.slice(0, shift));
    for(let i=1;i<=9;i++) this.colorIndicators[i].style('background', colors[i-1]);

    push();
    translate(width/2, height/2 + (windowWidth<600?-40:20));
    scale((min(width,height)/900)*(windowWidth<600?0.85:0.95));
    let s = int(this.sektS.value());
    let m = this.buildM(code.slice(0,8));
    for(let i=0;i<s;i++){ push(); rotate(i*TWO_PI/s); this.drawS(m,colors); pop(); }
    pop();
  }

  // ORIGINAL RECHENLOGIK FÜR RUNDES MANDALA
  buildM(c) {
    let m = Array.from({length:16},(_,r)=>Array(r+1).fill(0));
    let base = [...c].reverse().concat(c);
    for(let i=0;i<16;i++){ 
       m[15][i]=base[i]; 
       m[15-i][0]=base[i]; 
       m[15-i][15-i]=base[i]; 
    }
    for(let r=14;r>=0;r--) {
      for(let i=1;i<r;i++) {
        m[r][i]=this.ex(m[r+1][i],m[r+1][i+1]);
      }
    }
    return m;
  }

  drawS(m, colors, target) {
    let ctx = target || window;
    let sCount = int(this.sektS.value());
    let step = 20; 
    let h = tan(TWO_PI/sCount/2)*step;
    ctx.stroke(0,35);
    for(let r=0;r<16;r++) {
      for(let c=0;c<=r;c++){
        let v = m[r][c];
        if(v>0){
          let b = color(colors[v-1]); 
          let sVal = this.sliders[v].value();
          ctx.fill(hue(b), map(sVal,20,100,15,saturation(b)), map(sVal,20,100,98,brightness(b)));
          
          ctx.beginShape(); 
          ctx.vertex(r*step,(c-r/2)*h*2); 
          ctx.vertex((r+1)*step,(c-(r+1)/2)*h*2+h); 
          ctx.vertex((r+2)*step,(c-r/2)*h*2); 
          ctx.vertex((r+1)*step,(c-r/2)*h*2+h); 
          ctx.endShape(CLOSE);
        }
      }
    }
  }

  getAffCode(t){
    let a = t.toUpperCase().replace(/[^A-ZÄÖÜß]/g,"").split("").map(c=>this.affirmMap[c]).filter(n=>n);
    while(a.length<8)a.push(9);
    while(a.length>8){let n=[];for(let i=0;i<a.length-1;i++)n.push(this.ex(a[i],a[i+1]));a=n;}
    return a;
  }

  exportHighRes(logo) {
    let pg = createGraphics(2480, 3508); pg.colorMode(HSB, 360, 100, 100); pg.background(255);
    pg.push(); pg.translate(1240, 1400); pg.scale(3.2);
    let raw = this.inputField.value();
    let code = (this.modeSelect.value()==='Affirmation')?this.getAffCode(raw):raw.replace(/\D/g,"").split("").map(Number);
    let shift=(code[0]||1)-1; let colors=this.baseColors.slice(shift).concat(this.baseColors.slice(0,shift));
    let s=int(this.sektS.value()); let m=this.buildM(code.slice(0,8));
    for(let i=0;i<s;i++){ pg.push(); pg.rotate(i*TWO_PI/s); this.drawS(m,colors,pg); pg.pop(); }
    pg.pop();
    if(logo) pg.image(logo, 2480-600, 3508-400, 500, 300);
    save(pg, "Mandala_Rund.png");
  }

  hide() { this.uiElements.forEach(e => e.hide()); this.sliderPanel.hide(); }
  show() { this.uiElements.forEach(e => e.show()); this.sliderPanel.show(); }
}
