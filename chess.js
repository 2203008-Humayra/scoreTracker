// =============================
// ELEMENTS
// =============================

const player1Input = document.getElementById("player1Input");
const player2Input = document.getElementById("player2Input");
const gameMode = document.getElementById("gameMode");
const incrementTime = document.getElementById("incrementTime");
const startBtn = document.getElementById("startMatch");
const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");
const player1ClockName = document.getElementById("player1ClockName");
const player2ClockName = document.getElementById("player2ClockName");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const timerDisplay1 = document.getElementById("timerDisplay1");
const timerDisplay2 = document.getElementById("timerDisplay2");
const player1Clock = document.getElementById("player1Clock");
const player2Clock = document.getElementById("player2Clock");
const matchStatus = document.getElementById("matchStatus");
const moveInput = document.getElementById("moveInput");
const moveHistory = document.getElementById("moveHistory");
const prediction1 = document.getElementById("prediction1");
const prediction2 = document.getElementById("prediction2");
const predictionName1 = document.getElementById("predictionName1");
const predictionName2 = document.getElementById("predictionName2");
const winnerText = document.getElementById("winnerText");
const player1Plus = document.getElementById("player1Plus");
const player1Minus = document.getElementById("player1Minus");
const player2Plus = document.getElementById("player2Plus");
const player2Minus = document.getElementById("player2Minus");
const interOption = document.getElementById("interOption");
const intraOption = document.getElementById("intraOption");

let competition = "";
let material1 = 0;
let material2 = 0;
let whiteTime = 600;
let blackTime = 600;
let activePlayer = 1;
let interval;
let gameStarted = false;
let gameFinished = false;
let moveNumber = 0;
let increment = 0;

// =============================
// COMPETITION
// =============================

function selectCompetition(name, selected, other) {
    competition = name;
    selected.classList.add("selected");
    other.classList.remove("selected");
}

interOption.addEventListener("click", () => selectCompetition("Inter University", interOption, intraOption));
intraOption.addEventListener("click", () => selectCompetition("Intra University", intraOption, interOption));

// =============================
// START GAME & CLOCK
// =============================

startBtn.addEventListener("click", () => {
    if (competition === "") {
        alert("Please select a competition.");
        return;
    }

    if (player1Input.value.trim() !== "") player1Name.textContent = player1Input.value.trim();
    if (player2Input.value.trim() !== "") player2Name.textContent = player2Input.value.trim();

    player1ClockName.textContent = player1Name.textContent;
    player2ClockName.textContent = player2Name.textContent;
    predictionName1.textContent = player1Name.textContent;
    predictionName2.textContent = player2Name.textContent;

    const gameMinutes = Number(gameMode.value) || 10;
    increment = Number(incrementTime.value) || 0;
    whiteTime = gameMinutes * 60;
    blackTime = gameMinutes * 60;
    activePlayer = 1;
    gameStarted = true;
    gameFinished = false;
    winnerText.textContent = "--";
    updateClock();
    updatePrediction();
    updateGraph();
    matchStatus.textContent = "White to move";
    clearInterval(interval);
    interval = setInterval(updateTimer, 1000);
});

function updateTimer() {
    if (!gameStarted || gameFinished) return;

    if (activePlayer === 1) {
        whiteTime--;
        if (whiteTime <= 0) finishGame(player2Name.textContent + " wins on time");
    } else {
        blackTime--;
        if (blackTime <= 0) finishGame(player1Name.textContent + " wins on time");
    }

    updateClock();
}

function updateClock() {
    timerDisplay1.textContent = formatTime(Math.max(whiteTime, 0));
    timerDisplay2.textContent = formatTime(Math.max(blackTime, 0));
    player1Clock.classList.toggle("active", gameStarted && !gameFinished && activePlayer === 1);
    player2Clock.classList.toggle("active", gameStarted && !gameFinished && activePlayer === 2);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function switchTurn(nextPlayer) {
    if (!gameStarted || gameFinished || activePlayer === nextPlayer) return;

    if (activePlayer === 1) whiteTime += increment;
    else blackTime += increment;

    activePlayer = nextPlayer;
    matchStatus.textContent = activePlayer === 1 ? "White to move" : "Black to move";
    updateClock();
}

player1Clock.addEventListener("click", () => switchTurn(2));
player2Clock.addEventListener("click", () => switchTurn(1));

// =============================
// MATERIAL SCORE & MOVE HISTORY
// =============================

function changeMaterial(player, amount) {
    if (gameFinished) return;

    if (player === 1) {
        material1 = Math.max(0, material1 + amount);
        score1.textContent = material1;
    } else {
        material2 = Math.max(0, material2 + amount);
        score2.textContent = material2;
    }

    updatePrediction();
    updateGraph();
}

player1Plus.addEventListener("click", () => changeMaterial(1, 1));
player1Minus.addEventListener("click", () => changeMaterial(1, -1));
player2Plus.addEventListener("click", () => changeMaterial(2, 1));
player2Minus.addEventListener("click", () => changeMaterial(2, -1));

function addMove() {
    const notation = moveInput.value.trim();
    if (notation === "") return;

    if (moveHistory.children[0].textContent === "No moves yet...") moveHistory.innerHTML = "";

    moveNumber++;
    const li = document.createElement("li");
    const side = activePlayer === 1 ? "White" : "Black";
    li.textContent = `${moveNumber}. ${side}: ${notation}`;
    moveHistory.prepend(li);
    moveInput.value = "";
    updateGraph();
}

document.getElementById("addMove").addEventListener("click", addMove);
moveInput.addEventListener("keydown", event => { if (event.key === "Enter") addMove(); });

// =============================
// PREDICTION, ANALYTICS & RESULT
// =============================

function updatePrediction() {
    const materialDifference = material1 - material2;
    const timeDifference = Math.round((whiteTime - blackTime) / 60);
    const advantage = materialDifference * 10 + timeDifference * 2;
    const whitePrediction = Math.max(10, Math.min(90, 50 + advantage));

    prediction1.textContent = whitePrediction + "%";
    prediction2.textContent = (100 - whitePrediction) + "%";
}

function finishGame(result) {
    gameFinished = true;
    gameStarted = false;
    clearInterval(interval);
    matchStatus.textContent = "Game Over";
    winnerText.textContent = "🏆 " + result;
    winnerText.style.animation = "winnerPop .8s ease";
    updateClock();
}

document.getElementById("drawGame").addEventListener("click", () => {
    if (gameStarted && !gameFinished) finishGame("Game Drawn");
});

document.getElementById("resignGame").addEventListener("click", () => {
    if (!gameStarted || gameFinished) return;
    const winner = activePlayer === 1 ? player2Name.textContent : player1Name.textContent;
    finishGame(winner + " wins by resignation");
});

document.getElementById("resetGame").addEventListener("click", () => {
    clearInterval(interval);
    material1 = 0;
    material2 = 0;
    moveNumber = 0;
    gameStarted = false;
    gameFinished = false;
    score1.textContent = "0";
    score2.textContent = "0";
    moveHistory.innerHTML = "<li>No moves yet...</li>";
    winnerText.textContent = "--";
    matchStatus.textContent = "Waiting to Start...";
    updatePrediction();
    resetGraph();
});

const chart = new Chart(document.getElementById("scoreChart"), {
    type: "line",
    data: {
        labels: ["Start"],
        datasets: [
            { label: "White Player", data: [0], borderColor: "#f4e37f", borderWidth: 3, pointRadius: 5, tension: .4, fill: true },
            { label: "Black Player", data: [0], borderColor: "#efeaea", borderWidth: 3, pointRadius: 5, tension: .4, fill: true }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#fff" } } }, scales: { x: { ticks: { color: "#ddd" } }, y: { ticks: { color: "#ddd" }, beginAtZero: true } } }
});

function updateGraph() {
    const label = moveNumber ? "Move " + moveNumber : "Start";
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(material1);
    chart.data.datasets[1].data.push(material2);
    chart.data.datasets[0].label = player1Name.textContent;
    chart.data.datasets[1].label = player2Name.textContent;
    chart.update();
}

function resetGraph() {
    chart.data.labels = ["Start"];
    chart.data.datasets[0].data = [0];
    chart.data.datasets[1].data = [0];
    chart.update();
}

document.getElementById("graphButton").addEventListener("click", () => {
    document.getElementById("graphArea").scrollIntoView({ behavior: "smooth", block: "center" });
});
