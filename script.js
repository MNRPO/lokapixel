/* ============ LOKAPIXEL — script.js (versi 2) ============
   Semua data disimpan di localStorage (database lokal browser),
   sehingga website berjalan offline & di GitHub Pages tanpa server.
   Catatan: XP/level/lencana hanya untuk status & koleksi.
   Tidak ada hadiah, diskon, taruhan, atau pembelian di dalam game.
============================================================ */
document.documentElement.classList.add('js');

// ---------- KONFIGURASI (ubah sesuai bisnismu) ----------
const CONFIG = {
  brand: 'Lokapixel',
  whatsapp: '6282278798779'   // GANTI dengan nomor WhatsApp kamu (format 62...)
};

const PRODUCTS = [
  { id: 'p1', name: 'Stiker Pack Legenda Nusantara', cat: 'Stiker', price: 15000, icon: '🎴', desc: 'Isi 8 stiker vinyl tahan air: Kancil, Garuda, Barong, dan kawan-kawan.' },
  { id: 'p2', name: 'Gantungan Kunci Gatotkaca Pixel', cat: 'Aksesori', price: 25000, icon: '🗝️', desc: 'Akrilik 2 sisi, ukuran 5 cm. Si otot kawat tulang besi versi 8-bit.' },
  { id: 'p3', name: 'Enamel Pin Si Kancil', cat: 'Aksesori', price: 35000, icon: '📌', desc: 'Pin logam berwarna dengan pengunci karet. Koleksi wajib gamer cerdik.' },
  { id: 'p4', name: 'Poster A3 Wayang Pixel', cat: 'Dekorasi', price: 30000, icon: '🖼️', desc: 'Poster art print di kertas art paper 210 gsm untuk dekor meja gaming.' },
  { id: 'p5', name: 'Mousepad Peta Nusantara', cat: 'Dekorasi', price: 75000, icon: '🗺️', desc: 'Mousepad 70x30 cm dengan peta pixel kepulauan Indonesia. Anti slip.' },
  { id: 'p6', name: 'Kaos Garuda 8-Bit', cat: 'Fashion', price: 99000, icon: '👕', desc: 'Katun combed 24s, sablon DTF awet. Tersedia S–XXL.' }
];

const CUSTOM_TYPES = [
  { id: 'cs', name: 'Stiker Custom (isi 6)', price: 20000 },
  { id: 'ck', name: 'Gantungan Kunci Custom', price: 30000 },
  { id: 'ct', name: 'Kaos Custom', price: 120000 }
];

const LEVELS = [
  { id: 'jawa', name: 'Jawa', ico: '🎭', target: 12, speed: 0,
    icons: [{ e: '🎭', pts: 1, w: 6 }, { e: '🔔', pts: 3, w: 2 }, { e: '🌋', pts: -3, w: 2 }],
    bg: ['#1b1b3a', '#0b0b1e'], char: 'gatotkaca', desc: 'Topeng, gamelan, dan gunung berapi.' },
  { id: 'bali', name: 'Bali', ico: '🌺', target: 18, speed: 25,
    icons: [{ e: '🌺', pts: 1, w: 6 }, { e: '🪔', pts: 3, w: 2 }, { e: '🐍', pts: -3, w: 2 }],
    bg: ['#3a1b2e', '#0b0b1e'], char: 'barong', desc: 'Bunga persembahan dan pelita.' },
  { id: 'sumatra', name: 'Sumatra', ico: '🐘', target: 24, speed: 50,
    icons: [{ e: '🌴', pts: 1, w: 6 }, { e: '🐘', pts: 3, w: 2 }, { e: '🔥', pts: -3, w: 2 }],
    bg: ['#1b3a2a', '#0b0b1e'], char: 'harimau', desc: 'Hutan tropis dan satwa langka.' },
  { id: 'papua', name: 'Papua', ico: '🦜', target: 30, speed: 75,
    icons: [{ e: '🪶', pts: 1, w: 6 }, { e: '🦜', pts: 3, w: 2 }, { e: '🌊', pts: -3, w: 2 }],
    bg: ['#1b2f3a', '#0b0b1e'], char: 'cendrawasih', desc: 'Bulu burung dan lautan biru.' }
];

const CHARACTERS = [
  { id: 'kancil', name: 'Si Kancil', ico: '🦌', origin: 'Cerita rakyat Nusantara', unlock: 'Karakter awal',
    fact: 'Tokoh hewan kecil yang cerdik dalam dongeng, sering mengalahkan lawan yang lebih besar dengan akal.' },
  { id: 'gatotkaca', name: 'Gatotkaca', ico: '🦸', origin: 'Wayang (Jawa)', unlock: 'Selesaikan level Jawa',
    fact: 'Ksatria dalam kisah pewayangan yang dikenal dapat terbang dan memiliki kekuatan luar biasa.' },
  { id: 'barong', name: 'Barong', ico: '🦁', origin: 'Seni pertunjukan Bali', unlock: 'Selesaikan level Bali',
    fact: 'Makhluk pelindung dalam tradisi Bali yang tampil dalam tarian Barong sebagai simbol kebaikan.' },
  { id: 'harimau', name: 'Harimau Sumatra', ico: '🐯', origin: 'Hutan Sumatra', unlock: 'Selesaikan level Sumatra',
    fact: 'Subspesies harimau yang hanya hidup di Pulau Sumatra dan termasuk satwa yang sangat terancam punah.' },
  { id: 'cendrawasih', name: 'Cenderawasih', ico: '🦜', origin: 'Papua', unlock: 'Selesaikan level Papua',
    fact: 'Burung berbulu indah yang dikenal sebagai burung surga dan banyak ditemukan di Papua.' },
  { id: 'garuda', name: 'Garuda', ico: '🦅', origin: 'Lambang negara', unlock: 'Capai 150 XP atau hasil kuis tertentu',
    fact: 'Burung mitologi yang menjadi lambang negara Indonesia, melambangkan kekuatan dan persatuan.' },
  { id: 'ondel', name: 'Ondel-ondel', ico: '🎎', origin: 'Budaya Betawi', unlock: 'Simpan desain pertamamu di Studio Pixel',
    fact: 'Boneka raksasa khas Betawi yang biasa diarak dalam perayaan sebagai penolak bala dan penyemarak acara.' },
  { id: 'nyi', name: 'Nyi Roro Kidul', ico: '🧜', origin: 'Legenda pesisir selatan Jawa', unlock: 'Capai 300 XP',
    fact: 'Tokoh legenda yang dipercaya sebagai penguasa laut selatan Jawa dalam cerita masyarakat setempat.' }
];

// ---------- UTIL & STORAGE ----------
const $ = (id) => document.getElementById(id);
const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('lokapixel_' + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('lokapixel_' + key, JSON.stringify(value)); } catch (e) { /* abaikan */ }
  }
};

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------- STATE ----------
function freshState() {
  return { xp: 0, cleared: {}, unlocked: ['kancil'], best: 0, board: [], player: '', flags: {}, sound: true, theme: 'dark' };
}
let S = Object.assign(freshState(), store.get('state', {}));
if (!Array.isArray(S.unlocked)) S.unlocked = ['kancil'];
if (!Array.isArray(S.board)) S.board = [];
if (!S.cleared || typeof S.cleared !== 'object') S.cleared = {};
if (!S.flags || typeof S.flags !== 'object') S.flags = {};
const saveState = () => store.set('state', S);

let cart = store.get('cart2', {});       // { key: {id,name,price,icon,qty,design?} }
let orders = store.get('orders', []);
let reviews = store.get('reviews', [
  { name: 'Rani', text: 'Usul: karakter Cut Nyak Dhien versi pixel!', rate: 5, date: Date.now() }
]);

// ---------- SUARA (opsional, 8-bit) ----------
let audioCtx = null;
function beep(freq, dur, type, vol) {
  if (!S.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.value = vol || 0.04;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) { /* abaikan */ }
}
const sfx = {
  good: () => beep(760, 0.07),
  star: () => { beep(880, 0.06); setTimeout(() => beep(1180, 0.08), 60); },
  bad: () => beep(130, 0.2, 'sawtooth'),
  win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.12), i * 110)),
  click: () => beep(440, 0.04)
};

// ---------- TEMA, SUARA, NAV ----------
function applyTheme() {
  document.documentElement.dataset.theme = S.theme;
  $('themeBtn').textContent = S.theme === 'dark' ? '🌙' : '☀️';
  $('soundBtn').textContent = S.sound ? '🔊' : '🔇';
}
$('themeBtn').addEventListener('click', () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; saveState(); applyTheme(); renderSim(); });
$('soundBtn').addEventListener('click', () => { S.sound = !S.sound; saveState(); applyTheme(); sfx.click(); });
$('menuBtn').addEventListener('click', () => $('navLinks').classList.toggle('open'));
$('navLinks').addEventListener('click', (e) => { if (e.target.tagName === 'A') $('navLinks').classList.remove('open'); });
$('year').textContent = new Date().getFullYear();

// ---------- XP, LEVEL, KOLEKSI (hanya status) ----------
const TITLES = ['Pemula Pixel', 'Penjelajah Daerah', 'Pemburu Legenda', 'Penjaga Budaya', 'Pahlawan Nusantara', 'Legenda Lokapixel'];
const levelOf = (xp) => Math.floor(Math.sqrt(xp / 12)) + 1;
const xpAt = (lv) => 12 * (lv - 1) * (lv - 1);

function unlockChar(id) {
  if (S.unlocked.includes(id)) return false;
  S.unlocked.push(id);
  const c = CHARACTERS.find((x) => x.id === id);
  if (c) toast(`Karakter baru terbuka: ${c.name} ${c.ico}`);
  saveState();
  return true;
}

function addXP(n) {
  if (n <= 0) return;
  const before = levelOf(S.xp);
  S.xp += n;
  if (S.xp >= 150) unlockChar('garuda');
  if (S.xp >= 300) unlockChar('nyi');
  saveState();
  if (levelOf(S.xp) > before) {
    toast(`Naik level! Sekarang Lv.${levelOf(S.xp)} 🎉`);
    sfx.win();
  }
  renderMember(); renderChars(); renderStats();
}

const BADGES = [
  { id: 'played', label: '🎮 Pemain Pertama', on: () => !!S.flags.played },
  { id: 'cleared', label: '🏁 Selesaikan 1 Level', on: () => Object.keys(S.cleared).some((id) => S.cleared[id] >= LEVELS.find((l) => l.id === id).target) },
  { id: 'all', label: '🌏 Taklukkan 4 Daerah', on: () => LEVELS.every((l) => (S.cleared[l.id] || 0) >= l.target) },
  { id: 'quiz', label: '🧩 Ikut Kuis', on: () => !!S.flags.quiz },
  { id: 'design', label: '🎨 Desainer Pixel', on: () => !!S.flags.design },
  { id: 'order', label: '🛍️ Pelanggan Pertama', on: () => !!S.flags.ordered }
];

function renderMember() {
  const lv = levelOf(S.xp);
  const cur = xpAt(lv), next = xpAt(lv + 1);
  const pct = Math.min(100, Math.round(((S.xp - cur) / (next - cur)) * 100));
  $('memberChip').textContent = 'Lv.' + lv;
  $('titleText').textContent = TITLES[Math.min(lv - 1, TITLES.length - 1)];
  $('xpBar').style.width = pct + '%';
  $('xpText').textContent = `${S.xp} XP • ${S.xp - cur}/${next - cur} menuju Lv.${lv + 1}`;
  $('badges').innerHTML = BADGES.map((b) => `<span class="badge-item ${b.on() ? 'on' : ''}">${b.label}</span>`).join('');
}

function renderChars() {
  $('charCount').textContent = `${S.unlocked.length}/${CHARACTERS.length}`;
  $('charGrid').innerHTML = CHARACTERS.map((c) => {
    const ok = S.unlocked.includes(c.id);
    return `<article class="char ${ok ? '' : 'locked'}">
      <div class="c-ico">${ok ? c.ico : '❔'}</div>
      <h4>${ok ? esc(c.name) : '???'}</h4>
      <div class="origin">${ok ? esc(c.origin) : 'Terkunci'}</div>
      <p>${ok ? esc(c.fact) : 'Cara membuka: ' + esc(c.unlock)}</p>
    </article>`;
  }).join('');
}

function renderStats() {
  $('statLevel').textContent = levelOf(S.xp);
  $('statXP').textContent = S.xp;
  $('statChars').textContent = `${S.unlocked.length}/${CHARACTERS.length}`;
  $('statOrders').textContent = orders.length;
}

// ---------- GAME: PIXEL PANEN (4 LEVEL) ----------
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const GAME_SECONDS = 30;
let selLevel = 0;
let game = { running: false, score: 0, left: GAME_SECONDS, items: [], pops: [], lastSpawn: 0, last: 0, timer: null, raf: null };

const isCleared = (lv) => (S.cleared[lv.id] || 0) >= lv.target;
const isUnlockedLevel = (i) => i === 0 || isCleared(LEVELS[i - 1]);

function renderLevels() {
  $('levelSelect').innerHTML = LEVELS.map((lv, i) => {
    const open = isUnlockedLevel(i);
    return `<button class="level-card ${i === selLevel ? 'active' : ''} ${open ? '' : 'locked'}" data-lv="${i}" ${open ? '' : 'aria-disabled="true"'}>
      ${isCleared(lv) ? '<span class="tag">SELESAI</span>' : ''}
      <div class="lv-ico">${open ? lv.ico : '🔒'}</div>
      <h4>Level ${i + 1}: ${lv.name}</h4>
      <p>${lv.desc}<br>Target: ${lv.target} poin${S.cleared[lv.id] ? ' • Terbaik: ' + S.cleared[lv.id] : ''}</p>
    </button>`;
  }).join('');
  $('gLevelName').textContent = `Lv.${selLevel + 1} ${LEVELS[selLevel].name}`;
}

$('levelSelect').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lv]');
  if (!b || game.running) return;
  const i = Number(b.dataset.lv);
  if (!isUnlockedLevel(i)) { toast('Selesaikan level sebelumnya dulu 🔒'); return; }
  selLevel = i;
  sfx.click();
  const lv = LEVELS[i];
  $('gameMsgTitle').textContent = `Level ${i + 1}: ${lv.name}`;
  $('gameMsg').textContent = `Capai ${lv.target} poin dalam ${GAME_SECONDS} detik untuk menyelesaikan level ini.`;
  $('gameOverlay').classList.remove('hide');
  renderLevels(); drawIdle();
});

$('playerName').value = S.player || '';
$('playerName').addEventListener('input', () => { S.player = $('playerName').value.trim(); saveState(); });

function pickIcon(icons) {
  const total = icons.reduce((n, i) => n + i.w, 0);
  let r = Math.random() * total;
  for (const i of icons) { if ((r -= i.w) < 0) return i; }
  return icons[0];
}

function startGame() {
  const lv = LEVELS[selLevel];
  game.running = true;
  game.score = 0;
  game.left = GAME_SECONDS;
  game.items = [];
  game.pops = [];
  game.lastSpawn = 0;
  game.last = performance.now();
  $('gScore').textContent = 0;
  $('gTime').textContent = game.left;
  $('gLevelName').textContent = `Lv.${selLevel + 1} ${lv.name}`;
  $('gameOverlay').classList.add('hide');
  clearInterval(game.timer);
  game.timer = setInterval(() => {
    game.left--;
    $('gTime').textContent = game.left;
    if (game.left <= 0) endGame();
  }, 1000);
  cancelAnimationFrame(game.raf);
  game.raf = requestAnimationFrame(loop);
}

function loop(now) {
  if (!game.running) return;
  const lv = LEVELS[selLevel];
  const dt = Math.min(0.05, (now - game.last) / 1000);
  game.last = now;
  const elapsed = GAME_SECONDS - game.left;

  const interval = Math.max(0.32, 0.8 - elapsed * 0.012 - lv.speed * 0.002);
  game.lastSpawn += dt;
  if (game.lastSpawn >= interval) {
    game.lastSpawn = 0;
    const ic = pickIcon(lv.icons);
    game.items.push({ ...ic, x: 30 + Math.random() * (W - 60), y: -30, vy: 110 + Math.random() * 80 + lv.speed + elapsed * 3 });
  }
  game.items.forEach((it) => { it.y += it.vy * dt; });
  game.items = game.items.filter((it) => it.y < H + 40);

  draw(lv);
  game.raf = requestAnimationFrame(loop);
}

function drawBackground(lv) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, lv.bg[0]);
  g.addColorStop(1, lv.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function draw(lv) {
  drawBackground(lv);
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  game.items.forEach((it) => ctx.fillText(it.e, it.x, it.y));
  game.pops.forEach((p) => {
    ctx.fillStyle = p.pts > 0 ? '#3ddc97' : '#ff5d8f';
    ctx.font = 'bold 22px monospace';
    ctx.fillText((p.pts > 0 ? '+' : '') + p.pts, p.x, p.y);
    p.y -= 0.8; p.life--;
  });
  game.pops = game.pops.filter((p) => p.life > 0);
}

function drawIdle() {
  const lv = LEVELS[selLevel];
  drawBackground(lv);
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(lv.ico, W / 2, H / 2);
}

function handleHit(clientX, clientY) {
  if (!game.running) return;
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (W / rect.width);
  const y = (clientY - rect.top) * (H / rect.height);
  for (let i = game.items.length - 1; i >= 0; i--) {
    const it = game.items[i];
    if (Math.hypot(it.x - x, it.y - y) < 32) {
      game.score = Math.max(0, game.score + it.pts);
      $('gScore').textContent = game.score;
      game.pops.push({ x: it.x, y: it.y, pts: it.pts, life: 30 });
      game.items.splice(i, 1);
      if (it.pts < 0) sfx.bad(); else if (it.pts > 1) sfx.star(); else sfx.good();
      return;
    }
  }
}
canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); handleHit(e.clientX, e.clientY); });

function endGame() {
  game.running = false;
  clearInterval(game.timer);
  cancelAnimationFrame(game.raf);
  const lv = LEVELS[selLevel];
  const s = game.score;
  S.flags.played = true;
  if (s > S.best) S.best = s;

  S.board.push({ name: S.player || 'Pemain', score: s, level: lv.name, date: Date.now() });
  S.board.sort((a, b) => b.score - a.score);
  S.board = S.board.slice(0, 5);

  const firstClear = !isCleared(lv) && s >= lv.target;
  S.cleared[lv.id] = Math.max(S.cleared[lv.id] || 0, s);
  saveState();

  let msg;
  if (s >= lv.target) {
    sfx.win();
    const ch = CHARACTERS.find((c) => c.id === lv.char);
    if (firstClear) {
      unlockChar(lv.char);
      addXP(10);
      msg = `Skor ${s}. Level ${lv.name} selesai! Karakter ${ch.name} ${ch.ico} terbuka dan kamu dapat bonus 10 XP.`;
    } else {
      msg = `Skor ${s}. Bagus! Level ini sudah pernah kamu selesaikan.`;
    }
    if (selLevel < LEVELS.length - 1) msg += ` Level ${LEVELS[selLevel + 1].name} siap dimainkan.`;
  } else {
    msg = `Skor ${s}. Butuh ${lv.target} poin untuk menyelesaikan level ini. Coba lagi!`;
  }
  addXP(s);

  $('gameMsgTitle').textContent = 'Waktu habis!';
  $('gameMsg').textContent = msg;
  $('gameStart').textContent = '↻ Main Lagi';
  $('gameOverlay').classList.remove('hide');
  $('gBest').textContent = S.best;
  renderLevels(); renderBoard(); renderMember(); renderChars();
}
$('gameStart').addEventListener('click', () => { sfx.click(); startGame(); });

function renderBoard() {
  $('gBest').textContent = S.best;
  $('leaderboard').innerHTML = S.board.length
    ? S.board.map((b) => `<li><strong>${esc(b.name)}</strong> — ${b.score} poin <small>(${esc(b.level)})</small></li>`).join('')
    : '<li class="muted">Belum ada skor. Mainkan level pertama!</li>';
}

// ---------- STUDIO PIXEL ----------
const PAL = ['transparent', '#1b1b3a', '#ffffff', '#ff5d8f', '#ffcc29', '#3ddc97', '#4da3ff', '#9b5de5', '#ff8c42', '#8b5a2b', '#c0c0c0', '#e63946'];
const N = 16;
const pxCv = $('pxCanvas');
const pxCtx = pxCv.getContext('2d');
let grid = store.get('draft', null);
if (!Array.isArray(grid) || grid.length !== N * N) grid = new Array(N * N).fill(0);
let color = 3, tool = 'pen', painting = false, undoStack = [];

function pushUndo() {
  undoStack.push(grid.slice());
  if (undoStack.length > 30) undoStack.shift();
}

function drawGrid() {
  const cs = pxCv.width / N;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const v = grid[y * N + x];
      if (v === 0) {
        pxCtx.fillStyle = (x + y) % 2 ? '#d9d9d9' : '#f2f2f2';
      } else {
        pxCtx.fillStyle = PAL[v];
      }
      pxCtx.fillRect(x * cs, y * cs, cs, cs);
    }
  }
  pxCtx.strokeStyle = 'rgba(0,0,0,.12)';
  pxCtx.lineWidth = 1;
  for (let i = 0; i <= N; i++) {
    pxCtx.beginPath(); pxCtx.moveTo(i * cs, 0); pxCtx.lineTo(i * cs, pxCv.height); pxCtx.stroke();
    pxCtx.beginPath(); pxCtx.moveTo(0, i * cs); pxCtx.lineTo(pxCv.width, i * cs); pxCtx.stroke();
  }
}

function renderPalette() {
  $('palette').innerHTML = PAL.map((c, i) => i === 0
    ? `<button class="swatch none ${color === 0 ? 'active' : ''}" data-c="0" aria-label="Transparan"></button>`
    : `<button class="swatch ${color === i ? 'active' : ''}" data-c="${i}" style="background:${c}" aria-label="Warna ${i}"></button>`).join('');
}
$('palette').addEventListener('click', (e) => {
  const b = e.target.closest('[data-c]');
  if (!b) return;
  color = Number(b.dataset.c);
  if (tool === 'eraser') setTool('pen');
  renderPalette();
});

function setTool(t) {
  tool = t;
  $('toolPen').classList.toggle('active', t === 'pen');
  $('toolEraser').classList.toggle('active', t === 'eraser');
  $('toolFill').classList.toggle('active', t === 'fill');
}
$('toolPen').addEventListener('click', () => setTool('pen'));
$('toolEraser').addEventListener('click', () => setTool('eraser'));
$('toolFill').addEventListener('click', () => setTool('fill'));

function floodFill(x, y, to) {
  const from = grid[y * N + x];
  if (from === to) return;
  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= N || cy >= N) continue;
    if (grid[cy * N + cx] !== from) continue;
    grid[cy * N + cx] = to;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

function paintAt(x, y, isStart) {
  if (x < 0 || y < 0 || x >= N || y >= N) return;
  const val = tool === 'eraser' ? 0 : color;
  if (tool === 'fill') {
    if (!isStart) return;
    floodFill(x, y, val);
  } else {
    grid[y * N + x] = val;
    if ($('mirror').checked) grid[y * N + (N - 1 - x)] = val;
  }
  drawGrid();
}

function cellFromEvent(e) {
  const r = pxCv.getBoundingClientRect();
  return [Math.floor((e.clientX - r.left) / r.width * N), Math.floor((e.clientY - r.top) / r.height * N)];
}
pxCv.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  painting = true;
  try { pxCv.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
  pushUndo();
  const [x, y] = cellFromEvent(e);
  paintAt(x, y, true);
});
pxCv.addEventListener('pointermove', (e) => {
  if (!painting) return;
  const [x, y] = cellFromEvent(e);
  paintAt(x, y, false);
});
const stopPaint = () => { if (painting) { painting = false; store.set('draft', grid); } };
pxCv.addEventListener('pointerup', stopPaint);
pxCv.addEventListener('pointercancel', stopPaint);

$('pxUndo').addEventListener('click', () => {
  if (!undoStack.length) { toast('Tidak ada yang bisa diurungkan'); return; }
  grid = undoStack.pop();
  store.set('draft', grid);
  drawGrid();
});
$('pxClear').addEventListener('click', () => {
  if (!grid.some((v) => v)) return;
  pushUndo();
  grid = new Array(N * N).fill(0);
  store.set('draft', grid);
  drawGrid();
});
$('pxDownload').addEventListener('click', () => {
  if (!grid.some((v) => v)) { toast('Gambar dulu karaktermu ✏️'); return; }
  const out = document.createElement('canvas');
  const scale = 24;
  out.width = out.height = N * scale;
  const c = out.getContext('2d');
  for (let i = 0; i < N * N; i++) {
    if (grid[i]) { c.fillStyle = PAL[grid[i]]; c.fillRect((i % N) * scale, Math.floor(i / N) * scale, scale, scale); }
  }
  const a = document.createElement('a');
  a.href = out.toDataURL('image/png');
  a.download = 'karakter-pixel-lokapixel.png';
  a.click();
  markDesign();
});

function markDesign() {
  if (!S.flags.design) {
    S.flags.design = true;
    saveState();
    unlockChar('ondel');
    addXP(15);
  }
}

$('pxType').innerHTML = CUSTOM_TYPES.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
const currentCustomType = () => CUSTOM_TYPES.find((t) => t.id === $('pxType').value) || CUSTOM_TYPES[0];
function updatePxPrice() { $('pxPrice').textContent = rupiah(currentCustomType().price); }
$('pxType').addEventListener('change', updatePxPrice);

const encodeDesign = () => grid.map((v) => v.toString(36)).join('');

$('pxAdd').addEventListener('click', () => {
  if (grid.filter((v) => v).length < 8) { toast('Gambar karaktermu dulu (minimal 8 pixel)'); return; }
  const t = currentCustomType();
  const key = 'c' + Date.now();
  cart[key] = { id: 'custom', name: 'Desain Custom: ' + t.name, price: t.price, icon: '🎨', qty: 1, design: encodeDesign() };
  saveCart();
  markDesign();
  toast('Desain ditambahkan ke keranjang 🎨');
});

function drawMini(cv, str) {
  const c = cv.getContext('2d');
  c.clearRect(0, 0, cv.width, cv.height);
  const cs = cv.width / N;
  for (let i = 0; i < N * N; i++) {
    const v = parseInt(str[i] || '0', 36);
    if (v > 0 && PAL[v]) { c.fillStyle = PAL[v]; c.fillRect((i % N) * cs, Math.floor(i / N) * cs, cs, cs); }
  }
}
function paintMinis() {
  document.querySelectorAll('canvas[data-design]').forEach((cv) => drawMini(cv, cv.dataset.design));
}

// ---------- KUIS KARAKTER ----------
const QUIZ = [
  { q: 'Saat menghadapi masalah sulit, kamu biasanya…', o: [['Mencari cara cerdik yang tidak terpikir orang lain', 'k'], ['Langsung maju menghadapinya', 'g'], ['Memikirkan gambaran besarnya dulu', 'a'], ['Memastikan orang-orang di sekitarku aman dulu', 'h']] },
  { q: 'Peran favoritmu saat main game bersama teman?', o: [['Ahli strategi / pembuat jebakan', 'k'], ['Garda depan yang menyerang', 'g'], ['Pemimpin tim / penjelajah peta', 'a'], ['Pendukung yang melindungi tim', 'h']] },
  { q: 'Kamu paling bangga pada…', o: [['Kecerdikanku', 'k'], ['Keberanianku', 'g'], ['Cita-citaku yang tinggi', 'a'], ['Kesetiaanku', 'h']] },
  { q: 'Akhir pekan idealmu?', o: [['Main teka-teki atau puzzle', 'k'], ['Olahraga atau tantangan fisik', 'g'], ['Menjelajah tempat baru', 'a'], ['Berkumpul bersama teman dan keluarga', 'h']] },
  { q: 'Warna yang paling menggambarkan dirimu?', o: [['Hijau', 'k'], ['Merah', 'g'], ['Emas', 'a'], ['Jingga', 'h']] }
];
const ARCH = {
  k: { char: 'kancil', title: 'Si Kancil, Sang Cerdik', text: 'Kamu lincah berpikir dan selalu punya akal untuk keluar dari masalah.', product: 'p3' },
  g: { char: 'gatotkaca', title: 'Gatotkaca, Sang Pemberani', text: 'Kamu berani, kuat, dan tidak mundur saat tantangan datang.', product: 'p2' },
  a: { char: 'garuda', title: 'Garuda, Sang Visioner', text: 'Kamu berpikir jauh ke depan dan punya jiwa pemimpin.', product: 'p6' },
  h: { char: 'harimau', title: 'Harimau Sumatra, Sang Penjaga', text: 'Kamu setia, tangguh, dan selalu melindungi orang yang kamu sayang.', product: 'p1' }
};
let quiz = { i: 0, score: { k: 0, g: 0, a: 0, h: 0 } };

function renderQuiz() {
  const box = $('quizBox');
  if (quiz.i < QUIZ.length) {
    const q = QUIZ[quiz.i];
    box.innerHTML = `<div class="q-progress">Pertanyaan ${quiz.i + 1} dari ${QUIZ.length}</div>
      <h3>${esc(q.q)}</h3>
      <div class="q-opts">${q.o.map((o, idx) => `<button class="q-opt" data-opt="${idx}">${esc(o[0])}</button>`).join('')}</div>`;
    return;
  }
  const best = Object.keys(quiz.score).sort((a, b) => quiz.score[b] - quiz.score[a])[0];
  const r = ARCH[best];
  const ch = CHARACTERS.find((c) => c.id === r.char);
  const p = PRODUCTS.find((x) => x.id === r.product);
  box.innerHTML = `<div class="q-result">
    <div class="q-progress">Hasil kuis</div>
    <div class="c-ico">${ch.ico}</div>
    <h3>Kamu adalah ${esc(r.title)}</h3>
    <p>${esc(r.text)}</p>
    <p class="muted">${esc(ch.fact)}</p>
    <p>Rekomendasi produk: <strong>${esc(p.name)}</strong> (${rupiah(p.price)})</p>
    <div class="hero-cta" style="justify-content:center">
      <button class="btn btn-primary small" id="qShop">Lihat di toko</button>
      <button class="btn btn-ghost small" id="qShare">Salin hasil</button>
      <button class="btn btn-ghost small" id="qRetry">Ulangi kuis</button>
    </div>
  </div>`;
  $('qShop').addEventListener('click', () => {
    activeCat = 'Semua'; hlProduct = p.id;
    renderFilters(); renderProducts();
    $('toko').scrollIntoView({ behavior: 'smooth' });
  });
  $('qShare').addEventListener('click', () => {
    const text = `Hasil kuis Lokapixel: aku adalah ${r.title}! Coba juga kuisnya.`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('Hasil disalin ✔'), () => toast(text));
    } else { toast(text); }
  });
  $('qRetry').addEventListener('click', () => { quiz = { i: 0, score: { k: 0, g: 0, a: 0, h: 0 } }; renderQuiz(); });
  unlockChar(r.char);
  if (!S.flags.quiz) { S.flags.quiz = true; saveState(); addXP(20); }
  renderMember(); renderChars();
}
$('quizBox').addEventListener('click', (e) => {
  const b = e.target.closest('[data-opt]');
  if (!b) return;
  const key = QUIZ[quiz.i].o[Number(b.dataset.opt)][1];
  quiz.score[key]++;
  quiz.i++;
  sfx.click();
  renderQuiz();
});

// ---------- TOKO ----------
let activeCat = 'Semua';
let hlProduct = null;

function renderFilters() {
  const cats = ['Semua', ...new Set(PRODUCTS.map((p) => p.cat))];
  $('filters').innerHTML = cats.map((c) =>
    `<button class="chip ${c === activeCat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
}
$('filters').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  activeCat = b.dataset.cat;
  hlProduct = null;
  renderFilters();
  renderProducts();
});

function renderProducts() {
  const list = PRODUCTS.filter((p) => activeCat === 'Semua' || p.cat === activeCat);
  $('productGrid').innerHTML = list.map((p) => `
    <article class="product ${p.id === hlProduct ? 'hl' : ''}">
      <div class="p-art">${p.icon}</div>
      <div class="p-body">
        <span class="p-tag">${esc(p.cat)}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="p-price">${rupiah(p.price)}</div>
        <button class="btn btn-primary small" data-add="${p.id}">+ Keranjang</button>
      </div>
    </article>`).join('');
}
$('productGrid').addEventListener('click', (e) => {
  const b = e.target.closest('[data-add]');
  if (!b) return;
  const p = PRODUCTS.find((x) => x.id === b.dataset.add);
  if (!p) return;
  if (cart[p.id]) cart[p.id].qty++;
  else cart[p.id] = { id: p.id, name: p.name, price: p.price, icon: p.icon, qty: 1 };
  saveCart();
  sfx.click();
  toast('Ditambahkan ke keranjang 🛒');
});

// ---------- KERANJANG ----------
function saveCart() { store.set('cart2', cart); renderCart(); }

function calcTotal() {
  return Object.values(cart).reduce((n, it) => n + it.price * it.qty, 0);
}

function renderCart() {
  const keys = Object.keys(cart).filter((k) => cart[k].qty > 0);
  $('cartCount').textContent = keys.reduce((n, k) => n + cart[k].qty, 0);
  $('cartItems').innerHTML = keys.length ? keys.map((k) => {
    const it = cart[k];
    const thumb = it.design ? `<canvas class="mini" width="48" height="48" data-design="${it.design}"></canvas>` : `<span class="ico">${it.icon}</span>`;
    return `<div class="cart-row">
      ${thumb}
      <div><strong>${esc(it.name)}</strong><br><small>${rupiah(it.price)}</small></div>
      <div class="qty">
        <button data-dec="${k}" aria-label="Kurangi">−</button>
        <span>${it.qty}</span>
        <button data-inc="${k}" aria-label="Tambah">+</button>
      </div>
    </div>`;
  }).join('') : '<p class="empty">Keranjang masih kosong. Yuk belanja di toko atau buat desainmu!</p>';
  const t = calcTotal();
  $('tSub').textContent = rupiah(t);
  $('tTotal').textContent = rupiah(t);
  paintMinis();
}

$('cartItems').addEventListener('click', (e) => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if (inc && cart[inc.dataset.inc]) cart[inc.dataset.inc].qty++;
  if (dec && cart[dec.dataset.dec]) {
    cart[dec.dataset.dec].qty--;
    if (cart[dec.dataset.dec].qty <= 0) delete cart[dec.dataset.dec];
  }
  if (inc || dec) saveCart();
});
$('clearCart').addEventListener('click', () => { cart = {}; saveCart(); });

// ---------- CHECKOUT ----------
$('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const err = $('formError');
  err.textContent = '';
  const name = $('fName').value.trim();
  const wa = $('fWa').value.trim().replace(/[\s-]/g, '');
  const addr = $('fAddr').value.trim();
  const note = $('fNote').value.trim();
  const keys = Object.keys(cart).filter((k) => cart[k].qty > 0);

  if (!keys.length) { err.textContent = 'Keranjang masih kosong.'; return; }
  if (name.length < 2) { err.textContent = 'Isi nama dengan benar.'; return; }
  if (!/^(\+?62|0)8\d{7,12}$/.test(wa)) { err.textContent = 'Nomor WhatsApp tidak valid (contoh: 0812xxxxxxx).'; return; }
  if (addr.length < 10) { err.textContent = 'Alamat terlalu pendek, isi lebih lengkap.'; return; }

  const items = keys.map((k) => ({ id: cart[k].id, name: cart[k].name, qty: cart[k].qty, price: cart[k].price, design: cart[k].design || '' }));
  const total = calcTotal();
  const hasCustom = items.some((i) => i.design);
  const order = {
    id: 'LP' + String(orders.length + 1).padStart(4, '0'),
    date: Date.now(), name, wa, addr, note, items,
    subtotal: total, discount: 0, total, status: 'Menunggu'
  };
  orders.push(order);
  store.set('orders', orders);
  cart = {}; store.set('cart2', cart);
  if (!S.flags.ordered) { S.flags.ordered = true; saveState(); }

  const lines = order.items.map((i) => `- ${i.name} x${i.qty}${i.design ? ' (desain custom, PNG saya kirim terpisah)' : ''}`).join('\n');
  const msg = `Halo ${CONFIG.brand}! Saya ingin konfirmasi pesanan ${order.id}\n\n${lines}\n\nTotal: ${rupiah(order.total)}\nNama: ${name}\nAlamat: ${addr}${note ? '\nCatatan: ' + note : ''}`;
  $('waBtn').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  $('successText').textContent = `Nomor pesanan ${order.id} • Total ${rupiah(order.total)}. Klik tombol di bawah untuk konfirmasi & pembayaran.` +
    (hasCustom ? ' Jangan lupa unduh PNG desainmu di Studio Pixel dan kirim lewat WhatsApp.' : '');
  $('orderSuccess').hidden = false;
  $('orderSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('orderForm').reset();

  renderCart(); renderDashboard(); renderStats(); renderMember();
});

// ---------- SIMULATOR BISNIS ----------
const num = (id) => { const v = parseFloat($(id).value); return isFinite(v) && v >= 0 ? v : 0; };

function renderSim() {
  const fixed = num('sFixed'), price = num('sPrice'), cogs = num('sCogs');
  const start = num('sStart'), growth = Math.min(100, num('sGrowth')) / 100;
  const margin = price - cogs;

  $('rMargin').textContent = rupiah(margin);
  if (margin > 0) {
    const bep = Math.ceil(fixed / margin);
    $('rBepUnit').textContent = bep.toLocaleString('id-ID') + ' unit/bln';
    $('rBepRp').textContent = rupiah(bep * price);
  } else {
    $('rBepUnit').textContent = 'Tidak tercapai';
    $('rBepRp').textContent = 'Harga ≤ HPP';
  }

  const rev = [], prof = [];
  let cum = 0, bepMonth = null, totalRev = 0, totalProf = 0;
  for (let m = 0; m < 12; m++) {
    const units = Math.round(start * Math.pow(1 + growth, m));
    const r = units * price;
    const p = units * margin - fixed;
    rev.push(r); prof.push(p);
    totalRev += r; totalProf += p; cum += p;
    if (bepMonth === null && cum >= 0) bepMonth = m + 1;
  }
  $('rProfit1').textContent = rupiah(prof[0]);
  $('rTotalRev').textContent = rupiah(totalRev);
  $('rTotalProfit').textContent = rupiah(totalProf);
  $('rBepMonth').textContent = bepMonth ? 'Bulan ke-' + bepMonth : 'Belum tercapai dalam 12 bulan';
  drawChart(rev, prof);
}

function drawChart(rev, prof) {
  const cv = $('projCanvas');
  const w = cv.clientWidth;
  if (!w) return;
  const h = 260, dpr = window.devicePixelRatio || 1;
  cv.width = w * dpr; cv.height = h * dpr;
  const c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);

  const css = getComputedStyle(document.documentElement);
  const cMuted = css.getPropertyValue('--muted').trim() || '#999';
  const cAccent = css.getPropertyValue('--accent').trim() || '#fc0';
  const cGreen = css.getPropertyValue('--green').trim() || '#3d9';
  const cLine = css.getPropertyValue('--line').trim() || '#555';

  const padL = 62, padR = 12, padT = 14, padB = 30;
  const pw = w - padL - padR, ph = h - padT - padB;
  const maxV = Math.max(1, ...rev, ...prof);
  const minV = Math.min(0, ...prof);
  const range = maxV - minV;
  const yOf = (v) => padT + ph - ((v - minV) / range) * ph;

  c.font = '11px monospace';
  c.textAlign = 'right';
  c.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const v = minV + (range * i) / 4;
    const y = yOf(v);
    c.strokeStyle = cLine; c.lineWidth = 1; c.globalAlpha = 0.5;
    c.beginPath(); c.moveTo(padL, y); c.lineTo(w - padR, y); c.stroke();
    c.globalAlpha = 1;
    c.fillStyle = cMuted;
    const label = Math.abs(v) >= 1e6 ? (v / 1e6).toFixed(1) + ' jt' : Math.round(v / 1000) + ' rb';
    c.fillText(label, padL - 6, y);
  }

  const slot = pw / rev.length, bw = slot * 0.6;
  c.fillStyle = cAccent;
  rev.forEach((v, i) => {
    const x = padL + i * slot + (slot - bw) / 2;
    c.fillRect(x, yOf(v), bw, yOf(0) - yOf(v));
  });

  c.strokeStyle = cGreen; c.lineWidth = 3;
  c.beginPath();
  prof.forEach((v, i) => {
    const x = padL + i * slot + slot / 2;
    if (i === 0) c.moveTo(x, yOf(v)); else c.lineTo(x, yOf(v));
  });
  c.stroke();
  c.fillStyle = cGreen;
  prof.forEach((v, i) => c.fillRect(padL + i * slot + slot / 2 - 3, yOf(v) - 3, 6, 6));

  c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = cMuted;
  rev.forEach((_, i) => c.fillText('B' + (i + 1), padL + i * slot + slot / 2, h - padB + 8));
}
['sFixed', 'sPrice', 'sCogs', 'sStart', 'sGrowth'].forEach((id) => $(id).addEventListener('input', renderSim));
window.addEventListener('resize', renderSim);

// ---------- ULASAN ----------
function renderReviews() {
  $('reviewList').innerHTML = reviews.slice().reverse().map((r) => `
    <div class="review">
      <strong>${esc(r.name)}</strong> ${'⭐'.repeat(r.rate)}<br>
      ${esc(r.text)}<br>
      <small>${new Date(r.date).toLocaleDateString('id-ID')}</small>
    </div>`).join('');
}
$('reviewForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('rName').value.trim();
  const text = $('rText').value.trim();
  if (!name || !text) return;
  reviews.push({ name, text, rate: Number($('rRate').value), date: Date.now() });
  store.set('reviews', reviews);
  $('reviewForm').reset();
  renderReviews();
  toast('Terima kasih atas masukanmu! 💛');
});

// ---------- DASHBOARD ----------
function renderDashboard() {
  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const pending = orders.filter((o) => o.status === 'Menunggu').length;
  const tally = {};
  orders.forEach((o) => o.items.forEach((i) => { tally[i.name] = (tally[i.name] || 0) + i.qty; }));
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];

  $('dOrders').textContent = orders.length;
  $('dRevenue').textContent = rupiah(revenue);
  $('dPending').textContent = pending;
  $('dTop').textContent = top ? top[0].split(' ').slice(0, 2).join(' ') : '-';

  $('orderEmpty').style.display = orders.length ? 'none' : 'block';
  $('orderRows').innerHTML = orders.slice().reverse().map((o) => `
    <tr>
      <td>${esc(o.id)}</td>
      <td>${new Date(o.date).toLocaleDateString('id-ID')}</td>
      <td>${esc(o.name)}</td>
      <td>${o.items.map((i) => (i.design ? `<canvas class="mini" width="48" height="48" data-design="${esc(i.design)}"></canvas> ` : '') + esc(i.name) + ' x' + i.qty).join('<br>')}</td>
      <td>${rupiah(o.total)}</td>
      <td><button class="status ${o.status === 'Selesai' ? 'done' : ''}" data-toggle="${esc(o.id)}">${esc(o.status)}</button></td>
      <td><button class="del" data-del="${esc(o.id)}" aria-label="Hapus">✕</button></td>
    </tr>`).join('');
  paintMinis();
}

$('orderRows').addEventListener('click', (e) => {
  const tg = e.target.closest('[data-toggle]');
  const dl = e.target.closest('[data-del]');
  if (tg) {
    const o = orders.find((x) => x.id === tg.dataset.toggle);
    if (o) o.status = o.status === 'Selesai' ? 'Menunggu' : 'Selesai';
  }
  if (dl && confirm('Hapus pesanan ini?')) {
    orders = orders.filter((x) => x.id !== dl.dataset.del);
  }
  if (tg || dl) { store.set('orders', orders); renderDashboard(); renderStats(); }
});

$('exportCsv').addEventListener('click', () => {
  if (!orders.length) { toast('Belum ada pesanan untuk diekspor'); return; }
  const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  const rows = [['ID', 'Tanggal', 'Nama', 'WhatsApp', 'Alamat', 'Item', 'Total', 'Status']];
  orders.forEach((o) => rows.push([
    o.id, new Date(o.date).toISOString(), o.name, o.wa, o.addr,
    o.items.map((i) => `${i.name} x${i.qty}${i.design ? ' [desain custom]' : ''}`).join('; '), o.total, o.status
  ]));
  const csv = rows.map((r) => r.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'pesanan-lokapixel.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('seedDemo').addEventListener('click', () => {
  ['Budi', 'Sari', 'Dimas', 'Putri', 'Andi'].forEach((n, i) => {
    const p1 = PRODUCTS[i % PRODUCTS.length];
    const p2 = PRODUCTS[(i + 2) % PRODUCTS.length];
    const items = [
      { id: p1.id, name: p1.name, qty: 1 + (i % 2), price: p1.price, design: '' },
      { id: p2.id, name: p2.name, qty: 1, price: p2.price, design: '' }
    ];
    const sub = items.reduce((s, x) => s + x.price * x.qty, 0);
    orders.push({
      id: 'LP' + String(orders.length + 1).padStart(4, '0'),
      date: Date.now() - i * 86400000, name: n, wa: '081200000000', addr: 'Alamat contoh (data demo)', note: '',
      items, subtotal: sub, discount: 0, total: sub, status: i % 2 ? 'Selesai' : 'Menunggu'
    });
  });
  store.set('orders', orders);
  renderDashboard(); renderStats();
  toast('Data demo ditambahkan ✨');
});

$('resetAll').addEventListener('click', () => {
  if (!confirm('Hapus semua pesanan, progres game, dan desain di perangkat ini?')) return;
  orders = []; cart = {};
  S = freshState();
  grid = new Array(N * N).fill(0); undoStack = [];
  ['state', 'orders', 'cart2', 'draft'].forEach((k) => { try { localStorage.removeItem('lokapixel_' + k); } catch (e) { /* abaikan */ } });
  selLevel = 0;
  $('playerName').value = '';
  renderAll();
  toast('Semua data dihapus');
});

// ---------- ANIMASI MUNCUL SAAT SCROLL ----------
function initReveal() {
  const els = document.querySelectorAll('.section-title, .section-sub, .info-card, .sw, .timeline > div, .sim-box, .sim-result, .chart-box, .panel, .canvas-box, .tools-box, .quiz-box');
  els.forEach((el) => el.classList.add('reveal'));
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  els.forEach((el) => io.observe(el));
  setTimeout(() => els.forEach((el) => el.classList.add('in')), 4000);
}

// ---------- INIT ----------
function renderAll() {
  applyTheme();
  renderLevels(); drawIdle(); renderBoard();
  renderMember(); renderChars(); renderStats();
  renderPalette(); setTool('pen'); drawGrid(); updatePxPrice();
  renderQuiz();
  renderFilters(); renderProducts(); renderCart();
  renderReviews(); renderDashboard(); renderSim();
}
renderAll();
initReveal();
