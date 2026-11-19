/* ============ LOKAPIXEL — script.js ============
   Semua data disimpan di localStorage (database lokal browser),
   sehingga website berjalan offline & di GitHub Pages tanpa server.
================================================= */

// ---------- KONFIGURASI (ubah sesuai bisnismu) ----------
const CONFIG = {
  brand: 'Lokapixel',
  whatsapp: '6281234567890',   // GANTI dengan nomor WhatsApp kamu (format 62...)
  gameSeconds: 30
};

const PRODUCTS = [
  { id: 'p1', name: 'Stiker Pack Legenda Nusantara', cat: 'Stiker', price: 15000, icon: '🎴', desc: 'Isi 8 stiker vinyl tahan air: Kancil, Garuda, Barong, dan kawan-kawan.' },
  { id: 'p2', name: 'Gantungan Kunci Gatotkaca Pixel', cat: 'Aksesori', price: 25000, icon: '🗝️', desc: 'Akrilik 2 sisi, ukuran 5 cm. Si otot kawat tulang besi versi 8-bit.' },
  { id: 'p3', name: 'Enamel Pin Si Kancil', cat: 'Aksesori', price: 35000, icon: '📌', desc: 'Pin logam berwarna dengan pengunci karet. Koleksi wajib gamer cerdik.' },
  { id: 'p4', name: 'Poster A3 Wayang Pixel', cat: 'Dekorasi', price: 30000, icon: '🖼️', desc: 'Poster art print di kertas art paper 210 gsm untuk dekor meja gaming.' },
  { id: 'p5', name: 'Mousepad Peta Nusantara', cat: 'Dekorasi', price: 75000, icon: '🗺️', desc: 'Mousepad 70x30 cm dengan peta pixel kepulauan Indonesia. Anti slip.' },
  { id: 'p6', name: 'Kaos Garuda 8-Bit', cat: 'Fashion', price: 99000, icon: '👕', desc: 'Katun combed 24s, sablon DTF awet. Tersedia S–XXL.' }
];

const GAME_TIERS = [
  { min: 30, pct: 15 },
  { min: 20, pct: 10 },
  { min: 10, pct: 5 }
];

// ---------- UTIL & STORAGE ----------
const $ = (id) => document.getElementById(id);
const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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

let cart = store.get('cart', {});          // { productId: qty }
let orders = store.get('orders', []);
let reviews = store.get('reviews', [
  { name: 'Rani', text: 'Usul: karakter Cut Nyak Dhien versi pixel!', rate: 5, date: Date.now() }
]);
let voucher = store.get('voucher', null);  // { pct, score }
let bestScore = store.get('best', 0);

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

// ---------- NAV ----------
$('menuBtn').addEventListener('click', () => $('navLinks').classList.toggle('open'));
$('navLinks').addEventListener('click', (e) => { if (e.target.tagName === 'A') $('navLinks').classList.remove('open'); });
$('year').textContent = new Date().getFullYear();

// ---------- SHOP ----------
let activeCat = 'Semua';

function renderFilters() {
  const cats = ['Semua', ...new Set(PRODUCTS.map((p) => p.cat))];
  $('filters').innerHTML = cats.map((c) =>
    `<button class="chip ${c === activeCat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
}
$('filters').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  activeCat = b.dataset.cat;
  renderFilters();
  renderProducts();
});

function renderProducts() {
  const list = PRODUCTS.filter((p) => activeCat === 'Semua' || p.cat === activeCat);
  $('productGrid').innerHTML = list.map((p) => `
    <article class="product">
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
  const id = b.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  toast('Ditambahkan ke keranjang 🛒');
});

// ---------- CART ----------
function saveCart() { store.set('cart', cart); renderCart(); }

function calcTotals() {
  let sub = 0;
  for (const id in cart) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) sub += p.price * cart[id];
  }
  const disc = voucher ? Math.round(sub * voucher.pct / 100) : 0;
  return { sub, disc, total: sub - disc };
}

function renderCart() {
  const ids = Object.keys(cart).filter((id) => PRODUCTS.some((p) => p.id === id) && cart[id] > 0);
  const count = ids.reduce((n, id) => n + cart[id], 0);
  $('cartCount').textContent = count;

  $('cartItems').innerHTML = ids.length ? ids.map((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return `<div class="cart-row">
      <span class="ico">${p.icon}</span>
      <div><strong>${esc(p.name)}</strong><br><small>${rupiah(p.price)}</small></div>
      <div class="qty">
        <button data-dec="${id}" aria-label="Kurangi">−</button>
        <span>${cart[id]}</span>
        <button data-inc="${id}" aria-label="Tambah">+</button>
      </div>
    </div>`;
  }).join('') : '<p class="empty">Keranjang masih kosong. Yuk belanja di toko!</p>';

  const t = calcTotals();
  $('tSub').textContent = rupiah(t.sub);
  $('tDisc').textContent = '- ' + rupiah(t.disc) + (voucher ? ` (${voucher.pct}%)` : '');
  $('tTotal').textContent = rupiah(t.total);
}

$('cartItems').addEventListener('click', (e) => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if (inc) cart[inc.dataset.inc]++;
  if (dec) {
    cart[dec.dataset.dec]--;
    if (cart[dec.dataset.dec] <= 0) delete cart[dec.dataset.dec];
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
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  if (!ids.length) { err.textContent = 'Keranjang masih kosong.'; return; }
  if (name.length < 2) { err.textContent = 'Isi nama dengan benar.'; return; }
  if (!/^(\+?62|0)8\d{7,12}$/.test(wa)) { err.textContent = 'Nomor WhatsApp tidak valid (contoh: 0812xxxxxxx).'; return; }
  if (addr.length < 10) { err.textContent = 'Alamat terlalu pendek, isi lebih lengkap.'; return; }

  const items = ids.map((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return { id, name: p.name, qty: cart[id], price: p.price };
  });
  const t = calcTotals();
  const order = {
    id: 'LP' + String(orders.length + 1).padStart(4, '0'),
    date: Date.now(), name, wa, addr, note, items,
    subtotal: t.sub, discount: t.disc, total: t.total,
    voucher: voucher ? voucher.pct : 0, status: 'Menunggu'
  };
  orders.push(order);
  store.set('orders', orders);

  // voucher hanya sekali pakai
  voucher = null; store.set('voucher', null);
  cart = {}; store.set('cart', cart);

  const lines = order.items.map((i) => `- ${i.name} x${i.qty}`).join('\n');
  const msg = `Halo ${CONFIG.brand}! Saya ingin konfirmasi pesanan ${order.id}\n\n${lines}\n\nTotal: ${rupiah(order.total)}\nNama: ${name}\nAlamat: ${addr}${note ? '\nCatatan: ' + note : ''}`;
  $('waBtn').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  $('successText').textContent = `Nomor pesanan ${order.id} • Total ${rupiah(order.total)}. Klik tombol di bawah untuk konfirmasi & pembayaran.`;
  $('orderSuccess').hidden = false;
  $('orderSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('orderForm').reset();

  renderCart(); renderVoucher(); renderDashboard(); renderStats();
});

// ---------- MINI GAME: PIXEL PANEN ----------
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const ICONS = [
  { e: '🪙', pts: 1, w: 6 },
  { e: '⭐', pts: 3, w: 2 },
  { e: '💣', pts: -3, w: 2 }
];
let game = { running: false, score: 0, left: CONFIG.gameSeconds, items: [], lastSpawn: 0, last: 0, timer: null, raf: null };

function pickIcon() {
  const total = ICONS.reduce((n, i) => n + i.w, 0);
  let r = Math.random() * total;
  for (const i of ICONS) { if ((r -= i.w) < 0) return i; }
  return ICONS[0];
}

function startGame() {
  game.running = true;
  game.score = 0;
  game.left = CONFIG.gameSeconds;
  game.items = [];
  game.lastSpawn = 0;
  game.last = performance.now();
  $('gScore').textContent = 0;
  $('gTime').textContent = game.left;
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
  const dt = Math.min(0.05, (now - game.last) / 1000);
  game.last = now;
  const elapsed = CONFIG.gameSeconds - game.left;

  // spawn makin cepat seiring waktu
  const interval = Math.max(0.35, 0.8 - elapsed * 0.012);
  game.lastSpawn += dt;
  if (game.lastSpawn >= interval) {
    game.lastSpawn = 0;
    const ic = pickIcon();
    game.items.push({ ...ic, x: 30 + Math.random() * (W - 60), y: -30, vy: 110 + Math.random() * 80 + elapsed * 3, size: 40 });
  }

  game.items.forEach((it) => { it.y += it.vy * dt; });
  game.items = game.items.filter((it) => it.y < H + 40);

  draw();
  game.raf = requestAnimationFrame(loop);
}

function draw() {
  ctx.fillStyle = '#0b0b1e';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1b1b3a';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  game.items.forEach((it) => ctx.fillText(it.e, it.x, it.y));
  (game.pops || []).forEach((p) => {
    ctx.fillStyle = p.pts > 0 ? '#3ddc97' : '#ff5d8f';
    ctx.font = 'bold 22px monospace';
    ctx.fillText((p.pts > 0 ? '+' : '') + p.pts, p.x, p.y);
    p.y -= 0.8; p.life--;
  });
  game.pops = (game.pops || []).filter((p) => p.life > 0);
}

function handleHit(clientX, clientY) {
  if (!game.running) return;
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (W / rect.width);
  const y = (clientY - rect.top) * (H / rect.height);
  for (let i = game.items.length - 1; i >= 0; i--) {
    const it = game.items[i];
    if (Math.hypot(it.x - x, it.y - y) < 30) {
      game.score = Math.max(0, game.score + it.pts);
      $('gScore').textContent = game.score;
      game.pops = game.pops || [];
      game.pops.push({ x: it.x, y: it.y, pts: it.pts, life: 30 });
      game.items.splice(i, 1);
      return;
    }
  }
}
canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); handleHit(e.clientX, e.clientY); });

function endGame() {
  game.running = false;
  clearInterval(game.timer);
  cancelAnimationFrame(game.raf);
  const s = game.score;
  if (s > bestScore) { bestScore = s; store.set('best', bestScore); }

  const tier = GAME_TIERS.find((t) => s >= t.min);
  let msg;
  if (tier && (!voucher || tier.pct > voucher.pct)) {
    voucher = { pct: tier.pct, score: s };
    store.set('voucher', voucher);
    msg = `Skor ${s}! Kamu dapat voucher diskon ${tier.pct}% 🎉 Otomatis terpasang di checkout.`;
  } else if (tier) {
    msg = `Skor ${s}. Voucher kamu saat ini (${voucher.pct}%) sudah sama atau lebih tinggi.`;
  } else {
    msg = `Skor ${s}. Butuh minimal 10 poin untuk dapat voucher. Coba lagi!`;
  }
  $('gameMsgTitle').textContent = 'Waktu habis!';
  $('gameMsg').textContent = msg;
  $('gameStart').textContent = '↻ Main Lagi';
  $('gameOverlay').classList.remove('hide');
  renderVoucher(); renderCart(); renderStats();
}
$('gameStart').addEventListener('click', startGame);

function renderVoucher() {
  $('voucherStatus').textContent = voucher
    ? `🎟️ Voucher aktif: diskon ${voucher.pct}% (dari skor ${voucher.score}). Berlaku untuk 1 pesanan.`
    : 'Belum ada voucher. Ayo main!';
  $('gBest').textContent = bestScore;
}

function renderStats() {
  $('statOrders').textContent = orders.length;
  $('statBest').textContent = bestScore;
  $('gBest').textContent = bestScore;
}

// ---------- REVIEWS ----------
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
      <td>${o.items.map((i) => esc(i.name) + ' x' + i.qty).join('<br>')}</td>
      <td>${rupiah(o.total)}</td>
      <td><button class="status ${o.status === 'Selesai' ? 'done' : ''}" data-toggle="${o.id}">${o.status}</button></td>
      <td><button class="del" data-del="${o.id}" aria-label="Hapus">✕</button></td>
    </tr>`).join('');
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
  const rows = [['ID', 'Tanggal', 'Nama', 'WhatsApp', 'Alamat', 'Item', 'Subtotal', 'Diskon', 'Total', 'Status']];
  orders.forEach((o) => rows.push([
    o.id, new Date(o.date).toISOString(), o.name, o.wa, o.addr,
    o.items.map((i) => `${i.name} x${i.qty}`).join('; '), o.subtotal, o.discount, o.total, o.status
  ]));
  const csv = rows.map((r) => r.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = 'pesanan-lokapixel.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('seedDemo').addEventListener('click', () => {
  const demoNames = ['Budi', 'Sari', 'Dimas', 'Putri', 'Andi'];
  demoNames.forEach((n, i) => {
    const p1 = PRODUCTS[i % PRODUCTS.length];
    const p2 = PRODUCTS[(i + 2) % PRODUCTS.length];
    const items = [{ id: p1.id, name: p1.name, qty: 1 + (i % 2), price: p1.price }, { id: p2.id, name: p2.name, qty: 1, price: p2.price }];
    const sub = items.reduce((s, x) => s + x.price * x.qty, 0);
    orders.push({
      id: 'LP' + String(orders.length + 1).padStart(4, '0'),
      date: Date.now() - i * 86400000, name: n, wa: '081200000000', addr: 'Alamat contoh (data demo)', note: '',
      items, subtotal: sub, discount: 0, total: sub, voucher: 0, status: i % 2 ? 'Selesai' : 'Menunggu'
    });
  });
  store.set('orders', orders);
  renderDashboard(); renderStats();
  toast('Data demo ditambahkan ✨');
});

$('resetAll').addEventListener('click', () => {
  if (!confirm('Hapus semua pesanan, voucher, dan skor di perangkat ini?')) return;
  orders = []; voucher = null; bestScore = 0; cart = {};
  store.set('orders', orders); store.set('voucher', null); store.set('best', 0); store.set('cart', cart);
  renderAll();
  toast('Semua data dihapus');
});

// ---------- INIT ----------
function renderAll() {
  renderFilters(); renderProducts(); renderCart(); renderVoucher();
  renderReviews(); renderDashboard(); renderStats(); draw();
}
renderAll();
