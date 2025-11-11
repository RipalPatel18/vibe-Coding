const game = document.getElementById('game');
const snail = document.getElementById('snail');
const toast = document.getElementById('toast');
const clicksEl = document.getElementById('clicks');
const speedEl = document.getElementById('speed');
const restart = document.getElementById('restart');

let clicks = 0;
let speed = 20; // px/s
let dir = 1;
let x = 0;
let yPct = 55;
let rafId = null;
let last = performance.now();

function placeSnail() {
  snail.style.left = `${x}px`;
  snail.style.top = `${yPct}%`;
}

function showToast(text = "Too slow!") {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 900);
}

function tick(now) {
  const dt = (now - last) / 1000;
  last = now;
  const W = game.clientWidth;

  yPct = 55 + Math.sin(now / 900) * 5;
  x += dir * speed * dt;

  const margin = 28;
  if (x > W - margin) { x = W - margin; dir = -1; snail.style.transform = 'scaleX(-1)'; }
  if (x < margin) { x = margin; dir = 1; snail.style.transform = 'scaleX(1)'; }

  placeSnail();
  rafId = requestAnimationFrame(tick);
}

snail.addEventListener('click', e => {
  e.stopPropagation();
  clicks++;
  clicksEl.textContent = clicks;
  showToast('Too slow!');
  speed = Math.min(speed + 6, 120);
  speedEl.textContent = Math.round(speed);
  x += dir * 24;
});

restart.addEventListener('click', () => {
  clicks = 0; clicksEl.textContent = 0;
  speed = 20; speedEl.textContent = 20;
  dir = Math.random() < 0.5 ? -1 : 1;
  snail.style.transform = dir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
  x = dir === 1 ? 28 : game.clientWidth - 28;
  yPct = 55;
  placeSnail();
  showToast('Good luck… (you can’t win)');
});

window.addEventListener('resize', () => {
  x = Math.max(20, Math.min(game.clientWidth - 20, x));
  placeSnail();
});

x = 28;
placeSnail();
requestAnimationFrame(tick);
