const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
let food = {};
let score = 0;
let direction = "RIGHT";
let game;

function randomColor() {
    // Return random bright color
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Initialize snake
function initSnake() {
    snake = [];
    for (let i = 3; i >= 0; i--) {
        snake.push({ x: i * box, y: 0, color: randomColor() });
    }
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
        color: randomColor()
    };
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // Check collision with food
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        generateFood();
    } else {
        snake.pop(); // remove tail
    }

    // Add new head with random color
    let newHead = { x: headX, y: headY, color: randomColor() };

    // Game over conditions
    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert(`💀 Game Over! Your score: ${score}`);
        return;
    }

    snake.unshift(newHead);
}

// Check collision with self
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Change direction
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Start / Restart game
function startGame() {
    clearInterval(game);
    score = 0;
    document.getElementById("score").innerText = score;
    direction = "RIGHT";
    initSnake();
    generateFood();
    game = setInterval(draw, 100); // smooth speed
}
