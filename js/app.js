// Click a button or object to earn points so that I can increase my score.
// See my current score during the game so that I know how well I am doing.
// See a countdown timer so that I know how much time is left.

let score = 0;
let timeLeft = 60;
let hasSaved = false;

// Hämta element
let button = document.getElementById("clickButton");
let scoreText = document.getElementById("score");
let timerText = document.getElementById("timer");


// Klick
button.onclick = function () {
  score = score + 1;
  scoreText.innerText = score;
};

// Timer
let timer = setInterval(function () {
  timeLeft = timeLeft - 1;
  timerText.innerText = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame();
  }
}, 1000);

// När spelet är slut
function endGame() {
  button.disabled = true;
  timerText.innerText = 0;
  finalResult.innerText = "Din poäng: " + score;
}


