let size = 4;
let board = [];
let score = 0;

const gameArea = document.getElementById("gameArea");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

function initGame() {
    gameArea.innerHTML = "";
    board = new Array(size * size).fill(0);
    score = 0;

    const grid = document.createElement("div");
    grid.className = "board";
    grid.id = "board";

    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        grid.appendChild(tile);
    }

    gameArea.appendChild(grid);

    addNumber();
    addNumber();
    updateBoard();
}

function addNumber() {
    let empty = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
    if (empty.length === 0) return;

    let randomIndex = empty[Math.floor(Math.random() * empty.length)];
    board[randomIndex] = Math.random() > 0.5 ? 2 : 4;
}

function updateBoard() {
    const tiles = document.querySelectorAll(".tile");

    board.forEach((value, index) => {
        tiles[index].innerText = value === 0 ? "" : value;
        tiles[index].style.background = value === 0 ? "#444" : getColor(value);
    });

    checkWin();
    checkGameOver();
}

function getColor(value) {
    const colors = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e"
    };
    return colors[value] || "#3c3a32";
}

function slide(row) {
    row = row.filter(v => v);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
        }
    }
    row = row.filter(v => v);
    while (row.length < size) row.push(0);
    return row;
}

function moveLeft() {
    for (let i = 0; i < size; i++) {
        let row = board.slice(i * size, i * size + size);
        row = slide(row);
        board.splice(i * size, size, ...row);
    }
}

function rotate() {
    let newBoard = [];
    for (let i = 0; i < size; i++) {
        for (let j = size - 1; j >= 0; j--) {
            newBoard.push(board[j * size + i]);
        }
    }
    board = newBoard;
}

function moveRight() {
    rotate(); rotate();
    moveLeft();
    rotate(); rotate();
}

function moveUp() {
    rotate(); rotate(); rotate();
    moveLeft();
    rotate();
}

function moveDown() {
    rotate();
    moveLeft();
    rotate(); rotate(); rotate();
}

document.addEventListener("keydown", (e) => {
    let oldBoard = [...board];

    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
    if (e.key === "ArrowUp") moveUp();
    if (e.key === "ArrowDown") moveDown();

    if (oldBoard.toString() !== board.toString()) {
        document.getElementById("moveSound").play();
        addNumber();
        updateBoard();
    }
});

function checkWin() {
    if (board.includes(2048)) {
        document.getElementById("winSound").play();
        showPopup("🏆 You Win!");
    }
}

function checkGameOver() {
    if (!board.includes(0)) {
        document.getElementById("gameOverSound").play();
        showPopup("💀 Game Over!");
    }
}

function showPopup(text) {
    popupText.innerText = text;
    popup.classList.remove("hidden");
}

function restart() {
    popup.classList.add("hidden");
    initGame();
}

let startX = 0;
let startY = 0;
let threshold = 50; // minimum swipe distance

const boardElement = document.getElementById("gameArea");

boardElement.addEventListener("touchstart", function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}, { passive: true });

boardElement.addEventListener("touchend", function(e) {

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > threshold) {
            if (dx > 0) moveRight();
            else moveLeft();
        }
    } else {
        if (Math.abs(dy) > threshold) {
            if (dy > 0) moveDown();
            else moveUp();
        }
    }

    addNumber();
    updateBoard();

}, { passive: true });

initGame();
