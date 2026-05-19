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

let count = 0;
let best = null;
let isDrawing = false;

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

function drawFortune() {
  if (isDrawing) {
    return;
  }

  isDrawing = true;
  drawButton.disabled = true;
  drawButton.classList.add("is-pressed");
  ticket.classList.add("is-drawing");
  fortuneResult.textContent = "抽選中...";
  fortuneMessage.textContent = "箱をシャカシャカ振っています。";

  window.setTimeout(() => {
    const fortune = pickFortune();

    count += 1;
    drawCount.textContent = `${count}回`;
    fortuneResult.textContent = fortune.label;
    fortuneMessage.textContent = fortune.message;
    updateBest(fortune);
    setTicketClass(fortune.className);

    ticket.classList.remove("is-drawing");
    drawButton.classList.remove("is-pressed");
    drawButton.disabled = false;
    isDrawing = false;
  }, 720);
}

drawButton.addEventListener("click", drawFortune);
