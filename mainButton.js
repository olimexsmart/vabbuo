function drawButton() {
    r = 100;
    ri = 70; 
    canvas = O('mainButton');
    context = canvas.getContext('2d');
    context.fillStyle = 'DarkGreen';
    canvas.addEventListener('click', function() {window.location.href = '/main.php'; }, false);

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

