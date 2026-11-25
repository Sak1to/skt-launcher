/* =========================================================
   SKT Launcher — Shared Runtime (qns.world architecture)
   Starfield canvas, mobile overlay menu, interactive hero
   launcher mockup, live chess analysis (Stockfish 19 + Toby),
   UI switcher + lightbox, scroll timeline & safe reveals.
   ========================================================= */

const BOT = "sktlaucnherbot";
const DOWNLOAD_URL = `https://t.me/${BOT}`;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Wire Telegram Download Links & Year ---------- */
document.querySelectorAll(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));
document.querySelectorAll(".js-download").forEach((a) => {
  a.href = DOWNLOAD_URL;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Mobile Fullscreen Overlay Menu ---------- */
(function initMobileMenu() {
  const burger = document.getElementById("qBurger");
  const menu = document.getElementById("qMobileMenu");
  if (!burger || !menu) return;
  const toggle = (force) => {
    const open = typeof force === "boolean" ? force : !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => toggle());
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
})();

/* ---------- Starfield Canvas (qns.world bottom CTA & arch hero) ---------- */
document.querySelectorAll(".js-starfield").forEach((canvas) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let w = 0, h = 0, dpr = 1, stars = [];
  const count = window.innerWidth < 700 ? 55 : 115;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.max(canvas.clientWidth, 300) * dpr;
    h = canvas.height = Math.max(canvas.clientHeight, 300) * dpr;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.45 + 0.35) * dpr,
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 0.015 + 0.005,
      vy: -(Math.random() * 0.14 + 0.04) * dpr,
      blue: Math.random() < 0.35,
    }));
  }
  resize();
  addEventListener("resize", resize);

  let inView = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => { inView = es[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
  }

  function tick() {
    if (inView) {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        st.a += st.s;
        st.y += st.vy;
        if (st.y < -4) { st.y = h + 4; st.x = Math.random() * w; }
        const alpha = 0.22 + (Math.sin(st.a) * 0.5 + 0.5) * 0.65;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = st.blue
          ? `rgba(165, 201, 219, ${alpha.toFixed(2)})`
          : `rgba(255, 255, 255, ${(alpha * 0.85).toFixed(2)})`;
        ctx.fill();
      }
    }
    if (!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
});

/* ---------- Safe Progressive Scroll Reveals ---------- */
(function initReveals() {
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  if (window.location.hash && window.location.hash !== "#top") return;
  const els = [...document.querySelectorAll(".reveal")];
  const pending = [];

  const show = (el) => { el.classList.add("in"); io.unobserve(el); };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) show(e.target); }),
    { threshold: 0.02, rootMargin: "0px 0px 40px 0px" }
  );

  requestAnimationFrame(() => {
    const limit = window.innerHeight * 0.98;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > limit) {
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 3) * 0.055}s`);
        el.classList.add("will-reveal");
        pending.push(el);
        io.observe(el);
      }
    });
  });

  const sweep = () => {
    const limit = window.innerHeight * 1.1;
    pending.forEach((el) => {
      if (!el.classList.contains("in") && el.getBoundingClientRect().top < limit) show(el);
    });
  };
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; sweep(); });
  }, { passive: true });
  addEventListener("hashchange", () => setTimeout(sweep, 60));
})();

/* ---------- Homepage Interactive Desktop Mockup (qns.world hero style) ---------- */
(function initHeroDemo() {
  const wrap = document.getElementById("showcaseWrap");
  const launchBtn = document.getElementById("demoLaunch");
  const statusTxt = document.getElementById("demoStatusTxt");
  const modeSlot = document.getElementById("demoModeVal");
  const pingSlot = document.getElementById("demoPingVal");
  if (!wrap) return;

  // Inner tabs: Интерактив / SKT Launcher / Arch 0.1
  const tabs = [...wrap.querySelectorAll(".pc-tab")];
  const panes = [...wrap.querySelectorAll(".pc-pane")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panes.forEach((p) => p.classList.toggle("active", p.dataset.pane === tab.dataset.pane));
    });
  });

  // Service switch inside demo (Chess.com / Lichess)
  let selectedSrv = "Chess.com";
  const srvBtns = [...wrap.querySelectorAll(".srv-btn")];
  srvBtns.forEach((b) => {
    b.addEventListener("click", () => {
      selectedSrv = b.dataset.srv;
      srvBtns.forEach((x) => x.classList.toggle("active", x === b));
      updateStatus();
    });
  });

  // Launch / Stop interactive toggle (just like qns.world ВКЛЮЧИТЬ button!)
  let running = true;
  function updateStatus() {
    wrap.classList.toggle("running", running);
    if (launchBtn) {
      launchBtn.classList.toggle("on", running);
      launchBtn.innerHTML = running
        ? `<svg class="ic" width="15" height="15"><use href="#i-pause"/></svg> Остановить`
        : `<svg class="ic" width="15" height="15"><use href="#i-play"/></svg> Запустить`;
    }
    if (statusTxt) {
      statusTxt.textContent = running
        ? `Активен · ${selectedSrv} · Stockfish 19 + Toby 2.0`
        : `Остановлено · ${selectedSrv} готов к запуску`;
    }
    if (modeSlot) modeSlot.textContent = running ? "18 ply · 2.7M n/s" : "Ожидание";
    if (pingSlot) pingSlot.textContent = running ? "420 ms" : "—";
  }
  launchBtn?.addEventListener("click", () => {
    running = !running;
    updateStatus();
  });
  updateStatus();
})();

/* ---------- Pill Tabs Switcher (mods.html UI showcase) + Lightbox ---------- */
(function initPillSwitcher() {
  document.querySelectorAll(".js-pill-group").forEach((group) => {
    const btns = [...group.querySelectorAll(".pill-tab")];
    const targetId = group.dataset.target;
    const container = document.getElementById(targetId);
    if (!container) return;
    const panels = [...container.querySelectorAll(".ui-shot")];
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", String(on));
        });
        panels.forEach((p) => p.classList.toggle("active", p.dataset.shot === btn.dataset.tab));
      });
    });
  });

  // Lightbox for clicking any screenshot
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbClose = document.getElementById("lightboxClose");
  if (!lb || !lbImg) return;
  const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  document.querySelectorAll(".js-zoom").forEach((el) => {
    el.addEventListener("click", () => {
      lbImg.src = el.dataset.src || el.querySelector("img")?.src || "";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    });
  });
  lbClose?.addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();

/* ---------- Scroll-Active 3-Step Timeline (arch.html, qns.world/mobile style) ---------- */
(function initTimeline() {
  const items = [...document.querySelectorAll(".step-item")];
  if (!items.length) return;
  const update = () => {
    const mid = window.innerHeight * 0.58;
    let activeIdx = 0;
    items.forEach((el, i) => {
      if (el.getBoundingClientRect().top < mid) activeIdx = i;
    });
    items.forEach((el, i) => el.classList.toggle("active", i <= activeIdx));
  };
  update();
  addEventListener("scroll", update, { passive: true });
})();

/* ---------- Live Chess Analysis Widget (supports multiple boards across pages) ---------- */
(function initChessBoards() {
  const boards = [...document.querySelectorAll(".js-chess-analysis")];
  if (!boards.length) return;

  const PIECE_SVG = {
    p: (f, s) => `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    r: (f, s) => `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/></g></svg>`,
    n: (f, s) => `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><circle cx="15" cy="15.5" r="1.2" fill="${s}" stroke="none"/></g></svg>`,
    b: (f, s) => `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/><path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" fill="none"/></g></svg>`,
    q: (f, s) => `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="14" cy="9" r="2.5"/><circle cx="22.5" cy="8" r="2.5"/><circle cx="31" cy="9" r="2.5"/><circle cx="39" cy="12" r="2.5"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/></g></svg>`,
    k: (f, s) => `<svg viewBox="0 0 45 45"><g fill="${f}" stroke="${s}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" fill="none" stroke-width="2"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0" fill="none"/></g></svg>`,
  };

  const pieceSvg = (code) => {
    const w = code[0] === "w";
    return PIECE_SVG[code[1]](w ? "#f5f8fc" : "#6ea0bd", w ? "#111722" : "#0b1521");
  };

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
  ];

  const START = {
    a1: "wr", b1: "wn", c1: "wb", d1: "wq", e1: "wk", f1: "wb", g1: "wn", h1: "wr",
    a8: "br", b8: "bn", c8: "bb", d8: "bq", e8: "bk", f8: "bb", g8: "bn", h8: "br",
  };
  for (const f of "abcdefgh") { START[f + "2"] = "wp"; START[f + "7"] = "bp"; }
  const xy = (sq) => ["abcdefgh".indexOf(sq[0]), 8 - parseInt(sq[1], 10)];

  boards.forEach((root, uid) => {
    const boardEl = root.querySelector(".miniboard");
    if (!boardEl) return;
    const evalFill = root.querySelector(".js-eval-fill");
    const evalText = root.querySelector(".js-eval-text");
    const depthEl = root.querySelector(".js-depth");
    const npsEl = root.querySelector(".js-nps");
    const bestEl = root.querySelector(".js-best");
    const pvSf = root.querySelector(".js-pv-sf");
    const pvToby = root.querySelector(".js-pv-toby");
    const btnPlay = root.querySelector(".js-play");
    const btnStep = root.querySelector(".js-step");
    const btnReset = root.querySelector(".js-reset");

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
        <marker id="ah-sf-${uid}" markerWidth="3.8" markerHeight="3.8" refX="2.1" refY="1.9" orient="auto">
          <path d="M0,0 L3.8,1.9 L0,3.8 z" fill="rgba(165,201,219,.95)"/>
        </marker>
        <marker id="ah-nn-${uid}" markerWidth="3.5" markerHeight="3.5" refX="2" refY="1.75" orient="auto">
          <path d="M0,0 L3.5,1.75 L0,3.5 z" fill="rgba(255,255,255,.55)"/>
        </marker>
      </defs>
      <line class="a-nn" stroke="rgba(255,255,255,.45)" stroke-width=".13" stroke-dasharray=".22 .16" stroke-linecap="round" marker-end="url(#ah-nn-${uid})" opacity="0"/>
      <line class="a-sf" stroke="rgba(165,201,219,.9)" stroke-width=".18" stroke-linecap="round" marker-end="url(#ah-sf-${uid})" opacity="0"/>
    `;
    const arrowSf = svg.querySelector(".a-sf");
    const arrowNn = svg.querySelector(".a-nn");

    let pieces = {}, idx = 0, playing = true, timer = null;

    const place = (el, sq) => { const [x, y] = xy(sq); el.style.transform = `translate(${x * 100}%, ${y * 100}%)`; };
    const setArrow = (line, f, t) => {
      const [x1, y1] = xy(f), [x2, y2] = xy(t);
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const k = Math.max(0.2, (len - 0.34) / len);
      line.setAttribute("x1", x1 + 0.5); line.setAttribute("y1", y1 + 0.5);
      line.setAttribute("x2", x1 + 0.5 + (x2 - x1) * k); line.setAttribute("y2", y1 + 0.5 + (y2 - y1) * k);
      line.setAttribute("opacity", "1");
    };

    function renderInfo() {
      const m = MOVES[idx];
      if (!m) { arrowSf.setAttribute("opacity", "0"); arrowNn.setAttribute("opacity", "0"); return; }
      setArrow(arrowSf, m.from, m.to);
      if (m.toby) setArrow(arrowNn, m.toby[0], m.toby[1]);
      if (bestEl) bestEl.textContent = m.san;
      const pv = MOVES.slice(idx, idx + 5).map((x, k) => {
        const n = idx + k;
        if (n % 2 === 0) return `${n / 2 + 1}.${x.san}`;
        return k === 0 ? `${Math.floor(n / 2) + 1}…${x.san}` : x.san;
      });
      if (pvSf) pvSf.textContent = pv.join(" ");
      if (pvToby && m.toby) pvToby.textContent = `Человек: ${m.san} (${m.sfPct}%) · альт. ${m.toby[2]} (${m.toby[3]}%)`;
    }

    function setEval(v) {
      if (evalFill) evalFill.style.height = Math.max(10, Math.min(90, 50 + v * 14)) + "%";
      if (evalText) evalText.textContent = (v >= 0 ? "+" : "") + v.toFixed(2);
    }

    function reset() {
      boardEl.querySelectorAll(".p").forEach((p) => p.remove());
      Object.values(squares).forEach((s) => s.classList.remove("from", "to"));
      pieces = {};
      for (const [sq, code] of Object.entries(START)) {
        const el = document.createElement("div");
        el.className = "p";
        el.innerHTML = pieceSvg(code);
        place(el, sq);
        boardEl.appendChild(el);
        pieces[sq] = el;
      }
      boardEl.appendChild(svg);
      idx = 0;
      setEval(0.28);
      if (depthEl) depthEl.textContent = "18 ply";
      if (npsEl) npsEl.textContent = "2.6M";
      renderInfo();
    }

    function step() {
      if (idx >= MOVES.length) { reset(); return; }
      const m = MOVES[idx];
      Object.values(squares).forEach((s) => s.classList.remove("from", "to"));
      squares[m.from]?.classList.add("from");
      squares[m.to]?.classList.add("to");
      const p = pieces[m.from];
      if (p) {
        if (pieces[m.to]) { const c = pieces[m.to]; c.classList.add("gone"); setTimeout(() => c.remove(), 350); }
        place(p, m.to); delete pieces[m.from]; pieces[m.to] = p;
      }
      setEval(m.eval);
      idx++;
      if (depthEl) depthEl.textContent = `${18 + Math.floor(Math.random() * 5)} ply`;
      if (npsEl) npsEl.textContent = (2.3 + Math.random() * 0.7).toFixed(1) + "M";
      renderInfo();
    }

    function loop() {
      clearTimeout(timer);
      if (!playing || reduceMotion) return;
      timer = setTimeout(() => { step(); loop(); }, idx >= MOVES.length ? 2600 : 1950);
    }

    btnPlay?.addEventListener("click", () => {
      playing = !playing;
      btnPlay.innerHTML = playing
        ? `<svg class="ic" width="13" height="13"><use href="#i-pause"/></svg>`
        : `<svg class="ic" width="13" height="13"><use href="#i-play"/></svg>`;
      if (playing) loop(); else clearTimeout(timer);
    });
    btnStep?.addEventListener("click", () => { step(); if (playing) loop(); });
    btnReset?.addEventListener("click", () => { reset(); if (playing) loop(); });

    reset();
    if (!reduceMotion) loop();
  });
})();
