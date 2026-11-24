/* =========================================================
   SKT Launcher — main motion & interaction script
   ========================================================= */

const BOT = "sktlaucnherbot";
const DOWNLOAD_URL = `https://t.me/${BOT}`;

const isTouch = matchMedia("(hover: none)").matches;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Basics & Download Links ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
const botNameEl = document.getElementById("botName");
if (botNameEl) botNameEl.textContent = "@" + BOT;
document.querySelectorAll(".js-bot").forEach((el) => (el.textContent = "@" + BOT));
document.querySelectorAll(".js-download").forEach((a) => {
  a.href = DOWNLOAD_URL;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Kinetic Hero Title + Fit Guard ---------- */
document.querySelectorAll(".split").forEach((el, lineIdx) => {
  const text = el.textContent.trim();
  el.textContent = "";
  [...text].forEach((ch, charIdx) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch;
    span.style.setProperty("--cd", `${0.04 + lineIdx * 0.14 + charIdx * 0.032}s`);
    el.appendChild(span);
  });
});

const heroTitle = document.getElementById("heroTitle");
function fitTitle() {
  if (!heroTitle) return;
  heroTitle.style.fontSize = "";
  const avail = heroTitle.parentElement.clientWidth - 2;
  const base = parseFloat(getComputedStyle(heroTitle).fontSize);
  const widest = Math.max(...[...heroTitle.querySelectorAll(".split")].map((s) => s.scrollWidth));
  if (widest > avail && avail > 100) {
    heroTitle.style.fontSize = Math.floor(base * (avail / widest) * 0.97) + "px";
  }
}
fitTitle();
(document.fonts?.ready || Promise.resolve()).then(fitTitle);
addEventListener("resize", fitTitle);

/* ---------- Sync Hero 3D Moves -> HUD Cards ---------- */
window.onChess3DMove = function (step) {
  const evalEl = document.getElementById("hudEvalVal");
  const depthEl = document.getElementById("hudEvalDepth");
  const moveEl = document.getElementById("hudMoveVal");
  const msEl = document.getElementById("hudMoveMs");
  const c1 = document.getElementById("hudEval");
  const c2 = document.getElementById("hudMove");
  if (!evalEl || !moveEl) return;
  evalEl.textContent = step.eval;
  depthEl.textContent = step.depth;
  moveEl.textContent = step.label;
  msEl.textContent = step.ms;
  [c1, c2].forEach((c) => {
    if (!c) return;
    c.classList.add("flash");
    setTimeout(() => c.classList.remove("flash"), 650);
  });
};

/* ---------- Safe Progressive Scroll Reveals ---------- */
(function initReveals() {
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  if (window.location.hash && window.location.hash !== "#top") return;

  const els = [...document.querySelectorAll(".reveal")];
  const pending = [];

  const revealEl = (el) => {
    el.classList.add("in");
    io.unobserve(el);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) revealEl(e.target);
      });
    },
    { threshold: 0.02, rootMargin: "0px 0px 40px 0px" }
  );

  const sweep = () => {
    const limit = window.innerHeight * 1.1;
    pending.forEach((el) => {
      if (!el.classList.contains("in") && el.getBoundingClientRect().top < limit) {
        revealEl(el);
      }
    });
  };

  // Defer hiding below-the-fold elements until after initial layout & any anchor jump
  requestAnimationFrame(() => {
    const limit = window.innerHeight * 0.98;
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > limit) {
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 3) * 0.045}s`);
        el.classList.add("will-reveal");
        pending.push(el);
        io.observe(el);
      }
    });
  });

  let ticking = false;
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        sweep();
      });
    },
    { passive: true }
  );
  addEventListener("hashchange", () => setTimeout(sweep, 60));
  addEventListener("resize", sweep);
})();

/* ---------- Navigation, Scroll Progress & Burger ---------- */
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
let lastY = 0;

addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (nav && navLinks && !navLinks.classList.contains("open")) {
      nav.classList.toggle("hidden", y > lastY && y > 420);
    }
    lastY = y;
  },
  { passive: true }
);

if (burger && navLinks) {
  const closeMenu = () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Desktop Micro-Interactions (Magnetic + Card Spotlight Tilt) ---------- */
if (!isTouch && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.14}px, ${y * 0.22}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mouseenter", () => card.classList.add("tilting"));
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 6}deg) rotateX(${(0.5 - py) * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("tilting");
      card.style.transform = "";
    });
  });
}

/* ---------- Interface Preview Switcher + Lightbox ---------- */
(function initPreview() {
  const wrap = document.getElementById("switch");
  const pill = document.getElementById("switchPill");
  const showcase = document.getElementById("showcase");
  if (!wrap || !pill) return;

  const btns = [...wrap.querySelectorAll(".switch__btn")];
  const shots = [...document.querySelectorAll(".shot")];

  function movePill(btn) {
    if (!btn) return;
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
  }

  function select(btn) {
    btns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", String(active));
    });
    shots.forEach((s) => s.classList.toggle("active", s.dataset.shot === btn.dataset.tab));
    if (showcase) showcase.dataset.active = btn.dataset.tab;
    movePill(btn);
  }

  btns.forEach((b) => b.addEventListener("click", () => select(b)));
  const sync = () => movePill(wrap.querySelector(".switch__btn.active"));
  sync();
  (document.fonts?.ready || Promise.resolve()).then(sync);
  addEventListener("load", sync);
  addEventListener("resize", sync);

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const lbClose = document.getElementById("lightboxClose");
  if (!lb || !lbImg) return;

  const closeLb = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
  };
  document.querySelectorAll(".js-zoom").forEach((frame) => {
    frame.addEventListener("click", () => {
      lbImg.src = frame.dataset.src;
      lbImg.alt = frame.dataset.cap || "";
      if (lbCap) lbCap.textContent = frame.dataset.cap || "";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    });
  });
  lbClose?.addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });
})();

/* ---------- Subtle Ambient Background Canvas ---------- */
(function initBg() {
  const c = document.getElementById("bg");
  if (!c) return;
  const ctx = c.getContext("2d");
  let w, h, dpr, pts;
  const mouse = { x: -9999, y: -9999 };
  const N = window.innerWidth < 700 ? 24 : 56;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.width = window.innerWidth * dpr;
    h = c.height = window.innerHeight * dpr;
    pts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22 * dpr,
      vy: (Math.random() - 0.5) * 0.22 * dpr,
      r: (Math.random() * 1.4 + 0.5) * dpr,
      lime: Math.random() < 0.45,
    }));
  }
  resize();
  addEventListener("resize", resize);
  if (!isTouch) {
    addEventListener("mousemove", (e) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    });
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const link = 125 * dpr;
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      if (Math.hypot(dx, dy) < 170 * dpr) {
        p.x -= dx * 0.0025;
        p.y -= dy * 0.0025;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.lime ? "rgba(198,255,61,.55)" : "rgba(139,92,246,.55)";
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(150,150,255,${(1 - d / link) * 0.09})`;
          ctx.lineWidth = dpr * 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- SKT Arch Live Interactive Chess Analysis ---------- */
(function initAnalysis() {
  const boardEl = document.getElementById("miniboard");
  const evalFill = document.getElementById("evalFill");
  const evalText = document.getElementById("evalText");
  const depthEl = document.getElementById("depth");
  const npsEl = document.getElementById("nps");
  const bestEl = document.getElementById("best");
  const pvSfEl = document.getElementById("pvSf");
  const pvTobyEl = document.getElementById("pvToby");
  const btnPlay = document.getElementById("btnPlay");
  const btnStep = document.getElementById("btnStep");
  const btnReset = document.getElementById("btnReset");
  if (!boardEl) return;

  // Crisp vector Staunton chess SVG paths (viewBox 0 0 45 45)
  const PIECE_SVG = {
    p: (f, s) =>
      `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="${f}" stroke="${s}" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    r: (f, s) =>
      `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/></g></svg>`,
    n: (f, s) =>
      `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><circle cx="15" cy="15.5" r="1.2" fill="${s}" stroke="none"/></g></svg>`,
    b: (f, s) =>
      `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/><path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" fill="none"/></g></svg>`,
    q: (f, s) =>
      `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="14" cy="9" r="2.5"/><circle cx="22.5" cy="8" r="2.5"/><circle cx="31" cy="9" r="2.5"/><circle cx="39" cy="12" r="2.5"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/></g></svg>`,
    k: (f, s) =>
      `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" fill="none" stroke-width="2"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0" fill="none"/></g></svg>`,
  };

  function pieceMarkup(code) {
    const isWhite = code[0] === "w";
    const fill = isWhite ? "#f7f8fc" : "#8e73f7";
    const stroke = isWhite ? "#1c1f2e" : "#181036";
    return PIECE_SVG[code[1]](fill, stroke);
  }

  // Italian Game tactical sequence + Toby AI human prediction candidate
  const MOVES = [
    { from: "e2", to: "e4", san: "e4", eval: 0.30, toby: ["d2", "d4", "d4", 31], sfPct: 64 },
    { from: "e7", to: "e5", san: "e5", eval: 0.32, toby: ["c7", "c5", "c5", 42], sfPct: 55 },
    { from: "g1", to: "f3", san: "Nf3", eval: 0.28, toby: ["f1", "c4", "Bc4", 24], sfPct: 74 },
    { from: "b8", to: "c6", san: "Nc6", eval: 0.34, toby: ["g8", "f6", "Nf6", 28], sfPct: 68 },
    { from: "f1", to: "c4", san: "Bc4", eval: 0.30, toby: ["f1", "b5", "Bb5", 39], sfPct: 58 },
    { from: "f8", to: "c5", san: "Bc5", eval: 0.38, toby: ["g8", "f6", "Nf6", 46], sfPct: 52 },
    { from: "c2", to: "c3", san: "c3", eval: 0.35, toby: ["d2", "d3", "d3", 38], sfPct: 57 },
    { from: "g8", to: "f6", san: "Nf6", eval: 0.44, toby: ["d7", "d6", "d6", 33], sfPct: 63 },
    { from: "d2", to: "d4", san: "d4", eval: 0.32, toby: ["d2", "d3", "d3", 29], sfPct: 69 },
    { from: "e5", to: "d4", san: "exd4", eval: 0.41, toby: ["c5", "b6", "Bb6", 14], sfPct: 84 },
    { from: "c3", to: "d4", san: "cxd4", eval: 0.38, toby: ["e4", "e5", "e5", 22], sfPct: 76 },
    { from: "c5", to: "b4", san: "Bb4+", eval: 0.29, toby: ["c5", "b6", "Bb6", 26], sfPct: 72 },
    { from: "c1", to: "d2", san: "Bd2", eval: 0.36, toby: ["b1", "c3", "Nc3", 35], sfPct: 61 },
    { from: "b4", to: "d2", san: "Bxd2+", eval: 0.31, toby: ["f6", "e4", "Nxe4", 31], sfPct: 66 },
    { from: "b1", to: "d2", san: "Nbxd2", eval: 0.35, toby: ["d1", "d2", "Qxd2", 21], sfPct: 77 },
    { from: "d7", to: "d5", san: "d5!", eval: 0.16, toby: ["e8", "g8", "O-O", 34], sfPct: 64 },
  ];

  const START = {
    a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
  };
  for (const f of "abcdefgh") {
    START[f + "2"] = "wp";
    START[f + "7"] = "bp";
  }

  const xy = (sq) => ["abcdefgh".indexOf(sq[0]), 8 - parseInt(sq[1], 10)];
  const squares = {};

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement("div");
      sq.className = "sq " + ((r + c) % 2 ? "d" : "l");
      boardEl.appendChild(sq);
      squares["abcdefgh"[c] + (8 - r)] = sq;
    }
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "arrows");
  svg.setAttribute("viewBox", "0 0 8 8");
  svg.innerHTML = `
    <defs>
      <marker id="ah-sf" markerWidth="3.8" markerHeight="3.8" refX="2.1" refY="1.9" orient="auto">
        <path d="M0,0 L3.8,1.9 L0,3.8 z" fill="rgba(198,255,61,.95)"/>
      </marker>
      <marker id="ah-nn" markerWidth="3.6" markerHeight="3.6" refX="2" refY="1.8" orient="auto">
        <path d="M0,0 L3.6,1.8 L0,3.6 z" fill="rgba(167,139,250,.85)"/>
      </marker>
    </defs>
    <line id="arrowNn" stroke="rgba(167,139,250,.7)" stroke-width=".14" stroke-dasharray=".22 .16" stroke-linecap="round" marker-end="url(#ah-nn)" opacity="0"/>
    <line id="arrowSf" stroke="rgba(198,255,61,.88)" stroke-width=".18" stroke-linecap="round" marker-end="url(#ah-sf)" opacity="0"/>
  `;
  const arrowSf = svg.querySelector("#arrowSf");
  const arrowNn = svg.querySelector("#arrowNn");

  let pieces = {};
  let idx = 0;
  let playing = true;
  let timer = null;

  function place(el, sq) {
    const [x, y] = xy(sq);
    el.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
  }

  function setArrow(lineEl, from, to) {
    const [x1, y1] = xy(from);
    const [x2, y2] = xy(to);
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const k = Math.max(0.2, (len - 0.34) / len);
    lineEl.setAttribute("x1", x1 + 0.5);
    lineEl.setAttribute("y1", y1 + 0.5);
    lineEl.setAttribute("x2", x1 + 0.5 + (x2 - x1) * k);
    lineEl.setAttribute("y2", y1 + 0.5 + (y2 - y1) * k);
    lineEl.setAttribute("opacity", "1");
  }

  function setEval(val) {
    const pct = Math.max(8, Math.min(92, 50 + val * 14));
    evalFill.style.height = pct + "%";
    evalText.textContent = (val >= 0 ? "+" : "") + val.toFixed(2);
  }

  function renderTelemetry() {
    const next = MOVES[idx];
    if (!next) {
      arrowSf.setAttribute("opacity", "0");
      arrowNn.setAttribute("opacity", "0");
      bestEl.textContent = "—";
      return;
    }
    setArrow(arrowSf, next.from, next.to);
    if (next.toby) {
      setArrow(arrowNn, next.toby[0], next.toby[1]);
      pvTobyEl.textContent = `Человеческий ход: ${next.san} (${next.sfPct}%) · альт. ${next.toby[2]} (${next.toby[3]}%)`;
    }
    bestEl.textContent = next.san;
    const pv = MOVES.slice(idx, idx + 6).map((m, offset) => {
      const n = idx + offset;
      if (n % 2 === 0) return `${n / 2 + 1}.${m.san}`;
      return offset === 0 ? `${Math.floor(n / 2) + 1}…${m.san}` : m.san;
    });
    pvSfEl.textContent = pv.join(" ");
  }

  function bumpDepth() {
    const target = 18 + Math.floor(Math.random() * 6);
    depthEl.textContent = `${target} ply`;
    npsEl.textContent = (2.3 + Math.random() * 0.8).toFixed(1) + "M";
  }

  function reset() {
    boardEl.querySelectorAll(".p").forEach((p) => p.remove());
    Object.values(squares).forEach((s) => s.classList.remove("from", "to"));
    pieces = {};
    for (const [sq, code] of Object.entries(START)) {
      const el = document.createElement("div");
      el.className = "p";
      el.innerHTML = pieceMarkup(code);
      place(el, sq);
      boardEl.appendChild(el);
      pieces[sq] = el;
    }
    boardEl.appendChild(svg);
    idx = 0;
    setEval(0.28);
    depthEl.textContent = "18 ply";
    npsEl.textContent = "2.6M";
    renderTelemetry();
  }

  function stepOnce() {
    if (idx >= MOVES.length) {
      reset();
      return;
    }
    const move = MOVES[idx];
    Object.values(squares).forEach((s) => s.classList.remove("from", "to"));
    squares[move.from]?.classList.add("from");
    squares[move.to]?.classList.add("to");

    const movingPiece = pieces[move.from];
    if (movingPiece) {
      if (pieces[move.to]) {
        const cap = pieces[move.to];
        cap.classList.add("gone");
        setTimeout(() => cap.remove(), 350);
      }
      place(movingPiece, move.to);
      delete pieces[move.from];
      pieces[move.to] = movingPiece;
    }
    setEval(move.eval);
    idx++;
    renderTelemetry();
    bumpDepth();
  }

  function schedule() {
    clearTimeout(timer);
    if (!playing || reduceMotion) return;
    timer = setTimeout(() => {
      stepOnce();
      schedule();
    }, idx >= MOVES.length ? 2600 : 1900);
  }

  function updatePlayBtn() {
    if (!btnPlay) return;
    btnPlay.innerHTML = playing
      ? `<svg class="ic" width="14" height="14"><use href="#i-pause"/></svg>`
      : `<svg class="ic" width="14" height="14"><use href="#i-play"/></svg>`;
    btnPlay.setAttribute("aria-label", playing ? "Пауза" : "Старт");
  }

  btnPlay?.addEventListener("click", () => {
    playing = !playing;
    updatePlayBtn();
    if (playing) schedule();
    else clearTimeout(timer);
  });
  btnStep?.addEventListener("click", () => {
    stepOnce();
    if (playing) schedule();
  });
  btnReset?.addEventListener("click", () => {
    reset();
    if (playing) schedule();
  });

  // Render full live position immediately (never blank!)
  reset();
  if (!reduceMotion) schedule();
})();
