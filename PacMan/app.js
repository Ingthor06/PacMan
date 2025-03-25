// canvas er breyta sem geymir vísun á <canvas> í html skrá.
let canvas = document.getElementById('tutorial');
let ctx = canvas.getContext('2d');

const colorYellow = 'rgba(255, 206, 86, 1)';
const radius = 100;
const angle = Math.PI / 180;

ctx.beginPath();
ctx.strokeStyle = colorYellow;
ctx.fillStyle = colorYellow;
ctx.lineWidth = 3;

ctx.arc(350, 300, 100, angle * 30, angle * 330, false);
ctx.lineTo(350, 300);
ctx.closePath();

ctx.stroke();
ctx.fill();