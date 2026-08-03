# ScoreSphere

A simple front-end scoring platform for tracking competitions in real time — Hackathons, Football matches, and Chess games — with live scoreboards, predictions, history logs, and analytics graphs.

## Overview

ScoreSphere is a static, multi-page web app built with plain HTML, CSS, and JavaScript (plus Chart.js for graphs). It has a landing page (`index.html`) that links to three standalone scoring tools:

- **Hackathon** — add teams, judge them across four criteria with sliders, view a live leaderboard, and declare a winner.
- **Football Match** — run a live match with a timer, goal counters, goal history, win prediction, and score graph.
- **Chess Match** — run a chess clock with increments, track captured material, log moves, and view a live prediction and graph.

Each page is self-contained (its own HTML/CSS/JS) and works entirely in the browser — no backend or database required.

## Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. Serve the folder with any local HTTP server (opening the HTML files directly via `file://` may cause issues with fonts/scripts, so a local server is recommended).

   Using Python's built-in server:

   ```bash
   # Python 3
   python -m http.server 8000
   ```

3. Open your browser and go to:

   ```
   http://localhost:8000
   ```

## Navigation

```
index.html          → Landing page, links to all three tools
├── hackathon.html   → Hackathon judging & leaderboard
├── football.html    → Football match scoring
└── chess.html       → Chess clock & match tracker
```

Each page loads its own script and stylesheet (e.g. `hackathon.html` → `hackathon.js` + `hackathon.css`) and can be used independently of the others.

## User Guide

### Hackathon

1. Enter a **Team Name** (required) and an optional **Project Title**, then click **Add Team**.
2. Each added team appears as a card with sliders (0–10) for **Innovation**, **Technical Execution**, **Presentation**, and **Impact/Usefulness**.
3. Adjust the sliders to score a team — the team's total, rank badge, leaderboard, and graph update instantly.
4. Use the **✕** button on a team card to remove it.
5. Check the **Leaderboard** section for ranked standings and the **Criteria Breakdown** for the top scorer in Innovation and Execution.
6. Click **Declare Winner** to announce the top-scoring team (or a tie, if scores match).
7. Click **View Analytics** to scroll to the bar chart comparing all teams' totals.

### Football Match

1. Select a competition type: **Inter University** or **Intra University**.
2. Enter **Team 1** and **Team 2** names, plus optional **Match Time** and **Break Time** (in minutes; defaults to 90 if left blank).
3. Click **Start Match** to begin the timer.
4. Use the **+ / −** buttons under each team to record or undo goals — the score, goal history, and win prediction update automatically.
5. Watch the **Winning Prediction** percentages shift based on the goal difference.
6. When the timer reaches the match length, the match ends automatically, scoring buttons are disabled, and the winner (or draw) is announced.
7. Click **View Analytics** to see the score progression graph over time.

### Chess Match

1. Select a competition type: **Inter University** or **Intra University**.
2. Enter **White Player** and **Black Player** names, choose a **Game Mode** (Rapid/Blitz/Classical), and set an optional **Increment** (seconds added after each move).
3. Click **Start Game** to begin — both clocks are set and White's clock starts running.
4. Click the active player's clock to pass the turn (adds the increment and switches the running clock).
5. Use the **+ / −** buttons to track captured material for each side; the win prediction updates based on material and time difference.
6. Enter a move in the **move notation** box and click **Add Move** (or press Enter) to log it to the move history.
7. Use **Offer Draw**, **Resign Current Turn**, or **Reset Game** to end or restart the game. A player's clock reaching zero ends the game automatically.
8. Click **View Analytics** to see the material progression graph over the course of the game.