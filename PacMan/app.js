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
    const colorGreen = 'rgba(0, 128, 0, 1)';
    const colorBlue = 'rgba(0, 0, 255, 1)';
    const angle = Math.PI / 180;
    let tileSize = 40;
    let isPaused = false;
    const fullScreenButton =document.getElementById('fullScreenButton');

    let pacmanState = {
        direction: "right",
        mouthOpen: true,
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
            case "lookDown":
                return { start: pacmanState.mouthOpen ? angle * 120 : angle * 100, end: pacmanState.mouthOpen ? angle * 55 : angle * 85 };
            case "lookUp":
                return { start: pacmanState.mouthOpen ? angle * 300 : angle * 275, end: pacmanState.mouthOpen ? angle * 240 : angle * 265 };
            default:
                return { start: pacmanState.mouthOpen ? angle * 210 : angle * 185, end: pacmanState.mouthOpen ? angle * 150 : angle * 175 };
        }
    }

    class PacMan {
        constructor(ctx, x, y, vx, vy, radius, color) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.defaultVx = vx; 
            this.defaultVy = vy;
            this.radius = radius;
            this.color = color;
            this.isColliding = false;
        }
        
        boostSpeed() {
            this.vx = 7;
            this.vy = 7;
            
            setTimeout(() => {
                this.vx = this.defaultVx;
                this.vy = this.defaultVy;
                }, 5000);
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
    
            let footRadius = this.radius / 5;
            let footCount = 3;
            let footWidth = (this.radius * 2) / footCount;
    
            for (let i = 0; i < footCount; i++) {
                let footX = this.x - this.radius + footWidth * i + footWidth / 2;
                this.ctx.arc(footX, this.y + this.radius, footRadius, 0, Math.PI, true);
            }
    
            this.ctx.lineTo(this.x - this.radius, this.y + this.radius);
            this.ctx.closePath();
    
            this.ctx.fillStyle = this.isColliding ? "white" : this.color;
            this.ctx.fill();
    

    
            this.drawEyes();
        }
    
        drawEyes() {
            let eyeRadius = this.radius / 4;
            let eyeOffsetX = this.radius / 3;
            let eyeOffsetY = this.radius / 3;
            let pupilRadius = eyeRadius / 2;

            this.ctx.fillStyle = "white";
            this.ctx.beginPath();
            this.ctx.arc(this.x - eyeOffsetX, this.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x + eyeOffsetX, this.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = "blue";
            this.ctx.beginPath();
            this.ctx.arc(this.x - eyeOffsetX - pupilRadius, this.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x + eyeOffsetX - pupilRadius, this.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }



        drawDying() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
            this.ctx.lineTo(this.x + this.radius, this.y + this.radius);
    
            let footRadius = this.radius / 5;
            let footCount = 3;
            let footWidth = (this.radius * 2) / footCount;
    
            for (let i = 0; i < footCount; i++) {
                let footX = this.x - this.radius + footWidth * i + footWidth / 2;
                this.ctx.arc(footX, this.y + this.radius, footRadius, 0, Math.PI, true);
            }
    
            this.ctx.lineTo(this.x - this.radius, this.y + this.radius);
            this.ctx.closePath();
    
            this.ctx.fillStyle = this.isColliding ? "white" : colorBlue;
            this.ctx.fill();
        }


        drawDyingEyes() {
            let eyeRadius = this.radius / 4;
            let eyeOffsetX = this.radius / 3;
            let eyeOffsetY = this.radius / 3;

            this.ctx.fillStyle = "white";
            this.ctx.beginPath();
            this.ctx.arc(this.x - eyeOffsetX, this.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x + eyeOffsetX, this.y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

    }
    

    let ghostPositionX = Math.floor(Math.random() * 600) + 50;
    let ghostPositionY = Math.floor(Math.random() * 600) + 50;

    const pacMan = new PacMan(ctx, 300, 380, 5, 5, 15, colorYellow);
    const ghosts = [
        new Ghost(ctx, 300, 220, 15, colorRed),
        new Ghost(ctx, 260, 300, 15, colorCyan),
        new Ghost(ctx, 300, 300, 15, colorPink),
        new Ghost(ctx, 340, 300, 15, colorOrange)
    ];

    function drawGhosts() {
        ghosts.forEach(ghost => ghost.draw());
    }



    class PacManGameMap {
        constructor(ctx, width, height, tileSize) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.tileSize = tileSize;
            this.map = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 1, 0, 1, 0, 1, 1, 3, 1, 1, 0, 1, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 0, 0],
                [1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                [1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 1],
                [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                
            ];
        }
    
        drawMap() {
            this.map.forEach((row, y) => {
                row.forEach((tile, x) => {
                    if (tile === 1) {
                        this.ctx.fillStyle = "blue"; 
                        this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                        this.ctx.fillStyle = "black"; 
                        this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize / 8, this.tileSize/ 8);
                        
                    } else if (tile === 0) {
                        this.ctx.fillStyle = "white"; 
                        this.ctx.beginPath();
                        this.ctx.arc(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, 3, 0, Math.PI * 2);
                        this.ctx.fill();
                    } else if (tile === 2) {
                        this.ctx.fillStyle = "white"; 
                        this.ctx.beginPath();
                        this.ctx.arc(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, 8, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.fillStyle = "gold"; 
                        this.ctx.beginPath();
                        this.ctx.arc(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, 6, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                });
            });
        }
    }
    let gameMap = new PacManGameMap(ctx, canvas.width, canvas.height, tileSize);
    
    



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
        for (let i = 0; i < 30; i++) {
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
        ctx.fillText("Score: " + score+0, 10, 10);
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
        let gameObjects = [...ghosts];
        objPacMan.isColliding = false;
        gameObjects.forEach(obj => obj.isColliding = false);

        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 2 && circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {
                    pacMan.boostSpeed();  
                    gameMap.map[y][x] = 0;  
                    
                }
            });
        });


        
        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 1 && circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {

                }
            });
        });

        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 0 && circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {
                    score++;
                    gameMap.map[y][x] = -1;   
                }
            });
        });


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

        
    }

    function circleIntersect(x1, y1, r1, x2, y2, r2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }


    function gameWinner() {
        let remainingDots = 0;
        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 0) {
                    remainingDots++;
                }
            });
        });
        if (remainingDots < 1) {
            ctx.font = '70px Arial';
            ctx.fillStyle = 'green';
            ctx.fillText("You Won!", 450, 250);
            ctx.font = '30px Arial';
            ctx.fillText("Your Score: " + score, 400, 350);
        }
    }

    function gameLoser() {
        if (lives < 1) {
            
            ctx.font = '70px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText("You Lost!", 450, 250);
            ctx.font = '30px Arial';
            ctx.fillText("Your Score: " + score, 400, 350);
            }
        
    }


    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameMap.drawMap();
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
