// Klickspel: håller koll på poäng och tid, avslutar spelet efter 60 sekunder
// och sparar/hämtar resultat från en resultattavla via API
let score = 0;
let timeLeft = 60;
let gameStarted = false;
let gameEnded = false;
let interval = null;

// DIN GOOGLE APPS SCRIPT-LÄNK
const postUrl = "https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/";
const getUrl = "https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec";

// Hämta element
let button = document.getElementById("clickButton"); // Hämtar knappen som spelaren klickar på
let scoreText = document.getElementById("score"); // Visar spelarens nuvarande poäng
let timerText = document.getElementById("timer"); // Visar hur mycket tid som är kvar
let finalResult = document.getElementById("finalResult"); // Visar slutpoängen när spelet är över
let gameOverBox = document.getElementById("gameOverBox"); // Rutan som visas när spelet är slut
let playerName = document.getElementById("playerName"); // Inputfält där spelaren skriver sitt namn
let message = document.getElementById("message"); // Visar meddelanden till spelaren (t.ex. sparat resultat)
let leaderboardPopup = document.getElementById("leaderboardPopup"); // Popupen för resultattavlan
let leaderboardList = document.getElementById("leaderboardList"); // Listan där toppresultaten visas

// Hanterar klick: startar spelet första gången och ökar poängen så länge spelet inte är slut
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

    const response = await fetch(postUrl, {
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

// Hämta resultattavlan från Google Sheet
async function showLeaderboard() {
  leaderboardList.innerHTML = "<p>Laddar...</p>";

  leaderboardPopup.classList.add("show");

  try {
    const response = await fetch(getUrl);
    const data = await response.json();

    leaderboardList.innerHTML = "";

    // Sorterar resultaten så att högsta poäng visas först och tar ut topp 10
    const topTen = data
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, 10);

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
