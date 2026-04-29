let score = 0;
let timeLeft = 60;
let gameStarted = false;
let gameEnded = false;
let interval = null;

// DIN GOOGLE APPS SCRIPT-LÄNK
const apiUrl = "https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/";

// Hämta element
let button = document.getElementById("clickButton");
let scoreText = document.getElementById("score");
let timerText = document.getElementById("timer");
let finalResult = document.getElementById("finalResult");
let gameOverBox = document.getElementById("gameOverBox");
let playerName = document.getElementById("playerName");
let message = document.getElementById("message");
let leaderboardPopup = document.getElementById("leaderboardPopup");
let leaderboardList = document.getElementById("leaderboardList");


// Klick på spelknappen
button.onclick = function () {
  if (gameStarted === false) {
    startGame();
    gameStarted = true;
  }

  if (gameEnded === true) {
    return;
  }

  score++;
  console.log(score);
  scoreText.innerText = score;
};

// Starta spelet
function startGame() {
  interval = setInterval(countdown, 1000);
}

// Nedräkning
function countdown() {
  timeLeft--;
  timerText.innerText = timeLeft;

  if (timeLeft <= 0) {
    timerText.innerText = 0;
    endGame();
  }
}

// När spelet är slut
function endGame() {
  gameEnded = true;
  clearInterval(interval);

  button.disabled = true;
  finalResult.innerText = "Din poäng: " + score;

  gameOverBox.classList.add("show");
}

// Spara resultat i Google Sheet
async function saveScore() {
  let name = playerName.value.trim();

  if (name === "") {
    message.innerText = "Skriv ditt namn först!";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("score", score);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Kunde inte spara resultatet");
    }

    message.innerText = "Resultatet sparades!";
    showLeaderboard();

  } catch (error) {
    console.error(error);
    message.innerText = "Kunde inte spara resultatet.";
  }
}

// Hämta leaderboard från Google Sheet
async function showLeaderboard() {
  leaderboardList.innerHTML = "<p>Laddar...</p>";

  leaderboardPopup.classList.add("show");

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    leaderboardList.innerHTML = "";

    // Visa topp 10
    const topTen = data.slice(0, 10);

    for (let i = 0; i < topTen.length; i++) {
      leaderboardList.innerHTML += `
        <p>${i + 1}. ${topTen[i].name} - ${topTen[i].score}</p>
      `;
    }

  } catch (error) {
    console.error(error);
    leaderboardList.innerHTML = "<p>Kunde inte hämta leaderboard.</p>";
  }
}

// Starta om
function restartGame() {
  location.reload();
}
