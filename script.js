let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isFocus = true;
let timer = null;

const timeEl = document.getElementById("time");
const modeEl = document.getElementById("mode");
const streakEl = document.getElementById("streak");
const distractionEl = document.getElementById("distractions");

let streak = localStorage.getItem("streak") || 0;
let distractions = 0;

streakEl.textContent = streak;

function updateTime() {
  let min = Math.floor(timeLeft / 60);
  let sec = timeLeft % 60;
  timeEl.textContent = `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    timeLeft--;
    updateTime();

    if (timeLeft === 0) {
      clearInterval(timer);
      timer = null;

      if (isFocus) {
        streak++;
        localStorage.setItem("streak", streak);
        streakEl.textContent = streak;
        isFocus = false;
        modeEl.textContent = "Break";
        timeLeft = breakTime;
      } else {
        isFocus = true;
        distractions = 0;
        distractionEl.textContent = distractions;
        modeEl.textContent = "Focus";
        timeLeft = focusTime;
      }
      updateTime();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  pauseTimer();
  isFocus = true;
  timeLeft = focusTime;
  distractions = 0;
  modeEl.textContent = "Focus";
  distractionEl.textContent = distractions;
  updateTime();
}

document.getElementById("start").onclick = startTimer;
document.getElementById("pause").onclick = pauseTimer;
document.getElementById("reset").onclick = resetTimer;

document.getElementById("distractedBtn").onclick = () => {
  distractions++;
  distractionEl.textContent = distractions;
};

// 🎧 Ambient Sound
let currentSound = null;

function playSound(id) {
  stopSound();
  currentSound = document.getElementById(id);
  currentSound.volume = 0.5;
  currentSound.play();
}

function stopSound() {
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }
}

// 🌙 Theme Toggle
const toggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") document.body.classList.add("dark");

toggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

// 💬 Quotes API
async function loadQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("quoteText").textContent =
      `"${data.content}" — ${data.author}`;
  } catch {
    document.getElementById("quoteText").textContent =
      "Stay focused. Success is near.";
  }
}

updateTime();
loadQuote();
