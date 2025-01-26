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
    const response1 = fetch("words.json");
    const response2 = fetch("words2.json");

    const [wordsData1, wordsData2] = await Promise.all([
      response1.then((res) => res.json()),
      response2.then((res) => res.json()),
    ]);

    return wordsData1.concat(wordsData2);
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

  function updateTeamDisplay() {
    const team1Display = document.getElementById('team1-score').parentElement;
    const team2Display = document.getElementById('team2-score').parentElement;

    if (currentTeam === 1) {
      team1Display.classList.add('active-team');
      team1Display.classList.remove('inactive-team');
      team2Display.classList.add('inactive-team');
      team2Display.classList.remove('active-team');
    } else {
      team2Display.classList.add('active-team');
      team2Display.classList.remove('inactive-team');
      team1Display.classList.add('inactive-team');
      team1Display.classList.remove('active-team');
    }
  }

  function switchTeam() {
    currentTeam = currentTeam === 1 ? 2 : 1;
    updateTeamDisplay();
  }

  function playBeep() {
    if (soundInput.checked) {
      beep.play();
    }
  }

  function updateTimer() {
    timeRemaining--;
    timerElement.textContent = timeRemaining;

    // Remove any existing classes
    timerElement.classList.remove('time-warning', 'time-critical');

    // Add appropriate class based on time remaining
    if (timeRemaining <= 10) {
      timerElement.classList.add('time-critical');
    } else if (timeRemaining <= 30) {
      timerElement.classList.add('time-warning');
    }
  }

  // Replace your existing timer interval with this:
  function startTimer() {
    timerElement.textContent = timeRemaining;
    timer = setInterval(() => {
      updateTimer();
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

  updateTeamDisplay();
});
