// ===========================
// Pixel Icon System
// アクセス数に応じてピクセルが増加し、
// 10の倍数でカラーティアが変化する
// ===========================

const PIXEL_CELL = 24;   // ピクセル1個のサイズ + ギャップ
const PIXEL_SIZE = 22;   // 実際に描画するサイズ
const GRID_CENTER = 256; // SVG viewBox中央
const GRID_COLS = 10;    // 10×10 = 最大100ピクセル
const MAX_PIXELS = GRID_COLS * GRID_COLS;
const STORAGE_KEY = 'ts_portfolio_visits';

// カラーティア定義（10アクセスごとに色が変わる）
const COLOR_TIERS = [
  { min: 0,  color: '#3b82f6', label: 'Blue'    }, // 1〜9
  { min: 10, color: '#06b6d4', label: 'Cyan'    }, // 10〜19
  { min: 20, color: '#6366f1', label: 'Indigo'  }, // 20〜29
  { min: 30, color: '#10b981', label: 'Emerald' }, // 30〜39
  { min: 40, color: '#f59e0b', label: 'Amber'   }, // 40〜49
  { min: 50, color: '#ef4444', label: 'Red'     }, // 50+
];

// ピクセルの出現順序（シード付きシャッフルで毎回同じ順番）
function seededShuffle(arr, seed) {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1664525) + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildPixelOrder() {
  const all = [];
  for (let row = 0; row < GRID_COLS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      all.push({ row, col });
    }
  }
  return seededShuffle(all, 98765);
}

const PIXEL_ORDER = buildPixelOrder();

// アクセス数からカラーを取得
function getColor(count) {
  let color = COLOR_TIERS[0].color;
  for (const tier of COLOR_TIERS) {
    if (count >= tier.min) color = tier.color;
  }
  return color;
}

// SVGにrectを追加（フェードイン付き）
function createRect(row, col, color, animate = false) {
  const ns = 'http://www.w3.org/2000/svg';
  const rect = document.createElementNS(ns, 'rect');
  const x = GRID_CENTER + (col - GRID_COLS / 2) * PIXEL_CELL;
  const y = GRID_CENTER + (row - GRID_COLS / 2) * PIXEL_CELL;
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', PIXEL_SIZE);
  rect.setAttribute('height', PIXEL_SIZE);
  rect.setAttribute('fill', color);
  rect.setAttribute('rx', '2');

  if (animate) {
    rect.style.opacity = '0';
    rect.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { rect.style.opacity = '0.9'; });
    });
  } else {
    rect.style.opacity = '0.9';
  }
  return rect;
}

// 全ピクセルグループを更新
function renderAllPixelGroups(count, animate = false) {
  const groups = document.querySelectorAll('.pixel-fill');
  const visible = Math.min(count, MAX_PIXELS);
  const color = getColor(count);

  groups.forEach(group => {
    const existing = group.querySelectorAll('rect');

    // ティア変化時：既存ピクセルの色を更新
    existing.forEach(r => {
      r.style.transition = 'fill 0.8s ease';
      r.setAttribute('fill', color);
    });

    // 新しいピクセルを追加
    for (let i = existing.length; i < visible; i++) {
      const { row, col } = PIXEL_ORDER[i];
      group.appendChild(createRect(row, col, color, animate));
    }
  });
}

// ティア変化の通知バッジ
function showTierBadge(count, color) {
  const tier = Math.floor(count / 10);
  const tierInfo = COLOR_TIERS[Math.min(tier, COLOR_TIERS.length - 1)];

  const badge = document.createElement('div');
  badge.className = 'pixel-tier-badge';
  badge.innerHTML = `
    <span class="pixel-tier-dot" style="background:${color}"></span>
    <span>Tier ${tier} — ${tierInfo.label}</span>
  `;
  document.body.appendChild(badge);

  requestAnimationFrame(() => badge.classList.add('visible'));
  setTimeout(() => {
    badge.classList.remove('visible');
    setTimeout(() => badge.remove(), 500);
  }, 2500);
}

// アクセスカウンターを取得・更新
function getVisitCount() {
  const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
  const count = Math.min(stored + 1, MAX_PIXELS);
  localStorage.setItem(STORAGE_KEY, count);
  return count;
}

// ===========================
// 外部から呼び出すエントリポイント
// ===========================
window.initPixelIcons = function () {
  const count = getVisitCount();
  const prevCount = count - 1;
  const tierChanged = count > 0 && count % 10 === 0;

  // ローダー完了後にアニメーション付きで描画
  renderAllPixelGroups(count, true);

  // ティア変化時にバッジを表示
  if (tierChanged && count > 0) {
    setTimeout(() => showTierBadge(count, getColor(count)), 1200);
  }

  // デバッグ用（コンソールで確認可能）
  console.log(`[PixelIcon] visits: ${count}, color: ${getColor(count)}, tier: ${Math.floor(count / 10)}`);
};
