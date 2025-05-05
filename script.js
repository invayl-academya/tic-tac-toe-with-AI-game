// Game Variables
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let currentPlayer = "X"; // Player is X, AI is O
let gameOver = false;
const boardElement = document.getElementById("board");
const statusElement = document.querySelector(".status");
const resetButton = document.getElementById("reset");

// Initialize the Board
function initBoard() {
  boardElement.innerHTML = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleCellClick);
      boardElement.appendChild(cell);
    }
  }
}

// Handle Cell Click
function handleCellClick(e) {
  if (gameOver) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  // If cell is empty and it's player's turn
  if (board[row][col] === "" && currentPlayer === "X") {
    board[row][col] = "X";
    e.target.textContent = "X";

    if (checkWin("X")) {
      statusElement.textContent = "You win!";
      gameOver = true;
      return;
    } else if (checkDraw()) {
      statusElement.textContent = "Draw!";
      gameOver = true;
      return;
    }

    currentPlayer = "O";
    statusElement.textContent = "AI's turn (O)";

    // AI makes a move after a short delay
    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

// AI Move (Minimax Algorithm)
function aiMove() {
  if (gameOver) return;

  // Find best move using Minimax
  let bestScore = -Infinity;
  let bestMove;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        board[row][col] = "O";
        const score = minimax(board, 0, false);
        board[row][col] = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = { row, col };
        }
      }
    }
  }

  // Make the best move
  if (bestMove) {
    board[bestMove.row][bestMove.col] = "O";
    const cell = document.querySelector(
      `[data-row="${bestMove.row}"][data-col="${bestMove.col}"]`
    );
    cell.textContent = "O";

    if (checkWin("O")) {
      statusElement.textContent = "AI wins!";
      gameOver = true;
    } else if (checkDraw()) {
      statusElement.textContent = "Draw!";
      gameOver = true;
    } else {
      currentPlayer = "X";
      statusElement.textContent = "Your turn (X)";
    }
  }
}

// Minimax Algorithm (for unbeatable AI)
function minimax(board, depth, isMaximizing) {
  // Base cases
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return -10 + depth;
  if (checkDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "") {
          board[row][col] = "O";
          const score = minimax(board, depth + 1, false);
          board[row][col] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "") {
          board[row][col] = "X";
          const score = minimax(board, depth + 1, true);
          board[row][col] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

// Check for Win
function checkWin(player) {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] === player &&
      board[row][1] === player &&
      board[row][2] === player
    ) {
      return true;
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      board[0][col] === player &&
      board[1][col] === player &&
      board[2][col] === player
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }
  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    return true;
  }

  return false;
}

// Check for Draw
function checkDraw() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        return false;
      }
    }
  }
  return true;
}

// Reset Game
function resetGame() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = "";
    }
  }
  currentPlayer = "X";
  gameOver = false;
  statusElement.textContent = "Your turn (X)";
  initBoard();
}

// Event Listeners
resetButton.addEventListener("click", resetGame);

// Start the Game
initBoard();
