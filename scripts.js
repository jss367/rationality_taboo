const wordElement = document.getElementById('word-to-guess');
const forbiddenWordsElement = document.getElementById('forbidden-words');
const nextButton = document.getElementById('next-word');
const gotItButton = document.getElementById('got-it');
const skipWordButton = document.getElementById('skip-word');
const switchPlayerButton = document.getElementById('switch-player');
const currentTeamElement = document.getElementById('current-team');
const team1ScoreElement = document.getElementById('team-1-score');
const team2ScoreElement = document.getElementById('team-2-score');
const settingsButton = document.getElementById('settings-button');
const closeSettingsButton = document.getElementById('close-settings');
const settingsMenu = document.getElementById('settings-menu');
const roundDurationInput = document.getElementById('round-duration');
const skipPenaltyCheckbox = document.getElementById('skip-penalty');

const words = [
  // ... (your words and forbidden words here)
];

let currentWordIndex = -1;
let currentTeam = 1;
let team1Score = 0;
let team2Score = 0;
let defaultTime = 30;
let timeRemaining = defaultTime;
let timerInterval;

function updateWord() {
  currentWordIndex++;
  if (currentWordIndex >= words.length) {
    currentWordIndex = 0;
  }
  const word = words[currentWordIndex];
  wordElement.textContent = word.word;
  forbiddenWordsElement.innerHTML = '';
  word.forbiddenWords.forEach((forbiddenWord) => {
    const li = document.createElement('li');
    li.textContent = forbiddenWord;
    forbiddenWordsElement.appendChild(li);
  });
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeRemaining = defaultTime;
  timeRemainingElement.textContent = timeRemaining;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timeRemainingElement.textContent = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      // Optionally, add any actions you want to perform when the timer runs out
    }
  }, 1000);
}

nextButton.addEventListener('click', updateWord);

gotItButton.addEventListener('click', () => {
  if (currentTeam === 1) {
    team1Score++;
    team1ScoreElement.textContent = team1Score;
  } else {
    team2Score++;
    team2ScoreElement.textContent = team2Score;
  }
  updateWord();
});

skipWordButton.addEventListener('click', () => {
  if (skipPenaltyCheckbox.checked) {
    if (currentTeam === 1) {
      team1Score--;
      team1ScoreElement.textContent = team1Score;
    } else {
      team2Score--;
      team2ScoreElement.textContent = team2Score;
    }
  }
  updateWord();
});

switchPlayerButton.addEventListener('click', () => {
  currentTeam = currentTeam === 1 ? 2 : 1;
  currentTeamElement.textContent = currentTeam;
  startTimer();
});

settingsButton.addEventListener('click', () => {
  settingsMenu.style.display = 'block';
});

closeSettingsButton.addEventListener('click', () => {
  settingsMenu.style.display = 'none';
  defaultTime = parseInt(roundDurationInput.value, 10);
});

updateWord();
