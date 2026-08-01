// =============================
// ELEMENTS
// =============================
console.log("hackathon.js loaded");

const teamNameInput = document.getElementById("teamNameInput");
const projectInput = document.getElementById("projectInput");
const addTeamBtn = document.getElementById("addTeamBtn");

const teamsList = document.getElementById("teamsList");
const emptyState = document.getElementById("emptyState");

const leaderboard = document.getElementById("leaderboard");

const topInnovation = document.getElementById("topInnovation");
const topExecution = document.getElementById("topExecution");

const winnerText = document.getElementById("winnerText");
const declareWinnerBtn = document.getElementById("declareWinnerBtn");

// =============================
// CRITERIA
// =============================

const CRITERIA = [
    { key: "innovation", label: "Innovation" },
    { key: "execution", label: "Technical Execution" },
    { key: "presentation", label: "Presentation" },
    { key: "impact", label: "Impact / Usefulness" }
];

// =============================
// STATE
// =============================

let teams = [];
let teamIdCounter = 1;

// =============================
// ADD TEAM
// =============================

addTeamBtn.addEventListener("click", () => {

    const name = teamNameInput.value.trim();

    if (name === "") {
        alert("Please enter a team name.");
        return;
    }

    const project = projectInput.value.trim();

    const scores = {};

    CRITERIA.forEach(c => scores[c.key] = 5);

    teams.push({
        id: teamIdCounter++,
        name,
        project,
        scores
    });

    teamNameInput.value = "";
    projectInput.value = "";

    renderTeams();
    renderLeaderboard();
    updateGraph();

});

// =============================
// RENDER TEAMS
// =============================

function renderTeams(){

    if(teams.length === 0){

        teamsList.innerHTML = "";
        teamsList.appendChild(emptyState);
        return;

    }

    teamsList.innerHTML = "";

    const sorted = [...teams].sort((a,b) => getTotal(b) - getTotal(a));

    teams.forEach(team => {

        const rank = sorted.findIndex(t => t.id === team.id) + 1;

        const card = document.createElement("div");
        card.className = "team-card";

        let criteriaHTML = "";

        CRITERIA.forEach(c => {

            criteriaHTML += `
                <div class="criterion">
                    <label>${c.label} <span class="val" id="val-${team.id}-${c.key}">${team.scores[c.key]}</span></label>
                    <input type="range" min="0" max="10" step="1"
                        value="${team.scores[c.key]}"
                        data-team="${team.id}" data-key="${c.key}">
                </div>
            `;

        });

        card.innerHTML = `
            <div class="team-card-header">
                <div>
                    <h3>${team.name}</h3>
                    <p>${team.project ? team.project : "No project title"}</p>
                </div>
                <button class="remove-team" data-remove="${team.id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="criteria-grid">
                ${criteriaHTML}
            </div>

            <div class="team-card-footer">
                <div class="team-total">Total: <span id="total-${team.id}">${getTotal(team)}</span> / 40</div>
                <div class="rank-badge">Rank #${rank}</div>
            </div>
        `;

        teamsList.appendChild(card);

    });

    attachSliderEvents();
    attachRemoveEvents();

}

// =============================
// SLIDERS
// =============================

function attachSliderEvents(){

    const sliders = teamsList.querySelectorAll("input[type='range']");

    sliders.forEach(slider => {

        slider.addEventListener("input", (e) => {

            const teamId = Number(e.target.dataset.team);
            const key = e.target.dataset.key;
            const value = Number(e.target.value);

            const team = teams.find(t => t.id === teamId);
            team.scores[key] = value;

            document.getElementById(`val-${teamId}-${key}`).textContent = value;
            document.getElementById(`total-${teamId}`).textContent = getTotal(team);

            renderLeaderboard();
            updateGraph();
            updateRanks();

        });

    });

}

// =============================
// REMOVE TEAM
// =============================

function attachRemoveEvents(){

    const removeButtons = teamsList.querySelectorAll("[data-remove]");

    removeButtons.forEach(btn => {

        btn.addEventListener("click", (e) => {

            const teamId = Number(e.currentTarget.dataset.remove);

            teams = teams.filter(t => t.id !== teamId);

            renderTeams();
            renderLeaderboard();
            updateGraph();

        });

    });

}

// =============================
// RANK BADGES (without full rerender)
// =============================

function updateRanks(){

    const sorted = [...teams].sort((a,b) => getTotal(b) - getTotal(a));

    teams.forEach(team => {

        const rank = sorted.findIndex(t => t.id === team.id) + 1;

        const card = [...teamsList.children].find(c =>
            c.querySelector(`[id^="total-${team.id}"]`)
        );

        if(card){

            const badge = card.querySelector(".rank-badge");

            if(badge) badge.textContent = `Rank #${rank}`;

        }

    });

}

// =============================
// TOTAL SCORE
// =============================

function getTotal(team){

    return CRITERIA.reduce((sum,c) => sum + team.scores[c.key], 0);

}

// =============================
// LEADERBOARD
// =============================

function renderLeaderboard(){

    if(teams.length === 0){

        leaderboard.innerHTML = "<li>No scores yet...</li>";
        return;

    }

    const sorted = [...teams].sort((a,b) => getTotal(b) - getTotal(a));

    const medals = ["🥇","🥈","🥉"];

    leaderboard.innerHTML = "";

    sorted.forEach((team,index) => {

        const li = document.createElement("li");

        const medal = medals[index] ? medals[index] : `#${index+1}`;

        li.innerHTML = `
            <span class="rank"><span class="medal">${medal}</span> ${team.name}</span>
            <span>${getTotal(team)} / 40</span>
        `;

        leaderboard.appendChild(li);

    });

    updateBreakdown(sorted);

}

// =============================
// CRITERIA BREAKDOWN
// =============================

function updateBreakdown(sorted){

    if(teams.length === 0){

        topInnovation.textContent = "--";
        topExecution.textContent = "--";
        return;

    }

    const bestInnovation = [...teams].sort((a,b) => b.scores.innovation - a.scores.innovation)[0];
    const bestExecution = [...teams].sort((a,b) => b.scores.execution - a.scores.execution)[0];

    topInnovation.textContent = `${bestInnovation.name} (${bestInnovation.scores.innovation}/10)`;
    topExecution.textContent = `${bestExecution.name} (${bestExecution.scores.execution}/10)`;

}

// =============================
// DECLARE WINNER
// =============================

declareWinnerBtn.addEventListener("click", () => {

    if(teams.length === 0){

        alert("Add at least one team first.");
        return;

    }

    const sorted = [...teams].sort((a,b) => getTotal(b) - getTotal(a));

    const champion = sorted[0];

    const tied = sorted.filter(t => getTotal(t) === getTotal(champion));

    if(tied.length > 1){

        winnerText.textContent = "Tie: " + tied.map(t => t.name).join(" & ");

    } else {

        winnerText.textContent = "🏆 " + champion.name;

    }

    winnerText.style.animation = "winnerPop .8s ease";

});

// =============================
// GRAPH
// =============================

const ctx = document.getElementById("scoreChart");

const chart = new Chart(ctx,{

    type:"bar",

    data:{

        labels: [],

        datasets: [
            {
                label: "Total Score",
                data: [],
                backgroundColor: "rgba(244,227,127,.75)",
                borderColor: "#f4e37f",
                borderWidth: 2,
                borderRadius: 8
            }
        ]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        scales:{

            y:{

                beginAtZero:true,

                max:40,

                ticks:{ color:"#ddd" },

                grid:{ color:"rgba(255,255,255,.08)" }

            },

            x:{

                ticks:{ color:"#ddd" },

                grid:{ display:false }

            }

        },

        plugins:{

            legend:{

                labels:{ color:"#fff" }

            }

        }

    }

});

function updateGraph(){

    const sorted = [...teams].sort((a,b) => getTotal(b) - getTotal(a));

    chart.data.labels = sorted.map(t => t.name);
    chart.data.datasets[0].data = sorted.map(t => getTotal(t));

    chart.update();

}