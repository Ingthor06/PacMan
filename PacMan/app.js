// canvas er breyta sem geymir vísun á <canvas> í html skrá.
let canvas = document.getElementById('tutorial');
let ctx = canvas.getContext('2d');

const colorYellow = 'rgba(255, 206, 86, 1)';
const radius = 100;
const angle = Math.PI / 180;
let mouthOpen = true;

function drawPacMan() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = colorYellow;
    ctx.fillStyle = colorYellow;
    ctx.lineWidth = 3;

    let startAngle = mouthOpen ? angle * 30 : angle * 5;
    let endAngle = mouthOpen ? angle * 330 : angle * 355;

    ctx.arc(350, 300, radius, startAngle, endAngle, false);
    ctx.lineTo(350, 300);
    ctx.closePath();

    ctx.stroke();
    ctx.fill();
    
    mouthOpen = !mouthOpen;
}

setInterval(drawPacMan, 350)
drawPacMan()