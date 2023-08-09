const width = 10
const height = 10
const board = document.querySelector(".board")

let cells = []
for (let i = 0; i < height; i++) {
    const row = document.createElement("div")
    row.classList.add("row")
    board.appendChild(row)
    cells.push([])
    for (let j = 0; j < width; j++) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cell.setAttribute("data-xy", String(i) + j)
        row.appendChild(cell)
        cells[i][j] = cell
    }
}

let snakeCoords = [
    { x: 5, y: 4 },
    { x: 4, y: 4 }
];
function renderSnake() {
    snakeCoords.forEach(coord => {
        const cell = cells[coord.y][coord.x];
        cell.classList.add("snake");
    });
}

document.addEventListener("DOMContentLoaded", () =>{
    const record = localStorage.getItem("record");
    if (record !== null) {
        document.querySelector(".record").textContent = "RECORD:" + record
    }
})

let gameStarted = false;
board.addEventListener("click", () => {
    if (!gameStarted) {
        gameStarted = true;
        board.classList.remove("game_not_started");
        renderApple();
        setInterval(moveSnake, 200);
    }
})

function renderApple() {
    const apple = document.querySelector(".apple");
    if (apple) {
        apple.classList.remove("apple");
    }
    let randomX, randomY;
    do {
        randomX = Math.floor(Math.random() * width);
        randomY = Math.floor(Math.random() * height);
    } while (snakeCoords.some(coord => coord.x === randomX && coord.y === randomY));
    const appleCell = cells[randomY][randomX];
    appleCell.classList.add("apple");

}

const restartButton = document.querySelector(".button_restart")
const score = document.querySelector(".score")
let gameEnded = false
let direction = "right"
let currentScore = 0
function moveSnake() {
    const newHead = Object.assign({}, snakeCoords[0]);
    if (direction === "up") {
        newHead.y = (newHead.y - 1 + height) % height;
    } else if (direction === "right") {
        newHead.x = (newHead.x + 1) % width;
    } else if (direction === "down") {
        newHead.y = (newHead.y + 1) % height;
    } else if (direction === "left") {
        newHead.x = (newHead.x - 1 + width) % width;
    }
    
    const newHeadCell = cells[newHead.y][newHead.x];
    if (newHeadCell.classList.contains("snake")) {
        if (!gameEnded) {
            gameEnded = true;
            restartButton.style.display = "block";

            const record = localStorage.getItem("record");
            if (record === null || currentScore > parseInt(record)) {
                localStorage.setItem("record", currentScore)
                document.querySelector(".record").textContent = "RECORD:" + currentScore
            }
        }
        return;
    }
    if (newHeadCell.classList.contains("apple")) {
        snakeCoords.unshift(newHead);
        newHeadCell.classList.add("snake");
        currentScore++;
        score.textContent = "SCORE:" + currentScore;
        renderApple();
    } else {
        snakeCoords.unshift(newHead);
        newHeadCell.classList.add("snake");
        const tail = snakeCoords.pop();
        const tailCell = cells[tail.y][tail.x];
        tailCell.classList.remove("snake");
    }
    canChangeDirection = true;
}

renderSnake();

let canChangeDirection = true;
document.addEventListener("keydown", (event) => {
    if (gameStarted && !gameEnded && canChangeDirection) {
        canChangeDirection = false;
        if (event.key == "ArrowUp" && direction !== "down") {
            direction = "up";
        } else if (event.key == "ArrowRight" && direction !== "left") {
            direction = "right"
        } else if (event.key == "ArrowDown" && direction !== "up") {
            direction = "down"
        } else if (event.key == "ArrowLeft" && direction !== "right") {
            direction = "left"
        }
    }
})


restartButton.addEventListener("click", () => {
    debugger
    cells.forEach(row => {
        row.forEach(cell => {
            cell.classList.remove("snake");
            cell.classList.remove("apple");
        });
    });

    snakeCoords = [
        { x: 5, y: 4 },
        { x: 4, y: 4 }
    ];
    renderApple();
    renderSnake();

    restartButton.style.display = "none"

    currentScore = 0
    score.textContent = "SCORE: 0"

    gameStarted = true;
    gameEnded = false;
    direction = "right";
}); 