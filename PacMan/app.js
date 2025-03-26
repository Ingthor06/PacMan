// canvas er breyta sem geymir vísun á <canvas> í html skrá.
let canvas = document.getElementById('tutorial');
let ctx = canvas.getContext('2d');

const colorYellow = 'rgba(255, 206, 86, 1)';
const angle = Math.PI / 180;
let mouthOpen = true;

let pacmanState = {
    direction: "right",
    mouthOpen: true
}

function mouthAngles() {
    if (pacmanState.direction === "lookRight") {
        return {
            start: pacmanState.mouthOpen ? angle * 30 : angle * 5,
            end: pacmanState.mouthOpen ? angle * 330 : angle * 355
        };
    } 
    else if (pacmanState.direction === "lookLeft"){
        return {
            start: pacmanState.mouthOpen ? angle * 210 : angle * 185,
            end: pacmanState.mouthOpen ? angle * 150 : angle * 175
        };
    }
    else if (pacmanState.direction === "lookUp") {
        return {
            start: pacmanState.mouthOpen ? angle * 300 : angle * 275,
            end: pacmanState.mouthOpen ? angle * 240 : angle * 265            
        };
    }
    else {
        return {
            start: pacmanState.mouthOpen ? angle * 120 : angle * 100,
            end: pacmanState.mouthOpen ? angle * 55 : angle * 85            
        };
    }
}


const drawPacMan = {
    x: 100,
    y: 100,
    vx: 10,
    vy: 10,
    radius: 25,
    color: colorYellow,
 

    draw() {
        let { start, end } = mouthAngles();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, start, end, false);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};


function toggleMouth() {
    pacmanState.mouthOpen = !pacmanState.mouthOpen;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPacMan.draw();
    window.requestAnimationFrame(gameLoop);
}



document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        drawPacMan.y -= drawPacMan.vy
        pacmanState.direction = 'lookUp';
        break;
    case 'ArrowDown':
        drawPacMan.y += drawPacMan.vy
        pacmanState.direction = 'lookDown';
        break;
    case 'ArrowLeft':
        drawPacMan.x -= drawPacMan.vx
        pacmanState.direction = 'lookLeft';
        break;
    case 'ArrowRight':
        drawPacMan.x += drawPacMan.vx
        pacmanState.direction = 'lookRight';
        break;
    default:
        return;
    }
    gameLoop();
})


gameLoop();
setInterval(toggleMouth, 100)
