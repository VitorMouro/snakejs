var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

window.addEventListener("resize", handleWindowResize);
window.addEventListener("load", handleWindowResize);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleWindowResize() {
    if (window.innerHeight > window.innerWidth) {
        // The screen is vertical
        if (gridSize.x > gridSize.y) {
            canvas.width = window.innerWidth;
            canvas.height = Math.ceil(canvas.width * (gridSize.y / gridSize.x));
            cellSize = (window.innerWidth) / gridSize.x;
        } else {
            if (gridSize.x / gridSize.y > window.innerWidth / window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = Math.ceil(canvas.width * (gridSize.y / gridSize.x));
                cellSize = (window.innerWidth) / gridSize.x;
            } else {
                canvas.height = window.innerHeight;
                canvas.width = Math.ceil(canvas.height * (gridSize.x / gridSize.y));
                cellSize = (window.innerHeight) / gridSize.y;
            }
        }
    } else {
        // The screen is horizontal
        if (gridSize.y > gridSize.x) {
            canvas.height = window.innerHeight;
            canvas.width = Math.ceil(canvas.height * (gridSize.x / gridSize.y));
            cellSize = (window.innerHeight) / gridSize.y;
        } else {
            if (gridSize.x / gridSize.y > window.innerWidth / window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = Math.ceil(canvas.width * (gridSize.y / gridSize.x));
                cellSize = (window.innerWidth) / gridSize.x;
            } else {
                canvas.height = window.innerHeight;
                canvas.width = Math.ceil(canvas.height * (gridSize.x / gridSize.y));
                cellSize = (window.innerHeight) / gridSize.y;
            }
        }
    }
}

var input = {
    x: 0,
    y: 1,
    directionMoved: { x: 0, y: 1 }
}
function handleKeyDown(e) {
    switch (e.code) {
        case "ArrowUp":
            if (input.directionMoved.y == 0) {
                input.x = 0;
                input.y = 1;
                snakeMovement();
            }
            break;
        case "ArrowDown":
            if (input.directionMoved.y == 0) {
                input.x = 0;
                input.y = -1;
                snakeMovement();
            }
            break;
        case "ArrowRight":
            if (input.directionMoved.x == 0) {
                input.x = 1;
                input.y = 0;
                snakeMovement();
            }
            break;
        case "ArrowLeft":
            if (input.directionMoved.x == 0) {
                input.x = -1;
                input.y = 0;
                snakeMovement();
            }
            break;
        default:
            break;
    }

}
function handleKeyUp(e) {
    switch (e.code) {
        case "ArrowUp":
            break;
        case "ArrowDown":
            break;
        case "ArrowRight":
            break;
        case "ArrowLeft":
            break;
        default:
            break;
    }
}

const gridSize = { x: 20, y: 20 };
let hasWalls = true;
var cellSize;
var snake = {
    position: { x: Math.round(gridSize.x / 2), y: Math.round(gridSize.y / 2) },
    tail: Array()
}
var fruit;

function drawGrid() {
    for (let i = 0; i < gridSize.x + 1; i++) {
        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, gridSize.y * cellSize);
        ctx.stroke();
    }
    for (let i = 0; i < gridSize.y + 1; i++) {
        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(gridSize.x * cellSize, i * cellSize);
        ctx.stroke();
    }
    if (hasWalls) {
        for (let i = 0; i < gridSize.x + 1; i++) {
            ctx.fillStyle = "rgb(50, 50, 50)";
            ctx.fillRect(i * cellSize, 0, cellSize, cellSize);
            ctx.fillRect(i * cellSize, (gridSize.y - 1) * cellSize, cellSize, cellSize);
        }
        for (let i = 0; i < gridSize.y + 1; i++) {
            ctx.fillStyle = "rgb(50, 50, 50)";
            ctx.fillRect(0, i * cellSize, cellSize, cellSize);
            ctx.fillRect((gridSize.y - 1) * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

function drawSnake() {
    ctx.fillStyle = "white";
    ctx.fillRect(snake.position.x * cellSize, snake.position.y * cellSize, cellSize, cellSize);
    snake.tail.forEach((tailpiece, index) => {
        ctx.fillRect(tailpiece.position.x * cellSize, tailpiece.position.y * cellSize, cellSize, cellSize);
    });
}

function drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(fruit.position.x * cellSize, fruit.position.y * cellSize, cellSize, cellSize)
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function snakeMovement() {
    lastHeadPositionX = snake.position.x;
    lastHeadPositionY = snake.position.y;
    snake.position.x += input.x;
    snake.position.y -= input.y;
    input.directionMoved.x = input.x;
    input.directionMoved.y = input.y;
    if(hasWalls){
        if(snake.position.x == 0 || snake.position.x == gridSize.x-1 || snake.position.y == 0 || snake.position.y == gridSize.y-1)
            window.location.reload();
    }
    if (snake.position.x < 0)
        snake.position.x = gridSize.x - 1;
    else if (snake.position.x > gridSize.x - 1)
        snake.position.x = 0;
    if (snake.position.y < 0)
        snake.position.y = gridSize.y - 1;
    else if (snake.position.y > gridSize.y - 1)
        snake.position.y = 0;

    for (let i = snake.tail.length - 1; i > 0; i--) {
        snake.tail[i].position.x = snake.tail[i - 1].position.x;
        snake.tail[i].position.y = snake.tail[i - 1].position.y;
    }
    if (snake.tail.length > 0) {
        snake.tail[0].position.x = lastHeadPositionX;
        snake.tail[0].position.y = lastHeadPositionY;
    }
    clearInterval(id);
    id = setInterval(snakeMovement, 300);
    gameLogic();
}

function gameLogic() {
    
    if (snake.position.x == fruit.position.x && snake.position.y == fruit.position.y) {
        generateFruit();
        snake.tail.push({ position: { x: -1, y: -1 } })
    }
    snake.tail.forEach((tailpiece) => {
        if (snake.position.x == tailpiece.position.x && snake.position.y == tailpiece.position.y)
            window.location.reload();
    })
}

function generateFruit(){
    let allowedPositions = [];
    if(!hasWalls){
        for (let i = 0; i < gridSize.x; i++)
            for (let j = 0; j < gridSize.y; j++)
                allowedPositions.push({ x: i, y: j });
    }else{
        for (let i = 1; i < gridSize.x-1; i++)
            for (let j = 1; j < gridSize.y-1; j++)
                allowedPositions.push({ x: i, y: j });
    }
    snake.tail.forEach((tailpiece) => {
        allowedPositions.forEach((position, index) => {
            if (tailpiece.position.x == position.x && tailpiece.position.y == position.y)
                allowedPositions.splice(index, 1);
        });
    });
    newPos = Math.floor(Math.random() * allowedPositions.length)
    fruit = {
        position: {
            x: allowedPositions[newPos].x,
            y: allowedPositions[newPos].y
        }
    }
}

function main() {
    clearCanvas();
    drawFruit();
    drawSnake();
    drawGrid();
    requestAnimationFrame(main);
}

generateFruit();
let id = setInterval(snakeMovement, 300);
requestAnimationFrame(main);