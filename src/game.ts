import "./styles.css";

type Player = "X" | "O" | "";

let board: Player[] = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let difficulty: "easy" | "medium" | "impossible" = "impossible";
let playerFirst = true;

const trashTalk = [
  "You call that strategy? 😏",
  "Predictable...",
  "I'm 3 steps ahead.",
  "You humans never learn.",
  "Calculating your defeat...",
  "Try harder.",
];

const app = document.getElementById("app")!;

app.innerHTML = `
  <div class="glass-container">
    <h1> Tic-Tac-Toe </h1>

    <div class="difficulty">
      <p>Difficulty</p>
      <button data-level="easy">Easy</button>
      <button data-level="medium">Medium</button>
      <button data-level="impossible" class="active">Impossible</button>
    </div>

    <div class="turn">
      <p>Who plays first?</p>
      <button data-turn="first" class="active">You</button>
      <button data-turn="second">AI</button>
    </div>

    <div id="board" class="board"></div>
    <p id="status">Your turn</p>
    <p id="ai-comment" class="ai-comment"></p>
    <button id="reset">New Game</button>
  </div>
`;

const boardDiv = document.getElementById("board")!;
const status = document.getElementById("status")!;
const resetBtn = document.getElementById("reset")!;
const aiComment = document.getElementById("ai-comment")!;

/* Difficulty */
document.querySelectorAll(".difficulty button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".difficulty button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.getAttribute("data-level") as any;
  });
});

/* Turn selection */
document.querySelectorAll(".turn button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".turn button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    playerFirst = btn.getAttribute("data-turn") === "first";
  });
});

function render() {
  boardDiv.innerHTML = "";
  board.forEach((cell, i) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.innerText = cell;
    btn.onclick = () => playerMove(i);
    boardDiv.appendChild(btn);
  });
}

function startGame() {
  render();

  if (!playerFirst) {
    status.innerText = "AI thinking...";
    setTimeout(aiMove, 600);
  } else {
    status.innerText = "Your turn";
  }
}

function playerMove(i: number) {
  if (board[i] || gameOver) return;

  board[i] = "X";
  render();

  if (checkWinner("X")) {
    status.innerText = "You won 😲";
    gameOver = true;
    return;
  }

  status.innerText = "AI thinking...";
  setTimeout(aiMove, 500);
}

function aiMove() {
  if (gameOver) return;

  let move = 0;

  if (difficulty === "easy") {
    const empty = board
      .map((v, i) => (v === "" ? i : -1))
      .filter((i) => i !== -1);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === "medium") {
    if (Math.random() < 0.5) {
      const empty = board
        .map((v, i) => (v === "" ? i : -1))
        .filter((i) => i !== -1);
      move = empty[Math.floor(Math.random() * empty.length)];
    } else {
      move = bestMove();
    }
  } else {
    move = bestMove();
  }

  board[move] = "O";

  if (checkWinner("O")) {
    status.innerText = "AI wins 😈";
    gameOver = true;
  } else {
    status.innerText = "Your turn";
  }

  aiComment.innerText = trashTalk[Math.floor(Math.random() * trashTalk.length)];
  render();
}

function bestMove() {
  let bestScore = -Infinity;
  let move = 0;

  board.forEach((_, i) => {
    if (!board[i]) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(b: Player[], depth: number, isMax: boolean): number {
  if (checkWinner("O")) return 10 - depth;
  if (checkWinner("X")) return depth - 10;
  if (b.every((c) => c)) return 0;

  if (isMax) {
    let best = -Infinity;
    b.forEach((_, i) => {
      if (!b[i]) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    b.forEach((_, i) => {
      if (!b[i]) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = "";
      }
    });
    return best;
  }
}

function checkWinner(p: Player): boolean {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return wins.some(
    ([a, b, c]) => board[a] === p && board[b] === p && board[c] === p
  );
}

resetBtn.onclick = () => {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  aiComment.innerText = "";
  startGame();
};

startGame();
