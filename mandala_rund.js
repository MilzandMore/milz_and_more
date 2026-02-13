render() {
    let isMobile = windowWidth < 600;
    let rawVal = this.inputField.value().trim();
    if (rawVal === "" || (this.modeSelect.value() === 'Geburtstag' && rawVal.replace(/\D/g, "").length === 0)) return;

    // Hintergrund wird hier nur gezeichnet, wenn nicht im Export-Modus
    background(255);
    
    let sector = this.buildSector();
    let currentColors = this.getColorMatrix(this.colorSeed);
    
    for (let i = 1; i <= 9; i++) { 
      if(this.colorIndicators[i]) this.colorIndicators[i].style('background-color', currentColors[i-1]); 
    }

    push();
    // Desktop vs Mobile Zentrierung vereinheitlicht
    let centerY = isMobile ? height / 2 - 40 : height / 2 + 20;
    let centerX = width / 2; 
    translate(centerX, centerY);
    
    // Wir nutzen hier den exakten Faktor aus deiner funktionierenden mobilen Ansicht
    let scaleFactor = (min(width, height) / 900) * (isMobile ? 0.85 : 0.95);
    scale(scaleFactor);
    
    let sc = int(this.sektS.value());
    let angle = TWO_PI / sc;
    for (let i = 0; i < sc; i++) {
      push(); 
      rotate(i * angle); 
      this.drawSector(sector, currentColors); 
      pop();
    }
    pop();
  }
