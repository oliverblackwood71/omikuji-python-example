const fortunes = [
  {
    rank: 4,
    label: "大吉",
    className: "is-great",
    message: "今日は新しいことを始めるチャンス。小さく試すだけでも、ちゃんと前に進めます。",
  },
  {
    rank: 3,
    label: "中吉",
    className: "is-good",
    message: "落ち着いて進めれば大丈夫。ひとつずつ片付けると、良い流れが作れそうです。",
  },
  {
    rank: 2,
    label: "小吉",
    className: "is-small",
    message: "今日は小さな改善が効く日。気になっていた作業をひとつだけ進めてみましょう。",
  },
  {
    rank: 1,
    label: "末吉",
    className: "is-late",
    message: "無理に急がず、準備を整えると良さそうです。休むことも立派な作戦です。",
  },
];

const ticket = document.querySelector("#ticket");
const drawButton = document.querySelector("#drawButton");
const fortuneResult = document.querySelector("#fortuneResult");
const fortuneMessage = document.querySelector("#fortuneMessage");
const drawCount = document.querySelector("#drawCount");
const bestFortune = document.querySelector("#bestFortune");
const soundButton = document.querySelector("#soundButton");
const confettiLayer = document.querySelector("#confettiLayer");
const brandDots = document.querySelectorAll(".brand-dot");
const historyList = document.querySelector("#historyList");
const resetButton = document.querySelector("#resetButton");
const fortuneCanvas = document.querySelector("#fortune3d");

const storageKey = "omikuji-pocket-state";

let count = 0;
let best = null;
let history = [];
let isDrawing = false;
let audioContext = null;
let bgmTimer = null;
let musicOn = false;

function findFortuneByLabel(label) {
  return fortunes.find((fortune) => fortune.label === label) || null;
}

function saveState() {
  const state = {
    count,
    bestLabel: best ? best.label : null,
    history,
  };

  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "まだ引いていません";
    historyList.append(emptyItem);
    return;
  }

  history.forEach((label) => {
    const item = document.createElement("li");
    item.textContent = label;
    historyList.append(item);
  });
}

function renderState() {
  drawCount.textContent = `${count}回`;
  bestFortune.textContent = best ? best.label : "まだなし";
  renderHistory();
}

function loadState() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    renderState();
    return;
  }

  try {
    const state = JSON.parse(saved);
    count = Number.isInteger(state.count) ? state.count : 0;
    best = state.bestLabel ? findFortuneByLabel(state.bestLabel) : null;
    history = Array.isArray(state.history) ? state.history.slice(0, 5) : [];
  } catch {
    count = 0;
    best = null;
    history = [];
  }

  renderState();
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

function playTone(frequency, startTime, duration, options = {}) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const volume = options.volume ?? 0.05;

  oscillator.type = options.type || "square";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function playMelodyStep(index = 0) {
  if (!musicOn) {
    return;
  }

  const context = getAudioContext();
  const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880, 783.99];
  const bass = [261.63, 329.63, 392, 329.63];
  const now = context.currentTime;

  playTone(melody[index % melody.length], now, 0.16, { volume: 0.035, type: "triangle" });

  if (index % 2 === 0) {
    playTone(bass[index % bass.length], now, 0.18, { volume: 0.025, type: "square" });
  }

  brandDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-pulsing", dotIndex === index % brandDots.length);
  });

  bgmTimer = window.setTimeout(() => playMelodyStep(index + 1), 260);
}

async function startMusic() {
  const context = getAudioContext();
  await context.resume();
  musicOn = true;
  soundButton.textContent = "BGM ON";
  soundButton.setAttribute("aria-pressed", "true");
  playMelodyStep();
}

function stopMusic() {
  musicOn = false;
  soundButton.textContent = "BGM OFF";
  soundButton.setAttribute("aria-pressed", "false");

  if (bgmTimer) {
    window.clearTimeout(bgmTimer);
    bgmTimer = null;
  }

  brandDots.forEach((dot) => dot.classList.remove("is-pulsing"));
}

function playDrawSound() {
  if (!musicOn) {
    return;
  }

  const context = getAudioContext();
  const now = context.currentTime;
  playTone(440, now, 0.08, { volume: 0.07, type: "square" });
  playTone(660, now + 0.08, 0.08, { volume: 0.07, type: "square" });
  playTone(880, now + 0.16, 0.14, { volume: 0.08, type: "triangle" });
}

function pickFortune() {
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}

function updateBest(fortune) {
  if (!best || fortune.rank > best.rank) {
    best = fortune;
  }

  bestFortune.textContent = best.label;
}

function setTicketClass(className) {
  ticket.classList.remove("is-great", "is-good", "is-small", "is-late");
  ticket.classList.add(className);
}

function revealTicket() {
  ticket.classList.remove("is-revealed");
  void ticket.offsetWidth;
  ticket.classList.add("is-revealed");
}

function sparkleTicket() {
  ticket.classList.remove("is-sparkling");
  void ticket.offsetWidth;
  ticket.classList.add("is-sparkling");

  window.setTimeout(() => {
    ticket.classList.remove("is-sparkling");
  }, 560);
}

function launchConfetti() {
  const colors = ["#f04f4f", "#2f80ed", "#ffd84d", "#2dbf78", "#ffffff"];

  for (let i = 0; i < 48; i += 1) {
    const piece = document.createElement("span");
    const color = colors[i % colors.length];
    const left = Math.random() * 100;
    const drift = (Math.random() * 180 - 90).toFixed(0);
    const spin = (Math.random() * 720 + 180).toFixed(0);
    const duration = Math.floor(Math.random() * 800 + 1000);

    piece.className = "confetti-piece";
    piece.style.left = `${left}vw`;
    piece.style.background = color;
    piece.style.setProperty("--drift", `${drift}px`);
    piece.style.setProperty("--spin", `${spin}deg`);
    piece.style.setProperty("--fall-duration", `${duration}ms`);
    confettiLayer.append(piece);

    window.setTimeout(() => piece.remove(), duration + 150);
  }
}

function drawFortune() {
  if (isDrawing) {
    return;
  }

  window.dispatchEvent(new CustomEvent("omikuji:draw-start"));
  playDrawSound();
  isDrawing = true;
  drawButton.disabled = true;
  drawButton.classList.add("is-pressed");
  ticket.classList.add("is-drawing");
  fortuneResult.textContent = "抽選中...";
  fortuneMessage.textContent = "箱をシャカシャカ振っています。";

  window.setTimeout(() => {
    const fortune = pickFortune();

    count += 1;
    fortuneResult.textContent = fortune.label;
    fortuneMessage.textContent = fortune.message;
    updateBest(fortune);
    history = [fortune.label, ...history].slice(0, 5);
    saveState();
    renderState();
    setTicketClass(fortune.className);
    revealTicket();
    sparkleTicket();

    if (fortune.label === "大吉") {
      launchConfetti();
    }

    window.dispatchEvent(
      new CustomEvent("omikuji:draw-result", {
        detail: { label: fortune.label },
      }),
    );
    ticket.classList.remove("is-drawing");
    drawButton.classList.remove("is-pressed");
    drawButton.disabled = false;
    isDrawing = false;
  }, 720);
}

function resetState() {
  count = 0;
  best = null;
  history = [];
  localStorage.removeItem(storageKey);
  renderState();
}

function renderGameToText() {
  return JSON.stringify({
    mode: isDrawing ? "drawing" : "ready",
    drawCount: count,
    best: best ? best.label : null,
    currentResult: fortuneResult.textContent,
    history,
  });
}

loadState();
window.render_game_to_text = renderGameToText;
drawButton.addEventListener("click", drawFortune);
fortuneCanvas.addEventListener("click", drawFortune);
resetButton.addEventListener("click", resetState);
soundButton.addEventListener("click", async () => {
  if (musicOn) {
    stopMusic();
    return;
  }

  await startMusic();
});
