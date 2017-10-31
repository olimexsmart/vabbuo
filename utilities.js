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

function drawButton(canvas, r, ri) {
  // r = 100;
  // ri = 70;     
  context = canvas.getContext('2d');
  context.fillStyle = 'DarkGreen';
  canvas.addEventListener('click', function () { window.location.href = '/main.php'; }, false);

  // This part could be done also using the with(context) statement
  context.beginPath();
  context.moveTo(r, r);
  context.arc(r, r, r, 0, Math.PI * 2, false);
  context.fill();
  context.beginPath();
  context.arc(r, r, ri, 0, Math.PI * 2, false);
  context.fillStyle = 'green';
  context.fill();
  context.closePath();
}

function rainbow(o, sat, light) {
  S(o).backgroundColor = "hsl(" + color + "," + sat + "%," + light + "%)";
  color++;
  color %= 360;
}

// The timestamp parameter is passed automatically, holds the time passed from the loading of the page
// in milliseconds and decimals
function animate(timestamp) {

  if (timestamp > lastColorUpdate + 400) {
    rainbow(document.body, 55, 30); // Background color updating
    lastColorUpdate = timestamp;
  }

  fSM.drawAll(); // Sentence updating

  requestAnimationFrame(animate) // call requestAnimationFrame again to animate next frame  
}