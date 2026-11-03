
const questions = [
    {
        question: "Which language is used to structure a web page?",
        options: ["CSS", "HTML", "JavaScript", "Python"],
        answer: 1
    },
    {
        question: "Which CSS property changes text color?",
        options: ["font-style", "background", "color", "text-align"],
        answer: 2
    },
    {
        question: "Which keyword declares a block-scoped variable in JavaScript?",
        options: ["var", "let", "define", "static"],
        answer: 1
    },
    {
        question: "Which method selects an element by its ID?",
        options: [
            "document.querySelectorAll()",
            "document.getElementsByClassName()",
            "document.getElementById()",
            "document.createElement()"
        ],
        answer: 2
    },
    {
        question: "Which symbol is used for strict equality?",
        options: ["=", "==", "===", "!="],
        answer: 2
    },
    {
        question: "Which method adds an element to the end of an array?",
        options: ["pop()", "push()", "shift()", "slice()"],
        answer: 1
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Creative Style Sheets",
            "Computer Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        answer: 2
    },
    {
        question: "Which event occurs when a user clicks an HTML element?",
        options: ["change", "hover", "click", "submit"],
        answer: 2
    },
    {
        question: "Which method converts JSON text into a JavaScript object?",
        options: [
            "JSON.stringify()",
            "JSON.parse()",
            "JSON.convert()",
            "JSON.object()"
        ],
        answer: 1
    },
    {
        question: "Which HTML tag connects an external JavaScript file?",
        options: ["<javascript>", "<link>", "<script>", "<code>"],
        answer: 2
    }
];

const elements = {
    startBtn: document.getElementById("startBtn"),
    welcomeScreen: document.getElementById("welcomeScreen"),
    quizScreen: document.getElementById("quizScreen"),
    resultScreen: document.getElementById("resultScreen"),
    themeToggle: document.getElementById("themeToggle"),
    questionCounter: document.getElementById("questionCounter"),
    scoreDisplay: document.getElementById("scoreDisplay"),
    progressBar: document.getElementById("progressBar"),
    progressTrack: document.getElementById("progressTrack"),
    questionText: document.getElementById("questionText"),
    optionsContainer: document.getElementById("optionsContainer"),
    feedback: document.getElementById("feedback"),
    previousBtn: document.getElementById("previousBtn"),
    nextBtn: document.getElementById("nextBtn"),
    finalScore: document.getElementById("finalScore"),
    percentage: document.getElementById("percentage"),
    resultMessage: document.getElementById("resultMessage"),
    resultDescription: document.getElementById("resultDescription"),
    bestScore: document.getElementById("bestScore"),
    restartBtn: document.getElementById("restartBtn"),
    reviewBtn: document.getElementById("reviewBtn"),
    reviewContainer: document.getElementById("reviewContainer"),
    reviewList: document.getElementById("reviewList")
};

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

function getStoredNumber(key) {
    try {
        const value = Number(localStorage.getItem(key));
        return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
        return 0;
    }
}

function calculateScore() {
    return userAnswers.reduce((score, answer, index) => {
        return score + (answer === questions[index].answer ? 1 : 0);
    }, 0);
}

function renderQuestion() {
    const question = questions[currentQuestion];
    const selectedAnswer = userAnswers[currentQuestion];

    elements.questionCounter.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    elements.scoreDisplay.textContent = `Score: ${calculateScore()}`;

    const progress = currentQuestion + 1;

    elements.progressBar.style.width =
        `${(progress / questions.length) * 100}%`;

    elements.progressTrack.setAttribute("aria-valuenow", progress);

    elements.questionText.textContent = question.question;
    elements.optionsContainer.innerHTML = "";
    elements.feedback.textContent = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "option";
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

        if (selectedAnswer !== null) {
            button.disabled = true;

            if (index === selectedAnswer) {
                button.classList.add("selected");
            }
        }

        button.addEventListener("click", () => selectAnswer(index));

        elements.optionsContainer.appendChild(button);
    });

    if (selectedAnswer !== null) {
        const isCorrect = selectedAnswer === question.answer;

        elements.feedback.textContent = isCorrect
            ? "Correct answer!"
            : `Incorrect. Correct answer: ${question.options[question.answer]}`;

        elements.feedback.style.color = isCorrect ? "#16a34a" : "#dc2626";
    }

    elements.previousBtn.disabled = currentQuestion === 0;

    elements.nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question →";
}

function selectAnswer(selectedIndex) {
    if (userAnswers[currentQuestion] !== null) {
        return;
    }

    userAnswers[currentQuestion] = selectedIndex;
    renderQuestion();
}

function startQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);

    elements.welcomeScreen.classList.add("hidden");
    elements.resultScreen.classList.add("hidden");
    elements.quizScreen.classList.remove("hidden");

    elements.reviewContainer.classList.add("hidden");
    elements.reviewBtn.textContent = "Review Answers";
    elements.reviewBtn.setAttribute("aria-expanded", "false");

    renderQuestion();
}

function showResults() {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    const savedBestScore = getStoredNumber("quizzyBestScore");
    const bestScore = Math.max(score, savedBestScore);

    try {
        localStorage.setItem("quizzyBestScore", String(bestScore));
    } catch {
        // The current result can still be displayed if storage is unavailable.
    }

    elements.quizScreen.classList.add("hidden");
    elements.resultScreen.classList.remove("hidden");

    elements.finalScore.textContent = `${score}/${questions.length}`;
    elements.percentage.textContent = `${percentage}%`;
    elements.bestScore.textContent = `${bestScore}/${questions.length}`;

    if (percentage === 100) {
        elements.resultMessage.textContent = "Perfect Score!";
        elements.resultDescription.textContent =
            "Outstanding! You answered every question correctly.";
    } else if (percentage >= 70) {
        elements.resultMessage.textContent = "Great Work!";
        elements.resultDescription.textContent =
            "Excellent performance. Keep learning and improving.";
    } else if (percentage >= 40) {
        elements.resultMessage.textContent = "Good Effort!";
        elements.resultDescription.textContent =
            "You're making progress. Keep practicing.";
    } else {
        elements.resultMessage.textContent = "Keep Practicing!";
        elements.resultDescription.textContent =
            "Review your answers and try again. You can improve.";
    }

    renderReview();
}

function renderReview() {
    elements.reviewList.innerHTML = "";

    questions.forEach((question, index) => {
        const selectedAnswer = userAnswers[index];
        const isCorrect = selectedAnswer === question.answer;

        const item = document.createElement("article");
        item.className = "review-item";

        const heading = document.createElement("h3");
        heading.textContent = `${index + 1}. ${question.question}`;

        const yourAnswer = document.createElement("p");

        yourAnswer.textContent = `Your answer: ${
            selectedAnswer === null
                ? "Not answered"
                : question.options[selectedAnswer]
        }`;

        const correctAnswer = document.createElement("p");

        correctAnswer.textContent =
            `Correct answer: ${question.options[question.answer]}`;

        const status = document.createElement("span");

        status.className = isCorrect ? "correct-status" : "wrong-status";
        status.textContent = isCorrect ? "Correct" : "Incorrect";

        item.append(heading, yourAnswer, correctAnswer, status);
        elements.reviewList.appendChild(item);
    });
}

function loadTheme() {
    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("quizzyTheme") || "light";
    } catch {
        savedTheme = "light";
    }

    document.body.classList.toggle("dark", savedTheme === "dark");

    elements.themeToggle.textContent =
        savedTheme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    try {
        localStorage.setItem("quizzyTheme", theme);
    } catch {
        // Theme still changes for the current session.
    }

    elements.themeToggle.textContent =
        theme === "dark" ? "☀️" : "🌙";
}

elements.startBtn.addEventListener("click", startQuiz);

elements.previousBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});

elements.nextBtn.addEventListener("click", () => {
    if (userAnswers[currentQuestion] === null) {
        elements.feedback.textContent = "Please select an answer first.";
        elements.feedback.style.color = "#dc2626";
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResults();
    }
});

elements.restartBtn.addEventListener("click", startQuiz);

elements.reviewBtn.addEventListener("click", () => {
    const isHidden = elements.reviewContainer.classList.toggle("hidden");

    elements.reviewBtn.textContent =
        isHidden ? "Review Answers" : "Hide Review";

    elements.reviewBtn.setAttribute("aria-expanded", String(!isHidden));
});

elements.themeToggle.addEventListener("click", toggleTheme);

loadTheme();

elements.bestScore.textContent =
    `${getStoredNumber("quizzyBestScore")}/${questions.length}`;
