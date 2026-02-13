class MandalaQuadrat {
  constructor() {
    // Einheitliche Palette
    this.baseColors = ["#FF0000", "#0000FF", "#008000", "#FFFF00", "#00FFFF", "#FF00FF", "#FFA500", "#800080", "#000000"];
    this.colorSeed = 1;
    this.uiElements = [];
    this.sliders = [];
    this.colorIndicators = [];
  }

  init(container) {
    let isMobile = windowWidth < 600;
    const createUIGroup = (labelTxt, element) => {
      let group = createDiv("").parent(container).style('display', 'flex').style('flex-direction', 'column');
      createSpan(labelTxt).parent(group).style('font-size', '10px').style('color', '#bdc3c7').style('font-weight', 'bold');
      if (element) element.parent(group).style('background', '#34495e').style('color', '#fff').style('border', 'none').style('border-radius', '4px');
      this.uiElements.push(group);
      return group;
    };

    this.codeDisplay = createSpan("00000000");
    let cGroup = createUIGroup("CODE", null);
    this.codeDisplay.parent(cGroup).style('font-family', 'monospace').style('color', '#ecf0f1').style('margin-top', '5px');

    this.sliderPanel = createDiv("").style('position', 'fixed').style('background', 'rgba(44, 62, 80, 0.98)').style('z-index', '150');
    for (let i = 1; i <= 9; i++) {
      let sRow = createDiv("").parent(this.sliderPanel).style('display','flex').style('align-items','center').style('gap','8px');
      this.colorIndicators[i] = createDiv("").parent(sRow).style('width', '12px').style('height', '12px').style('border-radius', '50%');
      this.sliders[i] = createSlider(20, 100, 85).parent(sRow).input(() => redraw());
    }
    this.updateLayout();
  }

  updateLayout() {
    let isMobile = windowWidth < 600;
    this.sliderPanel.style('left', '0').style('padding', '12px');
    if (isMobile) {
      this.sliderPanel.style('top', 'auto').style('bottom', '0').style('width', '100%').style('display', 'grid').style('grid-template-columns', 'repeat(3, 1fr)');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '75px'); // Deine Vorgabe
    } else {
      this.sliderPanel.style('bottom', 'auto').style('top', '90px').style('width', 'auto').style('display', 'flex').style('flex-direction', 'column');
      for (let i = 1; i <= 9; i++) this.sliders[i].style('width', '100px');
    }
  }

  // ... (render und mathematische Logik bleiben gleich, nutzen aber this.baseColors)
}
