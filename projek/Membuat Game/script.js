// Game Variables
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
let squares = [];
let currentPosition = 4; // Starting position for tetromino
let currentRotation = 0;
let timerId;
let score = 0;

// Tetrominoes
const tetrominoes = [
  [1, 10, 11, 21], // L-shape
  [1, 10, 11, 12], // T-shape
  [1, 2, 10, 11],  // Z-shape
  [0, 1, 10, 11],  // Square
  [1, 2, 11, 12]   // Line
];

// Create Grid
function createGrid() {
  for (let i = 0; i < 200; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
  }
  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    div.classList.add('taken'); // Bottom boundary
    grid.appendChild(div);
  }
  squares = Array.from(grid.querySelectorAll('div'));
}

createGrid();

// Randomly select Tetromino
let random = Math.floor(Math.random() * tetrominoes.length);
let current = tetrominoes[random];

// Draw Tetromino
function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('block');
  });
}

// Undraw Tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('block');
  });
}

// Move Tetromino Down
function moveDown() {
  undraw();
  currentPosition += 10;
  draw();
  freeze();
}

// Freeze Tetromino
function freeze() {
  if (current.some(index => squares[currentPosition + index + 10].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'));
    // Start a new Tetromino
    random = Math.floor(Math.random() * tetrominoes.length);
    current = tetrominoes[random];
    currentPosition = 4;
    draw();
    addScore();
    gameOver();
  }
}

// Move Tetromino Left
function moveLeft() {
  undraw();
  const atLeftEdge = current.some(index => (currentPosition + index) % 10 === 0);
  if (!atLeftEdge) currentPosition -= 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }
  draw();
}

// Move Tetromino Right
function moveRight() {
  undraw();
  const atRightEdge = current.some(index => (currentPosition + index) % 10 === 9);
  if (!atRightEdge) currentPosition += 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }
  draw();
}

// Rotate Tetromino
function rotate() {
  undraw();
  currentRotation = (currentRotation + 1) % current.length;
  draw();
}

// Add Score
function addScore() {
  for (let i = 0; i < 199; i += 10) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
    if (row.every(index => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('block');
      });
      const squaresRemoved = squares.splice(i, 10);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
}

// Game Over
function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = 'Game Over';
    clearInterval(timerId);
  }
}

// Event Listeners
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
  if (e.key === 'ArrowUp') rotate();
  if (e.key === 'ArrowDown') moveDown();
});

// Start Game
timerId = setInterval(moveDown, 1000);
