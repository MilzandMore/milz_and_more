function addStyles() {
  createElement('style', `
    body { background-color: #f8f9fa; margin: 0; overflow: hidden; }
    
    #ui-sidebar { 
      position: fixed; top: 20px; right: 20px; width: 300px; 
      background: rgba(255, 255, 255, 0.85); 
      backdrop-filter: blur(10px); /* Glas-Effekt */
      padding: 25px; border-radius: 20px; 
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); 
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      border: 1px solid rgba(255, 255, 255, 0.3);
      z-index: 1000;
    }

    label { 
      font-size: 11px; font-weight: 700; color: #495057; 
      display: block; margin-bottom: 6px; letter-spacing: 0.5px; 
    }

    .ui-select, .ui-input { 
      width: 100%; padding: 10px; margin-bottom: 18px; 
      border: 1px solid #dee2e6; border-radius: 10px; 
      background: white; font-size: 14px; color: #212529;
      transition: border-color 0.2s;
    }

    .ui-select:focus, .ui-input:focus { 
      outline: none; border-color: #007bff; 
    }

    .slider-grid { 
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px; 
      padding: 10px; background: rgba(0,0,0,0.03); border-radius: 12px;
    }

    .slider-row { display: flex; align-items: center; justify-content: space-between; }
    
    .color-dot { 
      width: 14px; height: 14px; border-radius: 4px; 
      margin-right: 8px; box-shadow: inset 0 0 2px rgba(0,0,0,0.2); 
    }

    .mandala-slider { 
      width: 75px; height: 4px; cursor: pointer;
    }

    .ui-btn { 
      width: 100%; padding: 14px; margin-top: 20px;
      background: linear-gradient(135deg, #2c3e50, #000000); 
      color: white; border: none; border-radius: 12px; 
      font-weight: 600; letter-spacing: 1px; cursor: pointer;
      transition: transform 0.1s, box-shadow 0.2s;
    }

    .ui-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
    .ui-btn:active { transform: translateY(0); }

    @media (max-width: 600px) {
      #ui-sidebar { 
        width: auto; left: 15px; right: 15px; top: auto; bottom: 20px; 
        max-height: 40vh; overflow-y: auto; 
      }
    }
  `);
}
