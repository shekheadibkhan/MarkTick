function startQuiz() {
    let name = document.getElementById('username').value;
    if (name.trim() !== "") {
      localStorage.setItem('username', name);
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('quiz-container').style.display = 'block';
      loadQuestion();
    } else {
      alert("Please enter your name to continue.");
    }
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function generateOptions(base) {
    const options = new Set();
    while (options.size < 10) {
      options.add(base + Math.floor(Math.random() * 20)); // diverse numbers
    }
    return Array.from(options);
  }

  function getRandomOptions(options, correctAnswer, count) {
    const filtered = options.filter(opt => opt !== correctAnswer);
    const selected = shuffleArray(filtered).slice(0, count - 1);
    selected.push(correctAnswer);
    return shuffleArray(selected);
  }

  const allQuestions = Array.from({ length: 100 }, (_, i) => {
    const correctAnswer = (i + 1) * 2;
    const allOptions = generateOptions(i + 1);
    const finalOptions = getRandomOptions(allOptions, correctAnswer, 4);

    return {
      question: `What is ${i + 1} + ${i + 1}?`,
      correctAnswer: correctAnswer,
      options: finalOptions
    };
  });

  const questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 20);

  let currentQuestionIndex = 0;
  let score = 0;
  let timer, timeLeft = 60;

  function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
      clearInterval(timer);
      document.getElementById('quiz-container-content').innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Final Score: ${score}/${questions.length}</p>
      `;
      document.getElementById('timer').textContent = "Quiz Completed";
      document.getElementById('next-btn').disabled = true;
      return;
    }

    clearInterval(timer);
    timeLeft = 60;

    const currentQuestion = questions[currentQuestionIndex];
    const quizContainer = document.getElementById('quiz-container-content');
    const timerDisplay = document.getElementById('timer');
    const nextButton = document.getElementById('next-btn');
    nextButton.disabled = true;

    quizContainer.innerHTML = `
      <div class="question-block">
        <h2>Question ${currentQuestionIndex + 1}: ${currentQuestion.question}</h2>
        ${currentQuestion.options.map(option => `
          <label>
            <input type="radio" name="answer" value="${option}" />
            ${option}
          </label>
        `).join('')}
      </div>
    `;

    document.querySelectorAll('input[name="answer"]').forEach(input => {
      input.addEventListener('change', () => {
        nextButton.disabled = false;
      });
    });

    timerDisplay.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time: ${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(timer);
        nextQuestion();
      }
    }, 1000);
  }

  function nextQuestion() {
    clearInterval(timer);
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected && parseInt(selected.value) === questions[currentQuestionIndex].correctAnswer) {
      score++;
    }
    currentQuestionIndex++;
    loadQuestion();
  }

  document.getElementById('next-btn').addEventListener('click', nextQuestion);
