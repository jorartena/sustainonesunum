import { deck } from '../shared/content.js';

const deckEl = document.getElementById('deck');
const dotsEl = document.getElementById('nav-dots');
const counterEl = document.getElementById('slide-counter');
const progressEl = document.getElementById('progress-bar');
const slides = deck.slides;
const total = slides.length;
let current = 0;

function renderCard(item) {
  return `<div class="card"><h3>${item.label}</h3><p>${item.detail}</p></div>`;
}

function renderSlideContent(slide) {
  switch (slide.kind) {
    case 'cover':
      return `
        <p class="eyebrow">${slide.eyebrow}</p>
        <h1>${slide.title}</h1>
        <h2>${slide.subtitle}</h2>
        <p class="body">${slide.body}</p>`;
    case 'timeline':
      return `
        <h1>${slide.title}</h1>
        <p class="intro">${slide.intro}</p>
        <ol class="timeline">
          ${slide.milestones
            .map(
              (m) => `
            <li>
              <span class="date">${m.date}</span>
              <h3>${m.label}</h3>
              <p>${m.detail}</p>
            </li>`
            )
            .join('')}
        </ol>`;
    case 'steps':
      return `
        <h1>${slide.title}</h1>
        <ol class="steps">
          ${slide.steps
            .map(
              (s) => `
            <li>
              <span class="n">${s.n}</span>
              <h3>${s.label}</h3>
              <p>${s.detail}</p>
            </li>`
            )
            .join('')}
        </ol>`;
    case 'cards':
      return `
        <h1>${slide.title}</h1>
        ${slide.intro ? `<p class="intro">${slide.intro}</p>` : ''}
        <div class="cards">${slide.cards.map(renderCard).join('')}</div>
        ${slide.footer ? `<p class="footer">${slide.footer}</p>` : ''}`;
    case 'costs':
      return `
        <h1>${slide.title}</h1>
        <div class="cards summary">
          ${slide.summary
            .map((s) => `<div class="card"><h3>${s.value}</h3><p>${s.label}</p></div>`)
            .join('')}
        </div>
        <button class="detail-toggle" type="button" aria-expanded="false">Detayları göster</button>
        <div class="detail-panel">
          <table>
            <thead><tr>${slide.detailColumns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
            <tbody>
              ${slide.detailRows
                .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
                .join('')}
            </tbody>
          </table>
        </div>`;
    case 'why':
      return `
        <h1>${slide.title}</h1>
        <div class="cards why">
          ${slide.blocks.map((b) => `<div class="card"><h3>${b.q}</h3><p>${b.a}</p></div>`).join('')}
        </div>
        <p class="footer">${slide.footer}</p>`;
    default:
      return '';
  }
}

function buildSlides() {
  deckEl.innerHTML = slides
    .map(
      (slide, i) => `
      <section class="slide" id="slide-${i + 1}" data-index="${i}">
        <div class="slide-inner">${renderSlideContent(slide)}</div>
      </section>`
    )
    .join('');

  dotsEl.innerHTML = slides
    .map((_, i) => `<button class="dot" data-index="${i}" aria-label="Slayt ${i + 1}"></button>`)
    .join('');
}

function updateChrome() {
  counterEl.textContent = `${current + 1} / ${total}`;
  progressEl.style.width = `${((current + 1) / total) * 100}%`;
  [...dotsEl.children].forEach((dot, i) => dot.classList.toggle('is-active', i === current));
}

function goTo(newIndex, direction) {
  if (newIndex < 0 || newIndex >= total || newIndex === current) return;
  const dir = direction || (newIndex > current ? 'next' : 'prev');
  const slideEls = deckEl.querySelectorAll('.slide');
  const oldSlide = slideEls[current];
  const newSlide = slideEls[newIndex];
  deckEl.dataset.direction = dir;
  oldSlide.classList.remove('is-active');
  oldSlide.classList.add('is-leaving');
  newSlide.classList.add('is-active');
  const cleanup = () => oldSlide.classList.remove('is-leaving');
  newSlide.addEventListener('animationend', cleanup, { once: true });
  setTimeout(cleanup, 900);
  current = newIndex;
  updateChrome();
  history.replaceState(null, '', `#${current + 1}`);
}

function next() {
  goTo(current + 1, 'next');
}
function prev() {
  goTo(current - 1, 'prev');
}

function initFromHash() {
  const n = parseInt(location.hash.replace('#', ''), 10);
  const startIndex = Number.isInteger(n) && n >= 1 && n <= total ? n - 1 : 0;
  deckEl.querySelectorAll('.slide')[startIndex].classList.add('is-active');
  current = startIndex;
  updateChrome();
}

buildSlides();
initFromHash();

window.addEventListener('keydown', (e) => {
  if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
    e.preventDefault();
    next();
  } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
    e.preventDefault();
    prev();
  }
});

let wheelLocked = false;
window.addEventListener(
  'wheel',
  (e) => {
    if (wheelLocked) return;
    if (Math.abs(e.deltaY) < 10) return;
    wheelLocked = true;
    if (e.deltaY > 0) next();
    else prev();
    setTimeout(() => (wheelLocked = false), 700);
  },
  { passive: true }
);

let touchStartY = null;
window.addEventListener('touchstart', (e) => (touchStartY = e.touches[0].clientY), { passive: true });
window.addEventListener(
  'touchend',
  (e) => {
    if (touchStartY === null) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) (dy > 0 ? next() : prev());
    touchStartY = null;
  },
  { passive: true }
);

dotsEl.addEventListener('click', (e) => {
  const dot = e.target.closest('.dot');
  if (!dot) return;
  goTo(parseInt(dot.dataset.index, 10));
});

deckEl.addEventListener('click', (e) => {
  const toggle = e.target.closest('.detail-toggle');
  if (!toggle) return;
  const panel = toggle.nextElementSibling;
  const isOpen = panel.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.textContent = isOpen ? 'Detayları gizle' : 'Detayları göster';
});

window.addEventListener('hashchange', () => {
  const n = parseInt(location.hash.replace('#', ''), 10);
  if (Number.isInteger(n) && n >= 1 && n <= total && n - 1 !== current) {
    goTo(n - 1);
  }
});

// Animated background grid (low-cost, theme-specific)
const canvas = document.getElementById('bg-grid');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let t = 0;
function drawGrid() {
  t += 0.002;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(186, 255, 41, 0.06)';
  const spacing = 64;
  const offset = (t * 40) % spacing;
  for (let x = -spacing; x < canvas.width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + offset, canvas.height);
    ctx.stroke();
  }
  for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(canvas.width, y + offset);
    ctx.stroke();
  }
  requestAnimationFrame(drawGrid);
}
drawGrid();

// Count-up animation for numeric card values on the costs/summary slides
function animateCounts(slideEl) {
  slideEl.querySelectorAll('.summary .card h3').forEach((el) => {
    const text = el.textContent;
    const num = parseInt(text.replace(/\D/g, ''), 10);
    if (!num) return;
    let start = 0;
    const step = Math.max(1, Math.round(num / 40));
    el.dataset.finalText = text;
    const tick = () => {
      start = Math.min(num, start + step);
      el.textContent = text.replace(/[\d.]+/, start.toLocaleString('tr-TR'));
      if (start < num) requestAnimationFrame(tick);
      else el.textContent = text;
    };
    tick();
  });
}
new MutationObserver(() => {
  const active = deckEl.querySelector('.slide.is-active');
  if (active && active.querySelector('.summary')) animateCounts(active);
}).observe(deckEl, { attributes: true, subtree: true, attributeFilter: ['class'] });
