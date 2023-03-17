let words = [];

const wordElement = document.getElementById('word');
const forbiddenWordsElement = document.getElementById('forbidden-words');
const nextWordButton = document.getElementById('next-word');

function generateRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function updateWord() {
  const randomIndex = generateRandomIndex(words.length);
  const wordObject = words[randomIndex];

  wordElement.textContent = wordObject.word;

  forbiddenWordsElement.innerHTML = '';
  wordObject.forbiddenWords.forEach(forbiddenWord => {
    const listItem = document.createElement('li');
    listItem.textContent = forbiddenWord;
    forbiddenWordsElement.appendChild(listItem);
  });
}

nextWordButton.addEventListener('click', updateWord);

// Fetch the words data from words.json and initialize the game
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data;
    updateWord();
  })
  .catch(error => {
    console.error('Error fetching words data:', error);
  });
