// =============================
// ELEMENTS
// =============================
console.log("football.js loaded");

const team1Input = document.getElementById("team1Input");
const team2Input = document.getElementById("team2Input");

const matchTimeInput = document.getElementById("matchTime");
const breakTimeInput = document.getElementById("breakTime");

const startBtn = document.getElementById("startMatch");

const team1Name = document.getElementById("team1Name");
const team2Name = document.getElementById("team2Name");

const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

const timerDisplay = document.getElementById("timerDisplay");
const matchStatus = document.getElementById("matchStatus");

const goalHistory = document.getElementById("goalHistory");

const prediction1 = document.getElementById("prediction1");
const prediction2 = document.getElementById("prediction2");

const winnerText = document.getElementById("winnerText");

const team1Plus = document.getElementById("team1Plus");
const team1Minus = document.getElementById("team1Minus");

const team2Plus = document.getElementById("team2Plus");
const team2Minus = document.getElementById("team2Minus");

const interOption = document.getElementById("interOption");
const intraOption = document.getElementById("intraOption");

let competition = "";

// =============================
// VARIABLES
// =============================

let goals1 = 0;
let goals2 = 0;

let timer = 0;
let matchLength = 90;
let interval;


interOption.addEventListener("click", () => {

    competition = "Inter University";

    interOption.classList.add("selected");
    intraOption.classList.remove("selected");

});

intraOption.addEventListener("click", () => {

    competition = "Intra University";

    intraOption.classList.add("selected");
    interOption.classList.remove("selected");

});

// =============================
// START MATCH
// =============================

startBtn.addEventListener("click", () => {

    if (competition === "") {
    alert("Please select a competition.");
    return;
    }

    if(team1Input.value.trim() !== "")
        team1Name.textContent = team1Input.value;

    if(team2Input.value.trim() !== "")
        team2Name.textContent = team2Input.value;

    matchLength = Number(matchTimeInput.value) || 90;

    timer = 0;

    matchStatus.textContent = "First Half";

    clearInterval(interval);

    interval = setInterval(updateTimer,1000);

});


// =============================
// TIMER
// =============================

function updateTimer() {

    timer++;

    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (timer >= matchLength * 60) {

        clearInterval(interval);

        matchStatus.textContent = "Full Time";

        decideWinner();

    }

}


// =============================
// TEAM 1
// =============================

team1Plus.addEventListener("click",()=>{

    goals1++;

    score1.textContent = goals1;

    addHistory(team1Name.textContent);

    updatePrediction();

    updateGraph();

});

team1Minus.addEventListener("click",()=>{

    if(goals1>0){

        goals1--;

        score1.textContent = goals1;

        updatePrediction();

        updateGraph();

    }

});


// =============================
// TEAM 2
// =============================

team2Plus.addEventListener("click",()=>{

    goals2++;

    score2.textContent = goals2;

    addHistory(team2Name.textContent);

    updatePrediction();

    updateGraph();

});

team2Minus.addEventListener("click",()=>{

    if(goals2>0){

        goals2--;

        score2.textContent = goals2;

        updatePrediction();

        updateGraph();

    }

});


// =============================
// GOAL HISTORY
// =============================

function addHistory(team){

    if(goalHistory.children[0].textContent==="No goals yet...")
        goalHistory.innerHTML="";

    let li=document.createElement("li");

    li.textContent=
    `${timer}'  Goal - ${team}`;

    goalHistory.prepend(li);

}


// =============================
// PREDICTION
// =============================

function updatePrediction(){

    let difference = goals1-goals2;

    let p1=50;
    let p2=50;

    if(difference===1){

        p1=60;
        p2=40;

    }

    else if(difference===2){

        p1=70;
        p2=30;

    }

    else if(difference>=3){

        p1=85;
        p2=15;

    }

    else if(difference===-1){

        p1=40;
        p2=60;

    }

    else if(difference===-2){

        p1=30;
        p2=70;

    }

    else if(difference<=-3){

        p1=15;
        p2=85;

    }

    prediction1.textContent=p1+"%";
    prediction2.textContent=p2+"%";

}


// =============================
// WINNER
// =============================

function decideWinner(){

    team1Plus.disabled = true;
    team1Minus.disabled = true;
    team2Plus.disabled = true;
    team2Minus.disabled = true;

    if(goals1 > goals2){

        winnerText.textContent = "🏆 " + team1Name.textContent;

    }

    else if(goals2 > goals1){

        winnerText.textContent = "🏆 " + team2Name.textContent;

    }

    else{

        winnerText.textContent = "Match Draw";

    }

    winnerText.style.animation = "winnerPop .8s ease";

}

function updateGraph(){

    chart.data.labels.push(timer + "'");

    chart.data.datasets[0].data.push(goals1);
    chart.data.datasets[1].data.push(goals2);

    chart.data.datasets[0].label = team1Name.textContent;
    chart.data.datasets[1].label = team2Name.textContent;

    chart.update();

}

const ctx = document.getElementById("scoreChart");
const chartCtx = ctx.getContext("2d");

chartCtx.shadowBlur = 20;
chartCtx.shadowColor = "gold";

const chart = new Chart(ctx,{

    type:"line",

    data:{

        labels:["Start"],

        datasets: [

    {
        label: team1Name.textContent,
        data: [0],

        borderColor: "#f4e37f",
        borderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 8,

        borderWidth: 3,
        tension: 0.4,
        fill: true
    },

    {
        label: team2Name.textContent,
        data: [0],

        borderColor: "#efeaea",
        borderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 8,

        borderWidth: 3,
        tension: 0.4,
        fill: true
    }

]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false

    }

});