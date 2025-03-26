let canvas = document.getElementById('tutorial');
let ctx = canvas.getContext('2d');

const colorYellow = 'rgba(255, 255, 86, 1)';
const colorWhite = 'rgba(255, 255, 255, 255)';
const colorRed = 'rgba(255, 80, 0)';
const colorPink = 'rgba(239, 207, 227)';
const colorCyan = 'rgba(20, 205, 200)';
const colorOrange = 'rgba(242, 121, 53)';
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
    } else if (pacmanState.direction === "lookLeft"){
        return {
            start: pacmanState.mouthOpen ? angle * 210 : angle * 185,
            end: pacmanState.mouthOpen ? angle * 150 : angle * 175
        };
    }else if (pacmanState.direction === "lookUp") {
        return {
            start: pacmanState.mouthOpen ? angle * 300 : angle * 275,
            end: pacmanState.mouthOpen ? angle * 240 : angle * 265            
        };
    }else {
        return {
            start: pacmanState.mouthOpen ? angle * 120 : angle * 100,
            end: pacmanState.mouthOpen ? angle * 55 : angle * 85            
        };
    }
}


const drawPacMan = {
    x: 100,
    y: 100,
    vx: 5,
    vy: 5,
    radius: 17,
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


const drawGhosts = [
    {
    name: 'RedGhost',
    speed: 10,
    x: 200,
    y: 300,
    vx: 5,
    vy: 5,
    radius: 17,
    color: colorRed
    },
    {
    name: 'BlueGhost',
    speed: 10,
    x: 300,
    y: 400,
    vx: 5,
    vy: 5,
    radius: 17,
    color: colorCyan
    },
    {
    name: 'PinkGhost',
    speed: 10,
    x: 400,
    y: 200,
    vx: 5,
    vy: 5,
    radius: 17,
    color: colorPink
    },
    {
    name: 'OrangeGhost',
    speed: 10,
    x: 500,
    y: 300,
    vx: 5,
    vy: 5,
    radius: 17,
    color: colorOrange
    }
];

const drawAllGhosts = {
    ghosts() {
        drawGhosts.forEach(ghost => {
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
            ctx.fillStyle = ghost.color;
            ctx.fill();
            ctx.closePath();
        });
    }
};


const drawDots = {
    radius: 3,
    color: colorWhite,
    draw(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};


let dotsArr = [];

function dots() {
    for (let i = 0; i < 50; i++) {
        let x = Math.floor(Math.random() * 600) + 50;
        let y = Math.floor(Math.random() * 600) + 50;
        dotsArr.push({x, y});
    };
    return dotsArr;
}


function drawAllDots() {
    dotsArr.forEach(dot => {
        drawDots.draw(dot.x, dot.y);
    });
}


const drawPowerUps = {
    size: 10,
    color: colorWhite,
    draw(x, y) {
        ctx.beginPath();
        ctx.fillRect(x, y, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};

let powerUpsArr = [];

function powerUps() {
    for (let i = 0; i < 4; i++) {
        let x = Math.floor(Math.random() * 600) + 50;
        let y = Math.floor(Math.random() * 600) + 50;
        powerUpsArr.push({x, y});
    };
    return powerUpsArr;
}

function drawAllPowerUps() {
    powerUpsArr.forEach(powerUp => {
        drawPowerUps.draw(powerUp.x, powerUp.y);
    });
}


function toggleMouth() {
    pacmanState.mouthOpen = !pacmanState.mouthOpen;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllDots();
    drawAllPowerUps();
    drawAllGhosts.ghosts();
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

dots();
powerUps();

gameLoop();
setInterval(toggleMouth, 100)
