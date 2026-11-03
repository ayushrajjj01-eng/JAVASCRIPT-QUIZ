
const startBtn = document.getElementById("startBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const quizScreen = document.getElementById("quizScreen");
const themeToggle = document.getElementById("themeToggle");

startBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeToggle.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
});
