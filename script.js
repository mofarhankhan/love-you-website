const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsArea = document.getElementById("buttonsArea");
const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");
const replayBtn = document.getElementById("replayBtn");

let noMoves = 0;

function moveNoButton() {
  const areaRect = buttonsArea.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(10, areaRect.width - btnRect.width - 10);
  const maxY = Math.max(10, areaRect.height - btnRect.height - 10);

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  // Keep some distance from the Yes button when possible
  const yesRect = yesBtn.getBoundingClientRect();
  const localYesX = yesRect.left - areaRect.left;
  const localYesY = yesRect.top - areaRect.top;

  if (Math.abs(x - localYesX) < 120 && Math.abs(y - localYesY) < 70) {
    x = x < areaRect.width / 2 ? maxX : 10;
    y = Math.random() * maxY;
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";

  noMoves++;

  const texts = [
    "No 🙈",
    "Are you sure? 😳",
    "Catch me 😜",
    "Nope 😝",
    "Try again 😂",
    "Wrong choice 😌"
  ];

  noBtn.textContent = texts[Math.min(noMoves, texts.length - 1)];
}

// Desktop
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);

// Mobile/touch: move before the click can register normally
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse") {
    e.preventDefault();
    moveNoButton();
  }
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  launchConfetti();
});

replayBtn.addEventListener("click", () => {
  resultCard.classList.add("hidden");
  questionCard.classList.remove("hidden");
  noMoves = 0;
  noBtn.textContent = "No 🙈";
  noBtn.style.left = window.innerWidth <= 600 ? "60%" : "69%";
  noBtn.style.top = window.innerWidth <= 600 ? "65px" : "52px";
});

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const particles = [];
  const chars = ["💖", "💕", "💗", "✨", "🌸"];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 0.8) * 10,
      gravity: 0.18 + Math.random() * 0.08,
      size: 16 + Math.random() * 15,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.12,
      char: chars[Math.floor(Math.random() * chars.length)],
      life: 1
    });
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vr;
      p.life -= 0.008;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    });

    frame++;
    if (frame < 150) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  animate();
}
