async function fetchVersion() {
  const response = await fetch('version.json');
  const versionData = await response.json();
  return versionData.version;
}

document.addEventListener("DOMContentLoaded", () => {
  const wordElement = document.getElementById("word");
  const forbiddenWordsElement = document.getElementById("forbidden-words");

  const team1ScoreElement = document.getElementById("team1-score");
  const team2ScoreElement = document.getElementById("team2-score");
  const timerElement = document.getElementById("time-remaining");
  const settingsButton = document.getElementById("settings-button");
  const settingsModal = document.getElementById("settings-modal");
  const closeModal = document.querySelector(".close");
  const timerInput = document.getElementById("timer");
  const skipPenaltyInput = document.getElementById("skip-penalty");

  const soundInput = document.getElementById("sound");
  const beep = new Audio("beep.mp3");

  let team1Score = 0;
  let team2Score = 0;
  let currentTeam = 1;
  let timeRemaining = parseInt(timerElement.textContent, 10);
  let timer;

  async function fetchWords() {
    const response = await fetch("words.json");
    const wordsData = await response.json();
    return wordsData;
  }

  function updateWord() {
    if (words.length === 0) {
      gameOver();
      return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const wordData = words[randomIndex];
    words.splice(randomIndex, 1); // Remove the used word from the array

    wordElement.innerHTML = ""; // Clear the existing content
    wordData.word.split(" ").forEach((wordPart) => {
      const span = document.createElement("span");
      span.textContent = wordPart;
      span.style.margin = "0 5px";
      wordElement.appendChild(span);
    });
    forbiddenWordsElement.innerHTML = "";
    wordData.forbiddenWords.forEach((forbiddenWord) => {
      const listItem = document.createElement("li");
      listItem.textContent = forbiddenWord;
      forbiddenWordsElement.appendChild(listItem);
    });
  }

  function updateScore() {
    if (currentTeam === 1) {
      team1Score++;
      team1ScoreElement.textContent = team1Score;
    } else {
      team2Score++;
      team2ScoreElement.textContent = team2Score;
    }
  }

  function deductScore() {
    if (currentTeam === 1) {
      team1Score--;
      team1ScoreElement.textContent = team1Score;
    } else {
      team2Score--;
      team2ScoreElement.textContent = team2Score;
    }
  }

  function switchTeam() {
    currentTeam = currentTeam === 1 ? 2 : 1;
  }

  function playBeep() {
    if (soundInput.checked) {
      beep.play();
    }
  }

  function startTimer() {
    timerElement.textContent = timeRemaining;
    timer = setInterval(() => {
      timeRemaining--;
      timerElement.textContent = timeRemaining;
      if (timeRemaining <= 0) {
        clearInterval(timer);
        playBeep();
      }
    }, 1000);
  }

  function gameOver() {
    clearInterval(timer);
    alert(`Game over!\nTeam 1 score: ${team1Score}\nTeam 2 score: ${team2Score}`);
  }

  let words = [];
  fetchWords().then((data) => {
    words = data;
    updateWord();
    startTimer();
  });

  document.getElementById("next").addEventListener("click", () => {
    updateScore();
    updateWord();
  });

  document.getElementById("skip-word").addEventListener("click", () => {
    if (skipPenaltyInput.checked) {
      deductScore();
    }
    updateWord();
  });

  document.getElementById("switch-team").addEventListener("click", () => {
    clearInterval(timer);
    switchTeam();
    timeRemaining = parseInt(timerInput.value, 10);
    startTimer();
  });

  settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      settingsModal.style.display = "none";
    }
  });

  // Fetch and display the version number
  fetchVersion().then((version) => {
    const versionElement = document.getElementById('version');
    versionElement.textContent = `Version ${version}`;
  });
});
