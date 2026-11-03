
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
        question: "Which HTML tag is used to connect an external JavaScript file?",
        options: ["<javascript>", "<link>", "<script>", "<code>"],
        answer: 2
    }
];

const startBtn = document.getElementById("startBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const themeToggle = document.getElementById("themeToggle");
const questionCounter = document.getElementById("questionCounter");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedback = document.getElementById("feedback");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

function calculateScore() {
    return userAnswers.reduce((score, answer, index) => {
        return score + (answer === questions[index].answer ? 1 : 0);
    }, 0);
}

function renderQuestion() {
    const question = questions[currentQuestion];
    const selectedAnswer = userAnswers[currentQuestion];

    questionCounter.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreDisplay.textContent = `Score: ${calculateScore()}`;
    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";
    feedback.textContent = "";

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
        optionsContainer.appendChild(button);
    });

    if (selectedAnswer !== null) {
        const isCorrect = selectedAnswer === question.answer;

        feedback.textContent = isCorrect
            ? "Correct answer!"
            : `Incorrect. Correct answer: ${question.options[question.answer]}`;

        feedback.style.color = isCorrect ? "#16a34a" : "#dc2626";
    }

    previousBtn.disabled = currentQuestion === 0;

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question →";
}

function selectAnswer(selectedIndex) {
    if (userAnswers[currentQuestion] !== null) return;

    userAnswers[currentQuestion] = selectedIndex;
    renderQuestion();
}

function startQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);

    welcomeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    renderQuestion();
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
}

startBtn.addEventListener("click", startQuiz);

previousBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});

nextBtn.addEventListener("click", () => {
    if (userAnswers[currentQuestion] === null) {
        feedback.textContent = "Please select an answer first.";
        feedback.style.color = "#dc2626";
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResults();
    }
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeToggle.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
});
