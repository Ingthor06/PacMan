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
    const chompSound = new Audio('C:\\Users\\Notandi\\PacMan\\PacMan\\sounds\\pacman_chomp.wav');
    const deathSound = new Audio('C:\\Users\\Notandi\\PacMan\\PacMan\\sounds\\pacman_death.wav');
    const startSound = new Audio('C:\\Users\\Notandi\\PacMan\\PacMan\\sounds\\pacman_beginning.wav');
    const boostSound = new Audio('C:\\Users\\Notandi\\PacMan\\PacMan\\sounds\\pacman_intermission.wav')
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
            this.lastDirectionChange = Date.now();
            this.directions = [
                { x: 1, y: 0 },  
                { x: -1, y: 0 }, 
                { x: 0, y: 1 },  
                { x: 0, y: -1 }  
            ];
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
        constructor(ctx, x, y, radius, color, speed) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.speed = speed;
            this.lastDirectionChange = Date.now();
            this.directions = [
                { x: 1, y: 0 },  
                { x: -1, y: 0 }, 
                { x: 0, y: 1 },  
                { x: 0, y: -1 }  
            ];
            this.currentDirection = { x: 1, y: 0 };  
            

            
            this.movingHorizontally = Math.random() < 0.5;
            this.direction = Math.random() < 0.5 ? 1 : -1;
        }
        
    
        move(gameMap) {
            if (Date.now() - this.lastDirectionChange > 5000) {
                
                let newDir = this.directions[Math.floor(Math.random() * this.directions.length)];
                this.currentDirection = newDir;
                this.lastDirectionChange = Date.now();
            }
        
            let nextX = this.x + this.speed * this.currentDirection.x;
            let nextY = this.y + this.speed * this.currentDirection.y;
        
            let wallCheckX = nextX + this.radius * this.currentDirection.x;
            let wallCheckY = nextY + this.radius * this.currentDirection.y;
        
            
            if (!gameMap.isWallTile(wallCheckX, wallCheckY)) {
                this.x = nextX;
                this.y = nextY;
            } else {
                 
                let possibleDirs = this.directions.filter(d => {
                    let testX = this.x + d.x * this.radius;
                    let testY = this.y + d.y * this.radius;
                    return !gameMap.isWallTile(testX, testY);
                });
        
                if (possibleDirs.length > 0) {
                    this.currentDirection = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                }
                this.lastDirectionChange = Date.now();
            }
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
            this.ctx.fillStyle = this.color;
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
            if (!this.isDying) return; 
        
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
        
            this.ctx.fillStyle = "blue";
            this.ctx.fill();
        
            let mouthWidth = this.radius;
            let mouthHeight = this.radius / 3;
            let mouthX = this.x - mouthWidth / 2;
            let mouthY = this.y + this.radius / 4;
            let step = mouthWidth / 4;
        
            this.ctx.beginPath();
            this.ctx.moveTo(mouthX, mouthY);
            for (let i = 1; i <= 4; i++) {
                let x = mouthX + i * step;
                let y = (i % 2 === 0) ? mouthY : mouthY + mouthHeight;
                this.ctx.lineTo(x, y);
            }
        
            this.ctx.strokeStyle = "white";  
            this.ctx.lineWidth = 2;  
            this.ctx.stroke();
        
            this.drawDyingEyes();
        }
        
        
        onCollisionWithTile2() {
            if (!this.isDying) {
                this.isDying = true;
                this.isColliding = true;
    
                setTimeout(() => {
                    this.isDying = false;
                    this.isColliding = false;
                }, 5000);
            }
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

    const ghosts = [
        new Ghost(ctx, 300, 220, 18, colorRed, 0.8),
        new Ghost(ctx, 260, 300, 18, colorCyan, 0.8),
        new Ghost(ctx, 300, 300, 18, colorPink, 0.8),
        new Ghost(ctx, 340, 300, 18, colorOrange, 0.8)
    ];
    

    let ghostPositionX = Math.floor(Math.random() * 600) + 50;
    let ghostPositionY = Math.floor(Math.random() * 600) + 50;

    const pacMan = new PacMan(ctx, 300, 380, 5, 5, 18, colorYellow);

    function drawGhosts() {
        ghosts.forEach(ghost => ghost.draw());
    }

    function drawDyingGhosts() {
        ghosts.forEach(ghost => ghost.onCollisionWithTile2());
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
                [1, 1, 0, 1, 0, 1, 0, 3, 0, 1, 0, 1, 0, 1, 1],
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
        
        isWallTile(x, y) {
            let col = Math.floor(x / this.tileSize);
            let row = Math.floor(y / this.tileSize);
        
            if (
                row < 0 || row >= this.map.length ||
                col < 0 || col >= this.map[0].length
            ) {
                return true; 
            }
        
            return this.map[row][col] === 1;
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
        let objGhost = ghosts;
        let gameObjects = [...ghosts];
        objPacMan.isColliding = false;
        gameObjects.forEach(obj => obj.isColliding = false);
    
        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 2 && circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {
                    boostSound.play();
                    drawDyingGhosts();
                     
                    gameMap.map[y][x] = 0;  
                }
            });
        });
    

        

        
        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 1 && circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {
                    // PacMan collides with the wall, stop movement
                    objPacMan.vx = 0;
                    objPacMan.vy = 0;
                    objPacMan.isStopped = true; // Mark as stopped
                }
            });
        });
        

        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 0 && circleIntersect(objPacMan.x, objPacMan.y, objPacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {
                    chompSound.play();
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
                    deathSound.play();
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
            ctx.fillText("Your Score: " + score+0, 400, 350);
        }
    }

    function gameLoser() {
        if (lives < 1) {
            
            ctx.font = '70px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText("You Lost!", 450, 250);
            ctx.font = '30px Arial';
            ctx.fillText("Your Score: " + score+0, 400, 350);
            }
        
    }

   
    let isMovingUp = false;
    let isMovingDown = false;
    let isMovingLeft = false;
    let isMovingRight = false;

    pacMan.vx = 1;  // Speed in x direction
    pacMan.vy = 1;  // Speed in y direction

    // Collision detection logic (same as before) 
    function checkCollision() {
        gameMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (tile === 1 && circleIntersect(pacMan.x, pacMan.y, pacMan.radius, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 6)) {
                    // PacMan is about to collide with a wall, so we stop its movement
                    // Reset velocity if moving into a wall
                    if (isMovingUp) pacMan.vy = 0;
                    if (isMovingDown) pacMan.vy = 0;
                    if (isMovingLeft) pacMan.vx = 0;
                    if (isMovingRight) pacMan.vx = 0;
                }
            });
        });
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                isMovingUp = true;
                isMovingDown = false;
                isMovingLeft = false;
                isMovingRight = false;
                pacmanState.direction = 'lookUp';
                break;
            case 'ArrowDown':
                isMovingUp = false;
                isMovingDown = true;
                isMovingLeft = false;
                isMovingRight = false;
                pacmanState.direction = 'lookDown';
                break;
            case 'ArrowLeft':
                isMovingUp = false;
                isMovingDown = false;
                isMovingLeft = true;
                isMovingRight = false;
                pacmanState.direction = 'lookLeft';
                break;
            case 'ArrowRight':
                isMovingUp = false;
                isMovingDown = false;
                isMovingLeft = false;
                isMovingRight = true;
                pacmanState.direction = 'lookRight';
                break;
        }
    });

    function movePacMan() {
        if (isMovingUp) pacMan.y -= pacMan.vy;
        if (isMovingDown) pacMan.y += pacMan.vy;
        if (isMovingLeft) pacMan.x -= pacMan.vx;
        if (isMovingRight) pacMan.x += pacMan.vx;
    }

    function update() {
        checkCollision(); // Check for collisions on every frame

        // If not stopped due to collision, update movement
        if (pacMan.vx !== 0 || pacMan.vy !== 0) {
            movePacMan(); // Move PacMan if not stopped
        }

        // Continue updating the game and drawing PacMan, etc.
    }

    // Assuming a game loop or animation frame calls the `update()` function continuously.
    setInterval(update, 1000 / 60); // 60 frames per second (you can adjust this)

    
    

    function gameLoop() {
        if (!isPaused) {
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            gameMap.drawMap();
            pacMan.draw();
            movePacMan()
            drawScore();
            drawLives();
            detectCollisions();
            
            ghosts.forEach(ghost => {
                ghost.move(gameMap, tileSize);
                ghost.draw(ghost);
            });
            ghosts.forEach(ghost => ghost.drawDying());
            gameWinner();
            gameLoser();
            requestAnimationFrame(gameLoop);
        }
    }




    gameLoop();
    setInterval(toggleMouth, 100);
}
