// Useful stuff
function updateCanvasDimensions(canvas) {  // Strecth canvas to window
  canvas.attr({ height: $(window).height(), width: $(window).width() });
}

function rainbow() {
  S(document.body).backgroundColor = "hsl(" + color + ", 55%, 30%)";
  color++;
  color %= 360;
}

function svgButton () {
  S('inner').fill = "hsl(" + colorInner + ", 55%, 50%)";
  S('outer').fill = "hsl(" + colorOuter + ", 55%, 20%)";
  colorInner++;
  colorInner %= 360;
  colorOuter--;
  colorOuter %= 360;
}

function buttonDimensions (height) {
  radius = Math.floor(height / 14); // Bomber Lino
  S('svgButton').height = radius * 2;
  S('svgButton').width = radius * 2;
  
  S('inner').cx = radius;
  S('inner').cy = radius;
  S('inner').r = radius - radius * 0.25;
  
  S('outer').cx = radius;
  S('outer').cy = radius;
  S('outer').r = radius;

}
// The timestamp parameter is passed automatically, holds the time passed from the loading of the page
// in milliseconds and decimals
function animate(timestamp) {

  fSM.drawAll(); // Sentence updating

  if (timestamp > lastColorUpdate + 400) {
    rainbow(); // Background color updating    
    svgButton();
    //drawButton(O('c'), fSM.canvasHeight, fSM.canvasWidth); // Draw button as last thing    
    lastColorUpdate = timestamp;
  }

  requestAnimationFrame(animate) // call requestAnimationFrame again to animate next frame  
}