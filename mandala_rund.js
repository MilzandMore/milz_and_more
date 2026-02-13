drawSector(m, colors, target) {
    let ctx = target || window;
    let step = 20;
    let sc = int(this.sektS.value());
    
    // Sicherstellen, dass wir mit Radiant rechnen für den Tangens
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
        } else {
          ctx.fill(255);
        }
        
        // DAS SIND DIE RAUTEN: Vier Punkte, die exakt schließen
        ctx.beginShape(); 
        ctx.vertex(x, y); 
        ctx.vertex(x + step, y - h); 
        ctx.vertex(x + step * 2, y); 
        ctx.vertex(x + step, y + h); 
        ctx.endShape(CLOSE);
      }
    }
  }
