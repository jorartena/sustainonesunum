# SustainOne Yatırımcı Sunumu Web Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, buildless HTML/CSS/JS Cloudflare Pages site that presents the SustainOne investor deck as three visually distinct, full-screen "slide" experiences (koyu-teknik, acik-kurumsal, organik-editoryal), all rendering from one shared content module.

**Architecture:** One repo, no bundler. `shared/content.js` is an ES module exporting a single `deck` object (8 slide records) that every theme imports directly via a relative `<script type="module">` import — no npm, no build step. Each theme folder (`koyu-teknik/`, `acik-kurumsal/`, `organik-editoryal/`) has its own `index.html` + `style.css` + `script.js` implementing an identical navigation/rendering *contract* (same element ids, same slide-kind renderers, same keyboard/scroll/hash behavior) but completely independent visual design. A root `index.html` is a chooser page linking to the three themes, for the founder's own use.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, CSS animations), vanilla JS (ES modules, no framework, no dependencies). Node.js is used only as a local dev-time validator for `content.js` (no `npm install`, no `package.json` required — plain `node` script using built-in `assert`).

## Global Constraints

- No build step, no bundler, no npm dependencies — everything must run by opening the HTML file via a static file server (e.g. `npx serve` or Cloudflare Pages itself). Source: spec "Kapsam Dışı" / "Tech stack" decision.
- All three themes render from `shared/content.js` as the single content source — content is never duplicated or hand-edited per theme. Source: spec "Mimari".
- Common navigation contract across all three themes: ArrowRight/ArrowDown/Space → next slide, ArrowLeft/ArrowUp → previous slide, mouse-wheel/trackpad scroll (debounced, one scroll gesture = one slide), touch swipe on mobile, clickable nav-dots for direct jump, top progress bar, bottom-right "`N / 8`" counter, URL hash (`#1`..`#8`) kept in sync and read on load. Source: spec "Navigasyon Mekaniği (üç temada ortak)".
- Slide 7 (Gider Yapısı) shows summary cards by default with a "Detayları göster" toggle revealing the full per-line cost table; toggling must never trigger a slide navigation. Source: spec slide 7 description.
- Turkish text is used verbatim from the content data defined in Task 1 — do not paraphrase further when implementing themes.
- Visual polish beyond the structural/interaction requirements stated in each task (exact gradients, fine spacing, micro-animation timing) is implementer discretion — load the `frontend-design` skill before styling each theme to make deliberate, non-templated visual choices consistent with the theme's described direction.
- Because this is a static visual/interaction deliverable, "tests" in this plan are (a) a Node-based data-shape validator for `content.js`, and (b) explicit manual browser verification checklists per theme — there is no unit-test framework in scope.

---

### Task 1: Shared content module

**Files:**
- Create: `shared/content.js`
- Create: `shared/content.check.mjs` (manual data-shape validator, run with `node`)

**Interfaces:**
- Produces: `export const deck` — an object `{ meta: {...}, slides: [...] }` with exactly 8 entries in `slides`, each having a `kind` field (`'cover' | 'timeline' | 'steps' | 'cards' | 'costs' | 'why'`) that every theme's `script.js` (Tasks 2-4) switches on to render.

- [ ] **Step 1: Write `shared/content.js`**

```javascript
export const deck = {
  meta: {
    company: 'SustainOne',
    presentedAs: 'SustainOne — Yatırımcı Sunumu',
  },
  slides: [
    {
      id: 'cover',
      kind: 'cover',
      eyebrow: 'SustainOne — Yatırımcı Sunumu',
      title: 'SustainOne',
      subtitle: 'KURUMSAL ESG YÖNETİMİ İÇİN TEK PLATFORM',
      body: 'Şirketlerin sürdürülebilirlik verisini toplama, izleme ve raporlama sürecini tek dijital altyapıda birleştiriyoruz.',
    },
    {
      id: 'regulation',
      kind: 'timeline',
      title: 'Sustain One’a Götüren Yolculuk',
      intro: 'Türkiye’de düzenleme takvimi ve banka zorunluluğu aynı anda hizalandı. Bir trend değil, takvim.',
      milestones: [
        {
          date: 'Ara 2023 – Oca 2024',
          label: 'TSRS Yürürlükte',
          detail: 'KGK, ESRS ile uyumlu ulusal çerçeveyi yayımladı; kapsamdaki firmalar TSRS’ye uygun raporlamakla yükümlü.',
        },
        {
          date: '2026',
          label: 'Bağımsız Güvence Denetimi',
          detail: 'TSRS raporu artık beyan değil, denetlenen belge — kanıt bağlantısı ve versiyon kilidi zorunlu hale geliyor.',
        },
        {
          date: 'Oca 2026',
          label: 'SKDM (CBAM) Kesin Raporlama',
          detail: 'Enerji, Alüminyum, Hidrojen, Demir-Çelik, Çimento, Gübre firmaları için raporlama zorunlu hale getirildi.',
        },
        {
          date: '2026–29',
          label: 'Yeşil Taksonomi & Yeşil Varlık Oranı',
          detail: 'HMB’nin planı kredi portföyünde karbon izlemeyi beklenti hâline getiriyor; bankalar GAR raporlayacak.',
        },
      ],
    },
    {
      id: 'solution',
      kind: 'steps',
      title: 'Sürdürülebilirlik verisini üretildiği yerden karar verildiği yere taşıyoruz.',
      steps: [
        {
          n: '01',
          label: 'Rehberli veri girişi',
          detail: 'ESG mevzuatını bilmeyen kullanıcı için kapsam kapsam yönlendirme: hangi veri, nereden, neden. Fatura ve doküman yükleme ile tüketim/maliyet aynı kayıttan çıkar.',
        },
        {
          n: '02',
          label: 'Sürekli ESG paneli',
          detail: 'Çevre, sosyal ve yönetişim verisi tek panelde. Yıl/ay bazında kapsam kırılımı, önceki döneme göre kıyas. Yıllık rapor değil, canlı durum.',
        },
        {
          n: '03',
          label: 'Otomatik raporlama',
          detail: 'GRI/ESRS/TSRS eşlemeli rapor çıktısı, tek tıkla PDF. Manuel şablon doldurma ortadan kalkar.',
        },
        {
          n: '04',
          label: 'Karar konsolu',
          detail: 'Banka, yatırımcı ya da iç yönetim için değişmez, kanıta bağlı bir görünüm — belirli bir ana ait, sonradan değiştirilemeyen snapshot.',
        },
      ],
    },
    {
      id: 'problem',
      kind: 'cards',
      title: 'ESG yönetimi hâlâ Excel ve e-posta arasında sıkışmış durumda.',
      cards: [
        { label: 'Veri dağınık', detail: 'Kapsam 1-2-3 emisyon, sosyal ve yönetişim verileri farklı departmanlarda, farklı dosyalarda tutuluyor.' },
        { label: 'Manuel süreç', detail: 'Veri toplama e-posta zincirleri ve Excel şablonlarıyla yürüyor; hata ve gecikme riski yüksek.' },
        { label: 'Uzmanlık eksikliği', detail: 'Şirketlerin çoğunda TSRS, CSRD, SKDM gibi mevzuatı yorumlayacak iç ESG uzmanlığı yok.' },
        { label: 'Denetlenebilirlik yok', detail: '2026’dan itibaren TSRS raporları bağımsız güvence denetimine tabi; Excel süreçleri kanıt izi bırakmıyor.' },
      ],
      footer: 'Mevzuat baskısı büyüyor; şirketlerin çoğunun buna hazırlanacak altyapısı yok.',
    },
    {
      id: 'modules',
      kind: 'cards',
      title: 'Altı modül, uçtan uca çalışan tek platform.',
      intro: 'Modüller uçtan uca gezilebilir durumda; veri katmanı şu an gerçek entegrasyona geçiş aşamasında.',
      cards: [
        { label: 'Çevre & Karbon', detail: 'Kapsam 1-2-3 emisyon takibi, dönemsel kıyaslama; fatura yükleme ile tüketim/maliyet takibi.' },
        { label: 'Sosyal', detail: 'Çalışan hakları, İSG, eğitim, çeşitlilik, tedarik zinciri sosyal performansı.' },
        { label: 'Yönetişim', detail: 'Ortak ve sektöre özel politika kütüphanesi; sürdürülebilirlik komitesi kurma akışı.' },
        { label: 'Raporlama', detail: 'GRI/ESRS eşleme, PDF çıktı. TSRS eşlemesi yol haritasında.' },
        { label: 'Finansman & Karar Konsolu', detail: 'Değişmez snapshot; banka/yatırımcı tarafında liste, inceleme, durum yönetimi.' },
      ],
    },
    {
      id: 'revenue',
      kind: 'cards',
      title: 'Gelir Modeli',
      cards: [
        { label: 'Portal Satışı', detail: 'Firmaların platform kullanım bedeli.' },
        { label: 'Portal Lisansı', detail: 'Yıllık lisanslama bedeli.' },
        { label: 'Yeni Müşteri Komisyonu', detail: 'Bankalara sağlanan yeşil müşteri üzerinden fiyatlama; işletme verilerinin bankalara satışı.' },
      ],
    },
    {
      id: 'costs',
      kind: 'costs',
      title: 'Gider Yapısı',
      summary: [
        { label: 'Personel Maliyeti', value: '8.061.300 TL' },
        { label: 'Diğer Gider Kalemleri', value: '3.240.000 TL' },
        { label: 'Toplam İlk Yatırım (Yıllık)', value: '11.301.300 TL' },
      ],
      detailColumns: ['Gider Kalemi', 'Aylık', '12 Aylık'],
      detailRows: [
        ['Kurucu – işveren maliyeti', '243.500 TL', '2.922.000 TL'],
        ['Junior – işveren maliyeti', '85.225 TL', '1.022.700 TL'],
        ['Müşteri Deneyimi – işveren maliyeti', '73.050 TL', '876.600 TL'],
        ['Freelance IT – 8 gün/ay', '192.000 TL', '2.304.000 TL'],
        ['Freelance Çevre Mühendisi – 2 gün/ay', '48.000 TL', '576.000 TL'],
        ['3 Sigortalı Çalışan – Yemek', '30.000 TL', '360.000 TL'],
        ['Cloud / Sunucu / Hosting', '25.000 TL', '300.000 TL'],
        ['Yazılım & SaaS araçları', '20.000 TL', '240.000 TL'],
        ['Pazarlama + Etkinlik / Fuar', '100.000 TL', '1.200.000 TL'],
        ['Hukuk / Freelance danışmanlık', '60.000 TL', '720.000 TL'],
        ['Mali Müşavir', '40.000 TL', '480.000 TL'],
        ['3 adet bilgisayar', '—', '120.000 TL'],
        ['TOPLAM', '931.775 TL', '11.301.300 TL'],
      ],
    },
    {
      id: 'whynow',
      kind: 'why',
      title: 'Neden SustainOne, neden şimdi.',
      blocks: [
        { q: 'Neden bu şirket?', a: 'Türkiye mevzuatına ve kurumsal/banka sürecine yerel olarak inşa edilen tek platform.' },
        { q: 'Neden şimdi?', a: 'TSRS güvence denetimi, SKDM kesin rejimi ve Yeşil Varlık Oranı raporlaması aynı anda devrede.' },
        { q: 'Neden bu ekip?', a: 'Kurucu ESG/sürdürülebilirlik alanında uzman; ürün ve iş geliştirmeyi birlikte yürütüyor.' },
        { q: 'Neden yatırım?', a: 'Çalışan bir ürün, net bir pazar boşluğu ve şeffaf, gerçekçi bir finansal model.' },
      ],
      footer: 'SustainOne · Yatırımcı Sunumu · Ağustos 2026',
    },
  ],
};
```

- [ ] **Step 2: Write the validator `shared/content.check.mjs`**

```javascript
import assert from 'node:assert/strict';
import { deck } from './content.js';

assert.equal(deck.slides.length, 8, 'deck must have exactly 8 slides');

const kinds = deck.slides.map((s) => s.kind);
assert.deepEqual(
  kinds,
  ['cover', 'timeline', 'steps', 'cards', 'cards', 'cards', 'costs', 'why'],
  'slide kinds must match the expected sequence'
);

for (const slide of deck.slides) {
  assert.ok(slide.id, `slide missing id: ${JSON.stringify(slide)}`);
  assert.ok(slide.title, `slide ${slide.id} missing title`);
}

const costs = deck.slides.find((s) => s.id === 'costs');
assert.equal(costs.detailRows.length, 13, 'costs detail must have 13 rows including TOPLAM');
assert.equal(costs.summary.length, 3, 'costs summary must have 3 cards');

console.log('content.js OK: 8 slides, kinds match, costs table intact.');
```

- [ ] **Step 3: Run the validator to verify it passes**

Run: `node shared/content.check.mjs`
Expected: prints `content.js OK: 8 slides, kinds match, costs table intact.` with exit code 0.

- [ ] **Step 4: Commit**

```bash
git add shared/content.js shared/content.check.mjs
git commit -m "Add shared content module for the 8-slide investor deck"
```

---

### Task 2: Tema 1 — Koyu Teknik

**Files:**
- Create: `koyu-teknik/index.html`
- Create: `koyu-teknik/style.css`
- Create: `koyu-teknik/script.js`

**Interfaces:**
- Consumes: `deck` from `../shared/content.js` (Task 1).
- Produces: a working full-screen slide deck at `koyu-teknik/index.html` implementing the common nav contract from Global Constraints. Later tasks (chooser page, Task 5) link to `koyu-teknik/index.html`.

- [ ] **Step 1: Write `koyu-teknik/index.html`**

```html
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SustainOne — Yatırımcı Sunumu</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <canvas id="bg-grid" aria-hidden="true"></canvas>
  <div id="progress-bar"></div>
  <main id="deck"></main>
  <div id="chrome">
    <nav id="nav-dots" aria-label="Slayt navigasyonu"></nav>
    <div id="slide-counter"></div>
  </div>
  <script type="module" src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `koyu-teknik/script.js`** (rendering + navigation engine)

```javascript
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
```

- [ ] **Step 3: Write `koyu-teknik/style.css`**

```css
:root {
  --bg: #0b1210;
  --bg-alt: #10201b;
  --accent: #baff29;
  --text: #eaf5ee;
  --text-dim: #7d9a8d;
  --mono: ui-monospace, 'SFMono-Regular', Consolas, monospace;
  --sans: 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: var(--bg); color: var(--text); font-family: var(--sans); overflow: hidden; }
#bg-grid { position: fixed; inset: 0; z-index: 0; }
#deck { position: relative; height: 100vh; z-index: 1; }
.slide {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 6vw 8vw;
  opacity: 0; pointer-events: none;
  clip-path: inset(0 0 100% 0);
}
.slide.is-active {
  opacity: 1; pointer-events: auto;
  clip-path: inset(0 0 0% 0);
  animation: wipe-in 0.6s cubic-bezier(.2,.8,.2,1);
}
.slide.is-leaving { opacity: 0; animation: glitch-out 0.35s steps(4); }
[data-direction="prev"] .slide.is-active { animation-name: wipe-in-rev; }
@keyframes wipe-in { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0% 0); } }
@keyframes wipe-in-rev { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0% 0); } }
@keyframes glitch-out { 0% { transform: translateX(0); } 25% { transform: translateX(-6px); } 50% { transform: translateX(4px); } 100% { transform: translateX(0); opacity: 0; } }
.slide-inner { max-width: 980px; width: 100%; }
.eyebrow, #slide-counter, .n, .date { font-family: var(--mono); color: var(--accent); letter-spacing: 0.08em; }
.eyebrow { text-transform: uppercase; font-size: 0.85rem; margin-bottom: 1rem; }
h1 { font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1.15; margin: 0 0 0.5rem; }
h2 { font-size: clamp(1.1rem, 2vw, 1.5rem); color: var(--text-dim); font-weight: 500; margin: 0 0 1.5rem; }
.body, .intro { color: var(--text-dim); font-size: 1.1rem; max-width: 60ch; }
.timeline, .steps { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.timeline li, .steps li { border-left: 2px solid var(--accent); padding-left: 1rem; }
.steps .n { font-size: 1.8rem; display: block; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-top: 2rem; }
.card { background: var(--bg-alt); border: 1px solid rgba(186,255,41,0.15); border-radius: 10px; padding: 1.25rem; }
.card h3 { margin: 0 0 0.5rem; color: var(--accent); font-family: var(--mono); }
.card p { margin: 0; color: var(--text-dim); font-size: 0.95rem; }
.summary .card h3 { font-size: 1.6rem; }
.footer { margin-top: 2rem; color: var(--text-dim); font-style: italic; }
.detail-toggle { margin-top: 1.5rem; background: transparent; border: 1px solid var(--accent); color: var(--accent); font-family: var(--mono); padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
.detail-panel { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.detail-panel.is-open { max-height: 60vh; overflow-y: auto; margin-top: 1rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th, td { text-align: left; padding: 0.4rem 0.6rem; border-bottom: 1px solid rgba(186,255,41,0.1); }
th { color: var(--accent); font-family: var(--mono); }
#progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent); z-index: 3; transition: width 0.4s ease; }
#chrome { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 3; display: flex; align-items: center; gap: 1rem; }
#slide-counter { font-family: var(--mono); color: var(--text-dim); font-size: 0.85rem; }
#nav-dots { display: flex; gap: 0.5rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(234,245,238,0.2); cursor: pointer; padding: 0; }
.dot.is-active { background: var(--accent); }
@media (max-width: 720px) {
  .timeline, .steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Manual verification**

Run: `npx serve .` (from repo root) and open `http://localhost:3000/koyu-teknik/`.

Checklist (all must pass):
- All 8 slides reachable via ArrowRight/Space, and back via ArrowLeft.
- Mouse-wheel scroll down/up advances/retreats exactly one slide per gesture (no double-skip).
- Clicking a nav-dot jumps directly to that slide.
- Reloading the page on `#5` opens directly on slide 5.
- On slide 7, "Detayları göster" opens the 13-row table without changing slides; clicking again hides it.
- Background grid animates subtly and does not block clicks on cards/buttons.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add koyu-teknik/
git commit -m "Add koyu-teknik theme: dark tech investor deck"
```

---

### Task 3: Tema 2 — Açık Kurumsal

**Files:**
- Create: `acik-kurumsal/index.html`
- Create: `acik-kurumsal/style.css`
- Create: `acik-kurumsal/script.js`

**Interfaces:**
- Consumes: `deck` from `../shared/content.js` (Task 1).
- Produces: a working full-screen slide deck at `acik-kurumsal/index.html`, same nav contract as Task 2, distinct light/corporate visual design.

- [ ] **Step 1: Write `acik-kurumsal/index.html`**

```html
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SustainOne — Yatırımcı Sunumu</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="progress-bar"></div>
  <main id="deck"></main>
  <div id="chrome">
    <nav id="nav-dots" aria-label="Slayt navigasyonu"></nav>
    <div id="slide-counter"></div>
  </div>
  <script type="module" src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `acik-kurumsal/script.js`**

Reuse the exact rendering + navigation engine from `koyu-teknik/script.js` Step 2 (same `renderCard`, `renderSlideContent`, `buildSlides`, `updateChrome`, `goTo`, `next`, `prev`, `initFromHash`, keyboard/wheel/touch/dot/hashchange listeners, and the `animateCounts` MutationObserver block), with two removals: drop the `bg-grid` canvas animation block entirely (this theme has no canvas element). Everything else — function names, DOM ids, event wiring — must be byte-for-byte identical so the nav contract stays consistent across themes.

- [ ] **Step 3: Write `acik-kurumsal/style.css`**

```css
:root {
  --bg: #ffffff;
  --bg-alt: #f5f7f5;
  --accent: #1f6f4a;
  --accent-2: #8a6d3b;
  --text: #16241c;
  --text-dim: #5c6b62;
  --sans: 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: var(--bg); color: var(--text); font-family: var(--sans); overflow: hidden; }
#deck { position: relative; height: 100vh; }
.slide {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 6vw 10vw;
  opacity: 0; pointer-events: none;
  transform: translateX(40px);
}
.slide.is-active {
  opacity: 1; pointer-events: auto;
  transform: translateX(0);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(.2,.8,.2,1);
}
.slide.is-leaving { opacity: 0; transform: translateX(-40px); transition: opacity 0.4s ease, transform 0.4s ease; }
[data-direction="prev"] .slide.is-active { transform: translateX(0); }
.slide-inner { max-width: 900px; width: 100%; }
.eyebrow { text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 1rem; }
h1 { font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1.2; margin: 0 0 0.5rem; position: relative; display: inline-block; }
h1::after { content: ''; display: block; width: 64px; height: 3px; background: var(--accent-2); margin-top: 0.6rem; animation: underline-grow 0.6s ease 0.2s both; }
@keyframes underline-grow { from { width: 0; } to { width: 64px; } }
h2 { font-size: clamp(1rem, 1.8vw, 1.3rem); color: var(--text-dim); font-weight: 500; margin: 0 0 1.5rem; }
.body, .intro { color: var(--text-dim); font-size: 1.05rem; max-width: 62ch; }
.timeline, .steps { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.timeline li, .steps li { border-top: 3px solid var(--accent); padding-top: 0.75rem; }
.date, .n { color: var(--accent); font-weight: 600; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-top: 2rem; }
.card { background: var(--bg-alt); border-radius: 10px; padding: 1.25rem; border: 1px solid #e5e9e6; }
.card h3 { margin: 0 0 0.5rem; color: var(--accent); }
.card p { margin: 0; color: var(--text-dim); font-size: 0.95rem; }
.summary .card h3 { font-size: 1.6rem; }
.footer { margin-top: 2rem; color: var(--text-dim); font-style: italic; }
.detail-toggle { margin-top: 1.5rem; background: var(--accent); border: none; color: #fff; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
.detail-panel { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.detail-panel.is-open { max-height: 60vh; overflow-y: auto; margin-top: 1rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th, td { text-align: left; padding: 0.4rem 0.6rem; border-bottom: 1px solid #e5e9e6; }
th { color: var(--accent); }
#progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent); z-index: 3; transition: width 0.4s ease; }
#chrome { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 3; display: flex; align-items: center; gap: 1rem; }
#slide-counter { color: var(--text-dim); font-size: 0.85rem; }
#nav-dots { display: flex; gap: 0.5rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: #d7ddd9; cursor: pointer; padding: 0; }
.dot.is-active { background: var(--accent); }
@media (max-width: 720px) {
  .timeline, .steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Manual verification**

Same checklist as Task 2 Step 4, run against `http://localhost:3000/acik-kurumsal/`.

- [ ] **Step 5: Commit**

```bash
git add acik-kurumsal/
git commit -m "Add acik-kurumsal theme: light corporate investor deck"
```

---

### Task 4: Tema 3 — Organik Editoryal

**Files:**
- Create: `organik-editoryal/index.html`
- Create: `organik-editoryal/style.css`
- Create: `organik-editoryal/script.js`

**Interfaces:**
- Consumes: `deck` from `../shared/content.js` (Task 1).
- Produces: a working full-screen slide deck at `organik-editoryal/index.html`, same nav contract as Task 2, distinct warm/editorial visual design.

- [ ] **Step 1: Write `organik-editoryal/index.html`**

```html
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SustainOne — Yatırımcı Sunumu</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <svg id="bg-blobs" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path class="blob blob-1" d="M20,30 Q40,5 65,20 T90,60 Q80,90 45,85 T10,55 Z" />
    <path class="blob blob-2" d="M60,10 Q90,20 85,50 T60,90 Q30,95 15,70 T30,20 Z" />
  </svg>
  <div id="progress-bar"></div>
  <main id="deck"></main>
  <div id="chrome">
    <nav id="nav-dots" aria-label="Slayt navigasyonu"></nav>
    <div id="slide-counter"></div>
  </div>
  <script type="module" src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `organik-editoryal/script.js`**

Reuse the exact rendering + navigation engine from `koyu-teknik/script.js` Step 2 (same `renderCard`, `renderSlideContent`, `buildSlides`, `updateChrome`, `goTo`, `next`, `prev`, `initFromHash`, keyboard/wheel/touch/dot/hashchange listeners, and the `animateCounts` MutationObserver block), dropping the `bg-grid` canvas block (this theme animates the SVG blobs via CSS only, no JS needed for them). Function names, DOM ids, and event wiring must stay identical to the other two themes.

- [ ] **Step 3: Write `organik-editoryal/style.css`**

```css
:root {
  --bg: #faf3e6;
  --accent: #4a7c3f;
  --accent-2: #d9a441;
  --text: #2b2418;
  --text-dim: #6b6152;
  --serif: Georgia, ui-serif, 'Times New Roman', serif;
  --sans: 'Segoe UI', ui-sans-serif, system-ui, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: var(--bg); color: var(--text); font-family: var(--sans); overflow: hidden; }
#bg-blobs { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.18; }
.blob { fill: var(--accent-2); }
.blob-2 { fill: var(--accent); }
.blob-1 { animation: float-1 22s ease-in-out infinite; }
.blob-2 { animation: float-2 26s ease-in-out infinite; }
@keyframes float-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(3%, -4%) scale(1.05); } }
@keyframes float-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-4%, 3%) scale(0.95); } }
#deck { position: relative; height: 100vh; z-index: 1; }
.slide {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 6vw 10vw;
  opacity: 0; pointer-events: none;
}
.slide.is-active { opacity: 1; pointer-events: auto; animation: crossfade-in 0.7s ease; }
.slide.is-leaving { opacity: 0; transition: opacity 0.5s ease; }
@keyframes crossfade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
.slide-inner { max-width: 920px; width: 100%; }
.eyebrow { text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 1rem; font-family: var(--sans); }
h1 { font-family: var(--serif); font-size: clamp(2.2rem, 5vw, 4rem); line-height: 1.1; margin: 0 0 0.6rem; }
h2 { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: clamp(1.1rem, 2vw, 1.5rem); color: var(--text-dim); margin: 0 0 1.5rem; }
.body, .intro { color: var(--text-dim); font-size: 1.1rem; max-width: 60ch; }
.timeline, .steps { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.75rem; }
.date { font-family: var(--sans); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-2); }
.timeline h3, .steps h3 { font-family: var(--serif); margin: 0.3rem 0; }
.steps .n { font-family: var(--serif); font-size: 2rem; color: var(--accent); }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.card { background: rgba(255,255,255,0.5); border-radius: 16px; padding: 1.4rem; }
.card h3 { font-family: var(--serif); margin: 0 0 0.5rem; color: var(--accent); }
.card p { margin: 0; color: var(--text-dim); font-size: 0.95rem; }
.summary .card h3 { font-size: 1.7rem; }
.footer { margin-top: 2rem; color: var(--text-dim); font-style: italic; font-family: var(--serif); }
.detail-toggle { margin-top: 1.5rem; background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 0.6rem 1.2rem; border-radius: 20px; cursor: pointer; font-family: var(--sans); }
.detail-panel { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.detail-panel.is-open { max-height: 60vh; overflow-y: auto; margin-top: 1rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th, td { text-align: left; padding: 0.4rem 0.6rem; border-bottom: 1px solid rgba(43,36,24,0.1); }
th { color: var(--accent); font-family: var(--sans); }
#progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent-2); z-index: 3; transition: width 0.4s ease; }
#chrome { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 3; display: flex; align-items: center; gap: 1rem; }
#slide-counter { color: var(--text-dim); font-size: 0.85rem; font-family: var(--sans); }
#nav-dots { display: flex; gap: 0.5rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(43,36,24,0.15); cursor: pointer; padding: 0; }
.dot.is-active { background: var(--accent-2); }
@media (max-width: 720px) {
  .timeline, .steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Manual verification**

Same checklist as Task 2 Step 4, run against `http://localhost:3000/organik-editoryal/`. Additionally confirm the SVG blobs animate gently in the background without affecting text readability or click targets.

- [ ] **Step 5: Commit**

```bash
git add organik-editoryal/
git commit -m "Add organik-editoryal theme: warm editorial investor deck"
```

---

### Task 5: Root chooser page

**Files:**
- Create: `index.html`
- Create: `style.css`

**Interfaces:**
- Consumes: nothing dynamic — static links to `koyu-teknik/`, `acik-kurumsal/`, `organik-editoryal/`.
- Produces: a founder-facing landing page at repo root; not meant to be sent to the investor.

- [ ] **Step 1: Write `index.html`**

```html
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SustainOne — Sunum Temaları</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main>
    <p class="eyebrow">SustainOne — Dahili Seçim Sayfası</p>
    <h1>Hangi temayı göndereceksin?</h1>
    <p class="lead">Aşağıdaki üç tema aynı 8 slaytı farklı görsel dille sunar. Yatırımcıya bu sayfa değil, seçtiğin tema linki gider.</p>
    <div class="options">
      <a class="option koyu" href="koyu-teknik/">
        <span class="swatch"></span>
        <h2>Koyu Teknik</h2>
        <p>Fintech/climate-SaaS dashboard hissi, glitch geçişler.</p>
      </a>
      <a class="option acik" href="acik-kurumsal/">
        <span class="swatch"></span>
        <h2>Açık Kurumsal</h2>
        <p>Temiz, güven veren kurumsal rapor hissi.</p>
      </a>
      <a class="option organik" href="organik-editoryal/">
        <span class="swatch"></span>
        <h2>Organik Editoryal</h2>
        <p>Büyük tipografi, sıcak, hikaye anlatımı.</p>
      </a>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Write `style.css`**

```css
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: #111; color: #eee; font-family: 'Segoe UI', ui-sans-serif, system-ui, sans-serif; }
main { max-width: 900px; margin: 0 auto; padding: 8vh 2rem; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; color: #9ad; }
h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin: 0.5rem 0; }
.lead { color: #aaa; max-width: 60ch; }
.options { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 2.5rem; }
.option { display: block; padding: 1.5rem; border-radius: 12px; text-decoration: none; color: inherit; background: #1a1a1a; border: 1px solid #2a2a2a; transition: transform 0.2s ease, border-color 0.2s ease; }
.option:hover { transform: translateY(-4px); border-color: #555; }
.swatch { display: block; width: 100%; height: 40px; border-radius: 6px; margin-bottom: 1rem; }
.koyu .swatch { background: linear-gradient(135deg, #0b1210, #baff29); }
.acik .swatch { background: linear-gradient(135deg, #ffffff, #1f6f4a); }
.organik .swatch { background: linear-gradient(135deg, #faf3e6, #4a7c3f); }
.option h2 { margin: 0 0 0.4rem; font-size: 1.2rem; }
.option p { margin: 0; color: #999; font-size: 0.9rem; }
```

- [ ] **Step 3: Manual verification**

Run: `npx serve .` and open `http://localhost:3000/`. Confirm all three cards link correctly and open each theme in a fresh page load.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add root chooser page linking the three deck themes"
```

---

### Task 6: Cross-theme QA pass

**Files:** none created; verification-only task.

**Interfaces:** none — this task consumes the finished output of Tasks 1-5.

- [ ] **Step 1: Serve the whole site locally**

Run: `npx serve .` from repo root, open `http://localhost:3000/`.

- [ ] **Step 2: Re-run the content validator**

Run: `node shared/content.check.mjs`
Expected: `content.js OK: 8 slides, kinds match, costs table intact.`

- [ ] **Step 3: Full manual checklist across all three themes**

For each of `koyu-teknik/`, `acik-kurumsal/`, `organik-editoryal/`:
- All 8 slide titles/text match the content defined in Task 1, no truncation or overflow at 1366×768 and at a narrow ~390px-wide viewport (browser dev tools device toolbar).
- Keyboard, wheel, touch-swipe (simulate via dev tools touch emulation), and nav-dot navigation all work and stay in sync with each other (no drift between `#hash`, counter, and progress bar).
- Slide 7 detail table opens/closes without navigating away from the slide.
- Reloading mid-deck (e.g. `#6`) restores the correct slide instantly.
- No JS console errors or 404s in Network tab (fonts/images should be zero external requests — verify no failed network calls).

- [ ] **Step 4: Fix any issues found**

If any checklist item fails, fix it in the relevant theme's file and re-run the checklist for that theme only.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "QA pass: verify navigation and content across all three deck themes"
```
