// Completely useless stuff from initial page
function timeUpdate(object) {
  var date = new Date();
  object.innerHTML = date.toTimeString().substr(0, 8) + "   " + formatDate(date);
}
function formatDate(date) {
  var monthNames = [
    "Gennaio", "Febbraio", "Marzo",
    "Aprile", "Maggio", "Giugno", "Luglio",
    "Agosto", "Settembre", "Ottobre",
    "Novembre", "Dicembre"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}


// Useful stuff
function updateCanvasDimensions(canvas) {
  canvas.attr({ height: $(window).height(), width: $(window).width() });
}

function drawButton(canvas, height, width) {
  r = 100;
  ri = 70;
  context = canvas.getContext('2d');
  context.fillStyle = 'DarkGreen';
  canvas.addEventListener('click', function () { window.location.href = '/main.php'; }, false);

  // This part could be done also using the with(context) statement
  context.beginPath();
  context.moveTo(width / 2, height / 2);
  context.arc(width / 2, height / 2, r, 0, Math.PI * 2, false);
  context.fill();
  context.beginPath();
  context.arc(width / 2, height / 2, ri, 0, Math.PI * 2, false);
  context.fillStyle = "hsl(" + color + ",55%,30%)";
  context.fill();
  context.closePath();
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