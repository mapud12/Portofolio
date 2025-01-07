const grid = document.getElementById('grid');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const width = 10;
const height = 20;
const cells = [];
let timerId;
let score = 0;
let currentPosition = 4;
let currentRotation = 0;
let isGameRunning = false;

// Inisialisasi grid
for (let i = 0; i < width * height; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
    cells.push(cell);
}

// Tambahkan baris tambahan untuk menghindari bug
for (let i = 0; i < width; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'taken'); // Sel di luar grid dianggap 'taken'
    grid.appendChild(cell);
}

// Bentuk Tetrimino
const tetriminos = [
    [1, width + 1, width * 2 + 1, 2], // L-shape
    [0, width, width + 1, width * 2 + 1], // Z-shape
    [1, width, width + 1, width + 2], // T-shape
    [0, 1, width, width + 1], // Square
    [1, width + 1, width * 2 + 1, width * 3 + 1], // Line
];

let random = Math.floor(Math.random() * tetriminos.length);
let current = tetriminos[random];

// Fungsi untuk menggambar Tetrimino
function draw() {
    current.forEach(index => {
        if (cells[currentPosition + index]) {
            cells[currentPosition + index].classList.add('active');
        }
    });
}

// Fungsi untuk menghapus Tetrimino
function undraw() {
    current.forEach(index => {
        if (cells[currentPosition + index]) {
            cells[currentPosition + index].classList.remove('active');
        }
    });
}

// Validasi gerakan
function isValidMove(offset = 0) {
    return current.every(index => {
        const targetIndex = currentPosition + index + offset;
        return (
            targetIndex >= 0 &&
            targetIndex < width * height &&
            !cells[targetIndex].classList.contains('taken') &&
            (targetIndex % width !== 0 || offset !== -1) && // Batas kiri
            (targetIndex % width !== width - 1 || offset !== 1) // Batas kanan
        );
    });
}

// Pindah ke bawah
function moveDown() {
    undraw();
    if (isValidMove(width)) {
        currentPosition += width;
    } else {
        freeze();
    }
    draw();
}

// Membekukan balok di tempat
function freeze() {
    current.forEach(index => cells[currentPosition + index].classList.add('taken'));
    addScore();
    spawnNewTetrimino();
    checkGameOver();
}

// Pindah ke kiri
function moveLeft() {
    undraw();
    if (isValidMove(-1)) {
        currentPosition -= 1;
    }
    draw();
}

// Pindah ke kanan
function moveRight() {
    undraw();
    if (isValidMove(1)) {
        currentPosition += 1;
    }
    draw();
}

// Rotasi balok
function rotate() {
    undraw();
    const oldRotation = currentRotation;
    currentRotation = (currentRotation + 1) % 4;
    const newTetrimino = tetriminos[random].map(index => {
        const x = index % width;
        const y = Math.floor(index / width);
        return y + x * width; // Transformasi rotasi
    });
    if (isValidMove()) {
        current = newTetrimino;
    } else {
        currentRotation = oldRotation;
    }
    draw();
}

// Spawn Tetrimino baru
function spawnNewTetrimino() {
    random = Math.floor(Math.random() * tetriminos.length);
    current = tetriminos[random];
    currentPosition = 4;
    draw();
}

// Tambah skor
function addScore() {
    for (let i = 0; i < height; i++) {
        const row = Array.from({ length: width }, (_, j) => i * width + j);
        if (row.every(index => cells[index].classList.contains('taken'))) {
            row.forEach(index => {
                cells[index].classList.remove('taken', 'active');
            });
            const removedCells = cells.splice(i * width, width);
            removedCells.forEach(cell => grid.prepend(cell));
            score += 10;
            scoreDisplay.textContent = score;
        }
    }
}

// Cek apakah permainan berakhir
function checkGameOver() {
    if (current.some(index => cells[currentPosition + index]?.classList.contains('taken'))) {
        alert(`Game Over! Skor Anda: ${score}`);
        clearInterval(timerId);
        isGameRunning = false;
    }
}

// Kontrol pemain
function control(e) {
    if (!isGameRunning) return;
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
    if (e.key === 'ArrowDown') moveDown();
    if (e.key === 'ArrowUp') rotate();
}

// Mulai permainan
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        random = Math.floor(Math.random() * tetriminos.length);
        current = tetriminos[random];
        currentPosition = 4;
        score = 0;
        scoreDisplay.textContent = score;
        draw();
        timerId = setInterval(moveDown, 500);
    }
}

// Event listener
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', control);
