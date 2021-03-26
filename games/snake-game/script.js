let canvas = document.querySelector("#snake"); // create element that will run the game
let context = canvas.getContext("2d");

let box = 32;
let snake = []; // create snake as a list, since it will be a series of coordinates, which when painted, create the squares

snake[0] = {
    x: 8 * box,
    y: 8 * box
}

let direction = "right";

function createBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box); // fillRect(x, y, width, height) => draw the rect
}

function createSnake() {
    for(let i=0; i<snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function startGame() {
    createBG();
    createSnake();   

    // initial snake position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "right") snakeX += box;
    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "down") snakeY += box;

    snake.pop();

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

let game = setInterval(startGame, 100); // adds as the first snake square