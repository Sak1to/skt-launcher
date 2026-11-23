/* =========================================================
   SKT Launcher — site script
   ========================================================= */

// 👉 Вставь сюда ссылку на файл/релиз лаунчера
const DOWNLOAD_URL = "https://github.com/USERNAME/skt-launcher/releases/latest";

const isTouch = matchMedia("(hover: none)").matches || window.innerWidth < 900;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const T = "\uFE0E"; // force text (not emoji) glyphs
const GLYPH = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };

document.body.classList.add("loading");
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll(".js-download").forEach((a) => {
  a.href = DOWNLOAD_URL;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Split text ---------- */
document.querySelectorAll(".split").forEach((el, i) => {
  const text = el.textContent.trim();
  el.textContent = "";
  [...text].forEach((ch, j) => {
    const s = document.createElement("span");
    s.className = "char";
    s.textContent = ch;
    s.style.transitionDelay = `${0.15 + i * 0.25 + j * 0.05}s`;
    el.appendChild(s);
  });
});

/* ---------- Preloader ---------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("done");
    document.body.classList.remove("loading");
    document.querySelectorAll(".split").forEach((el) => el.classList.add("in"));
    buildHeroBoard();
  }, reduceMotion ? 0 : 1400);
});

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
        e.target.querySelectorAll?.(".count").forEach(countUp);
        if (e.target.classList.contains("count")) countUp(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => {
  // stagger siblings
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.setProperty("--d", `${sibs.indexOf(el) * 0.08}s`);
  io.observe(el);
});

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 1;
  const to = +el.dataset.to;
  const prefix = el.dataset.prefix ? el.dataset.prefix.replace("&lt;", "<") : "";
  const dur = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = prefix + Math.round(to * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Nav: hide on scroll, burger, progress ---------- */
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
let lastY = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!navLinks.classList.contains("open")) nav.classList.toggle("hidden", y > lastY && y > 300);
    lastY = y;
  },
  { passive: true }
);
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

/* ---------- Custom cursor ---------- */
if (!isTouch) {
  const cur = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px"; dot.style.top = my + "px";
  });
  (function loop() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cur.style.left = cx + "px"; cur.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button, .card, .char").forEach((el) => {
    el.addEventListener("mouseenter", () => cur.classList.add("hover"));
    el.addEventListener("mouseleave", () => cur.classList.remove("hover"));
  });

  /* Magnetic buttons */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });

  /* Tilt cards */
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

/* ---------- Hero 3D board ---------- */
function buildHeroBoard() {
  const board = document.getElementById("board3d");
  if (board.childElementCount) return;
  // A sharp middlegame-ish position for the hero
  const pos = {
    a8: "br", e8: "bk", f8: "br", b7: "bp", f7: "bp", g7: "bp", c6: "bn", e6: "bp", d5: "bq",
    d4: "wp", f3: "wn", c3: "wb", e3: "wp", f2: "wp", g2: "wp", d1: "wq", g1: "wk", a1: "wr",
  };
  const hl = ["f3", "e5"];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sqName = "abcdefgh"[col] + (8 - row);
      const sq = document.createElement("div");
      sq.className = "sq " + ((row + col) % 2 ? "d" : "l") + (hl.includes(sqName) ? " hl" : "");
      const p = pos[sqName];
      if (p) {
        const pc = document.createElement("span");
        pc.className = "pc " + p[0];
        pc.textContent = GLYPH[p[1]] + T;
        pc.style.animationDelay = `${(row * 8 + col) * 0.012}s`;
        sq.appendChild(pc);
      }
      board.appendChild(sq);
    }
  }
}

// Parallax board on mouse / scroll
const board3d = document.getElementById("board3d");
const heroVisual = document.getElementById("heroVisual");
if (!isTouch) {
  addEventListener("mousemove", (e) => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    board3d.style.setProperty("--rz", `${-38 + x * 24}deg`);
    board3d.style.setProperty("--rx", `${58 - y * 14}deg`);
  });
}
addEventListener(
  "scroll",
  () => {
    const y = Math.min(scrollY, innerHeight);
    heroVisual.style.transform = `translateY(${y * 0.25}px) scale(${1 - y / innerHeight * 0.12})`;
    heroVisual.style.opacity = 1 - y / innerHeight * 0.9;
  },
  { passive: true }
);

/* ---------- Background canvas (particles) ---------- */
(function bg() {
  const c = document.getElementById("bg");
  const ctx = c.getContext("2d");
  let w, h, dpr, pts;
  const mouse = { x: -9999, y: -9999 };
  const N = isTouch ? 38 : 85;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3 * dpr, vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      g: Math.random() < 0.5,
    }));
  }
  resize();
  addEventListener("resize", resize);
  addEventListener("mousemove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });

  const LINK = 140;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    const link = LINK * dpr;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 200 * dpr) { p.x -= dx * 0.004; p.y -= dy * 0.004; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.g ? "rgba(198,255,61,.7)" : "rgba(139,108,255,.7)";
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(160,160,255,${(1 - d / link) * 0.14})`;
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- Live analysis demo ---------- */
(function analysis() {
  const boardEl = document.getElementById("miniboard");
  const evalFill = document.getElementById("evalFill");
  const evalText = document.getElementById("evalText");
  const depthEl = document.getElementById("depth");
  const npsEl = document.getElementById("nps");
  const bestEl = document.getElementById("best");
  const pvEl = document.getElementById("pv");

  // Italian Game line
  const MOVES = [
    ["e2", "e4", "e4"], ["e7", "e5", "e5"], ["g1", "f3", "Nf3"], ["b8", "c6", "Nc6"],
    ["f1", "c4", "Bc4"], ["f8", "c5", "Bc5"], ["c2", "c3", "c3"], ["g8", "f6", "Nf6"],
    ["d2", "d4", "d4"], ["e5", "d4", "exd4"], ["c3", "d4", "cxd4"], ["c5", "b4", "Bb4+"],
    ["c1", "d2", "Bd2"], ["b4", "d2", "Bxd2+"], ["b1", "d2", "Nbxd2"], ["d7", "d5", "d5!"],
  ];
  const EVALS = [0.3, 0.32, 0.28, 0.34, 0.3, 0.38, 0.33, 0.45, 0.31, 0.4, 0.36, 0.28, 0.35, 0.3, 0.34, 0.18];

  const START = {
    a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
  };
  for (const f of "abcdefgh") { START[f + "2"] = "wp"; START[f + "7"] = "bp"; }

  const xy = (s) => ["abcdefgh".indexOf(s[0]), 8 - +s[1]];
  const squares = {};
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement("div");
      sq.className = "sq " + ((r + c) % 2 ? "d" : "l");
      boardEl.appendChild(sq);
      squares["abcdefgh"[c] + (8 - r)] = sq;
    }
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "arrow");
  svg.setAttribute("viewBox", "0 0 8 8");
  svg.innerHTML = `<defs><marker id="ah" markerWidth="4" markerHeight="4" refX="2.2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 z" fill="rgba(198,255,61,.9)"/></marker></defs><line id="arrowLine" stroke="rgba(198,255,61,.75)" stroke-width=".16" stroke-linecap="round" marker-end="url(#ah)" opacity="0"/>`;

  let pieces = {}; // square -> element
  let i = 0;

  function place(el, s) {
    const [x, y] = xy(s);
    el.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
  }
  function reset() {
    boardEl.querySelectorAll(".p").forEach((p) => p.remove());
    Object.values(squares).forEach((s) => s.classList.remove("from", "to"));
    pieces = {};
    for (const [s, p] of Object.entries(START)) {
      const el = document.createElement("div");
      el.className = "p " + p[0];
      el.textContent = GLYPH[p[1]] + T;
      place(el, s);
      boardEl.appendChild(el);
      pieces[s] = el;
    }
    boardEl.appendChild(svg);
    i = 0;
    setEval(0.2);
    showBest();
  }
  function setEval(v) {
    const pct = Math.max(5, Math.min(95, 50 + v * 12));
    evalFill.style.height = pct + "%";
    evalText.textContent = (v >= 0 ? "+" : "") + v.toFixed(2);
  }
  function showBest() {
    const next = MOVES[i];
    const line = svg.querySelector("#arrowLine");
    if (!next) { line.setAttribute("opacity", 0); bestEl.textContent = "—"; return; }
    const [x1, y1] = xy(next[0]);
    const [x2, y2] = xy(next[1]);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const k = (len - 0.35) / len;
    line.setAttribute("x1", x1 + 0.5); line.setAttribute("y1", y1 + 0.5);
    line.setAttribute("x2", x1 + 0.5 + (x2 - x1) * k); line.setAttribute("y2", y1 + 0.5 + (y2 - y1) * k);
    line.setAttribute("opacity", 1);
    bestEl.textContent = next[2];
    const moveNo = Math.floor(i / 2) + 1;
    const pv = MOVES.slice(i, i + 6).map((m, k2) => {
      const idx = i + k2;
      return (idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}.` : k2 === 0 ? `${moveNo}…` : "") + m[2];
    });
    pvEl.textContent = "PV: " + pv.join(" ");
  }
  function animateDepth(target) {
    let d = 1;
    const id = setInterval(() => {
      d += Math.ceil(Math.random() * 3);
      if (d >= target) { d = target; clearInterval(id); }
      depthEl.textContent = d;
      npsEl.textContent = (2.1 + Math.random() * 0.9).toFixed(1) + "M";
    }, 70);
  }
  function step() {
    if (i >= MOVES.length) { setTimeout(reset, 1800); setTimeout(step, 3200); return; }
    const [from, to] = MOVES[i];
    Object.values(squares).forEach((s) => s.classList.remove("from", "to"));
    squares[from].classList.add("from");
    squares[to].classList.add("to");
    const el = pieces[from];
    if (pieces[to]) {
      const cap = pieces[to];
      cap.classList.add("gone");
      setTimeout(() => cap.remove(), 400);
    }
    place(el, to);
    delete pieces[from];
    pieces[to] = el;
    setEval(EVALS[i]);
    i++;
    showBest();
    animateDepth(26 + Math.floor(Math.random() * 12));
    setTimeout(step, 1700);
  }

  reset();
  // start when visible
  let started = false;
  new IntersectionObserver((es) => {
    if (es[0].isIntersecting && !started) { started = true; setTimeout(step, 600); }
  }, { threshold: 0.3 }).observe(boardEl);
})();
