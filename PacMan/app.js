let canvas = document.getElementById('tutorial');
if (!canvas) {
    console.error("Canvas element not found!");
} else {
    let ctx = canvas.getContext('2d');

    const colorYellow = 'rgba(255, 255, 86, 1)';
    const colorWhite = 'rgba(255, 255, 255, 1)';
    const colorRed = 'rgba(255, 80, 0, 1)';
    const colorPink = 'rgba(239, 207, 227, 1)';
    const colorCyan = 'rgba(20, 205, 200, 1)';
    const colorOrange = 'rgba(242, 121, 53, 1)';
    const angle = Math.PI / 180;
    let isPaused = false;
    const fullScreenButton =document.getElementById('fullScreenButton');

    let pacmanState = {
        direction: "right",
        mouthOpen: true
    };


    function freezeGame() {
        isPaused = true;
        setTimeout(() => {
        isPaused = false;
        gameLoop();
    }, duration);
    }


    function mouthAngles() {
        switch (pacmanState.direction) {
            case "lookRight":
                return { start: pacmanState.mouthOpen ? angle * 30 : angle * 5, end: pacmanState.mouthOpen ? angle * 330 : angle * 355 };
            case "lookLeft":
                return { start: pacmanState.mouthOpen ? angle * 210 : angle * 185, end: pacmanState.mouthOpen ? angle * 150 : angle * 175 };
            case "lookUp":
                return { start: pacmanState.mouthOpen ? angle * 300 : angle * 275, end: pacmanState.mouthOpen ? angle * 240 : angle * 265 };
            default:
                return { start: pacmanState.mouthOpen ? angle * 120 : angle * 100, end: pacmanState.mouthOpen ? angle * 55 : angle * 85 };
        }
    }

    class PacMan {
        constructor(ctx, x, y, vx, vy, radius, color) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.radius = radius;
            this.color = color;
            this.isColliding = false;
        }

        draw() {
            let { start, end } = mouthAngles();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, start, end, false);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.closePath();
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    class Ghost {
        constructor(ctx, x, y, radius, color) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.isColliding = false;
        }

        draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);

            this.ctx.lineTo(this.x + this.radius, this.y + this.radius);
            this.ctx.lineTo(this.x - this.radius, this.y + this.radius);

            this.ctx.closePath();
            
            
            let footRadius = this.radius / 2;
            let offsetY = footRadius / 2;
            let offsetX = footRadius / 2
            for (let i = -1; i <= 1; i++) {
                this.ctx.arc(this.x + i / 2* footRadius * 2, this.y + this.radius -offsetY, footRadius,Math.PI * 2 ,Math.PI, false);
            }

        
            this.ctx.closePath();
            this.ctx.fillStyle = this.isColliding ? "white" : this.color;
            this.ctx.fill();

            this.drawEyes();
        }

        drawBody() {
            this.ctx.beginPath();
            this.ctx.fillRect(this.x, this.y, this.radius, this.radius);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

        }

        
        drawEyes() {
            let eyeRadius = this.radius / 4;
            let eyeOffsetX = this.radius / 3;
            let eyeOffsetY = this.radius / 3;
            let pupilRadius = eyeRadius / 2;

            // Left Eye
            this.ctx.fillStyle = "white";
            this.ctx.beginPath();
            this.ctx.arc(this.x - eyeOffsetX, this.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Right Eye
            this.ctx.beginPath();
            this.ctx.arc(this.x + eyeOffsetX, this.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Left Pupil
            this.ctx.fillStyle = "black";
            this.ctx.beginPath();
            this.ctx.arc(this.x - eyeOffsetX - pupilRadius, this.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Right Pupil
            this.ctx.beginPath();
            this.ctx.arc(this.x + eyeOffsetX - pupilRadius, this.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

    }

    let ghostPositionX = Math.floor(Math.random() * 600) + 50;
    let ghostPositionY = Math.floor(Math.random() * 600) + 50;

    const pacMan = new PacMan(ctx, 100, 100, 5, 5, 15, colorYellow);
    const ghosts = [
        new Ghost(ctx, 200, 300, 15, colorRed),
        new Ghost(ctx, 300, 400, 15, colorCyan),
        new Ghost(ctx, 400, 200, 15, colorPink),
        new Ghost(ctx, 500, 300, 15, colorOrange)
    ];

    function drawGhosts() {
        ghosts.forEach(ghost => ghost.draw());
    }

    const drawDots = {
        radius: 3,
        color: colorWhite,
        draw(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };

    let dotsArr = [];
    function generateDots() {
        for (let i = 0; i < 50; i++) {
            let x = Math.floor(Math.random() * 600) + 50;
            let y = Math.floor(Math.random() * 600) + 50;
            dotsArr.push({ x, y });
        }
    }

    function drawAllDots() {
        dotsArr.forEach(dot => drawDots.draw(dot.x, dot.y));
    }


    let lives = 3;
    function drawLives() {
        ctx.font = "20px Arial";
        ctx.fillStyle = colorWhite;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("❤️" + lives, 590, 10);
    }


    let score = 0;
    function drawScore() {
        ctx.font = "20px Arial";
        ctx.fillStyle = colorWhite;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score: " + score, 10, 10);
    }

    function toggleMouth() {
        pacmanState.mouthOpen = !pacmanState.mouthOpen;
    }


    function toggleFullScreen() {
        console.log(document.fullscreenElement);
        
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert('Error entering fullscreen: ' + err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    fullScreenButton.addEventListener('click', toggleFullScreen);
    

    function detectCollisions() {
        let objPacMan = pacMan;
        let gameObjects = [...dotsArr, ...ghosts];
        objPacMan.isColliding = false;
        gameObjects.forEach(obj => obj.isColliding = false);

        gameObjects.forEach(obj => {
            if (circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, obj.x, obj.y, obj.radius || 3)) {
                objPacMan.isColliding = true;
                obj.isColliding = true;
            }
        });

        ghosts.forEach(ghost => {
            if (circleIntersect(pacMan.x, pacMan.y, pacMan.radius, ghost.x, ghost.y, ghost.radius)) {
                if (!ghost.hasGhostLife) {
                    lives--;
                    ghost.hasGhostLife = true;
                }
            }else {
                ghost.hasGhostLife = false;
            }
        });

        dotsArr = dotsArr.filter(dot => {
            if (circleIntersect(pacMan.x, pacMan.y, pacMan.radius, dot.x, dot.y, 3)) {
                score++; 
                return false; 
            }
            return true; 
        });
        
    }

    function circleIntersect(x1, y1, r1, x2, y2, r2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }


    function gameWinner() {
        if (dotsArr.length === 0) {
            ctx.font = '50px Arial';
            ctx.fillStyle = 'green';
            ctx.fillText("You Won!", 400, 250);
            ctx.font = '30px Arial';
            ctx.fillText("Your Score: " + score, 400, 300);
        }
    }

    function gameLoser() {
        if (lives < 1) {
            
            ctx.font = '50px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText("You Lost!", 400, 250);
            ctx.font = '30px Arial';
            ctx.fillText("Your Score: " + score, 400, 300);
            freezeGame(1000);
            }
    }


    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAllDots();
        drawGhosts();
        pacMan.draw();
        drawScore();
        drawLives();
        detectCollisions();
        gameWinner();
        gameLoser();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                pacMan.y -= pacMan.vy;
                pacmanState.direction = 'lookUp';
                break;
            case 'ArrowDown':
                pacMan.y += pacMan.vy;
                pacmanState.direction = 'lookDown';
                break;
            case 'ArrowLeft':
                pacMan.x -= pacMan.vx;
                pacmanState.direction = 'lookLeft';
                break;
            case 'ArrowRight':
                pacMan.x += pacMan.vx;
                pacmanState.direction = 'lookRight';
                break;
        }
    });

    generateDots();
    gameLoop();
    setInterval(toggleMouth, 100);
}
