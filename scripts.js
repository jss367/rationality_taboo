const words = [
    {word: 'beach', forbiddenWords: ['ocean', 'sand', 'waves', 'vacation']},
    // Add more words and forbidden words here...
  ];
  
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
  
  // Initialize the game with the first word
  updateWord();
    