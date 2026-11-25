/* =========================================================
   SKT Launcher — 3D WebGL Floating Chess Scene (qns.world ice-blue theme)
   Sculpted 3D Staunton chess pieces in obsidian & silver-ice blue
   ========================================================= */

(function initChess3D() {
  const container = document.getElementById("chess3dWrap");
  if (!container || typeof THREE === "undefined") return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = window.innerWidth < 768;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "chess3d__canvas";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 6.9, 13.0);
  camera.lookAt(0, 0.05, 0);

  /* ---------- Ice-Blue Studio Lighting (qns.world palette) ---------- */
  scene.add(new THREE.HemisphereLight(0xdbeeff, 0x0b101b, 0.72));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(6, 12, 8);
  scene.add(keyLight);

  const iceRim = new THREE.PointLight(0xa5c9db, 3.2, 24, 1.35);
  iceRim.position.set(-6.5, 4.4, 4.5);
  scene.add(iceRim);

  const deepRim = new THREE.PointLight(0x5f95b6, 3.8, 24, 1.3);
  deepRim.position.set(6.5, 5.2, -4.0);
  scene.add(deepRim);

  const underGlow = new THREE.PointLight(0x326891, 2.2, 16, 1.4);
  underGlow.position.set(0, -3.4, 1.5);
  scene.add(underGlow);

  /* ---------- Monochrome + Ice-Blue Materials ---------- */
  const matLightPiece = new THREE.MeshPhysicalMaterial({
    color: 0xe6eff7,
    metalness: 0.25,
    roughness: 0.26,
    clearcoat: 0.9,
    clearcoatRoughness: 0.14,
  });

  const matDarkPiece = new THREE.MeshPhysicalMaterial({
    color: 0x1d2b3d,
    emissive: 0x0f1f33,
    emissiveIntensity: 0.48,
    metalness: 0.72,
    roughness: 0.22,
    clearcoat: 1.0,
    clearcoatRoughness: 0.12,
  });

  const matHeroPiece = new THREE.MeshPhysicalMaterial({
    color: 0xa5c9db,
    emissive: 0x2c5c7a,
    emissiveIntensity: 0.45,
    metalness: 0.35,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const matBoardBase = new THREE.MeshPhysicalMaterial({
    color: 0x070a0f,
    metalness: 0.6,
    roughness: 0.28,
    clearcoat: 0.75,
  });

  const matSqLight = new THREE.MeshStandardMaterial({ color: 0x1e2736, metalness: 0.35, roughness: 0.34 });
  const matSqDark = new THREE.MeshStandardMaterial({ color: 0x0b0f17, metalness: 0.45, roughness: 0.28 });

  const SEG = isSmall ? 18 : 26;
  const makeLathe = (pts) => {
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), SEG);
    g.computeVertexNormals();
    return g;
  };

  const GEOMS = {
    pawn: makeLathe([[0,0],[0.34,0],[0.35,0.06],[0.31,0.12],[0.25,0.17],[0.17,0.36],[0.13,0.58],[0.20,0.64],[0.14,0.69],[0.22,0.80],[0.21,0.92],[0.13,1.01],[0,1.04]]),
    rookBody: makeLathe([[0,0],[0.38,0],[0.39,0.07],[0.34,0.14],[0.27,0.22],[0.21,0.62],[0.20,0.84],[0.29,0.92],[0.29,1.06],[0.21,1.06],[0.21,0.98],[0,0.98]]),
    bishop: makeLathe([[0,0],[0.37,0],[0.38,0.07],[0.33,0.14],[0.26,0.22],[0.16,0.62],[0.23,0.72],[0.15,0.78],[0.23,0.96],[0.19,1.12],[0.09,1.24],[0.10,1.31],[0,1.35]]),
    queenBody: makeLathe([[0,0],[0.40,0],[0.41,0.08],[0.35,0.16],[0.27,0.25],[0.16,0.76],[0.25,0.88],[0.17,0.95],[0.29,1.20],[0.24,1.26],[0.12,1.32],[0,1.38]]),
    kingBody: makeLathe([[0,0],[0.42,0],[0.43,0.08],[0.37,0.17],[0.29,0.26],[0.18,0.82],[0.27,0.94],[0.19,1.02],[0.31,1.28],[0.26,1.36],[0.14,1.42],[0,1.44]]),
    knightBase: makeLathe([[0,0],[0.37,0],[0.38,0.07],[0.33,0.14],[0.27,0.22],[0.24,0.34],[0,0.34]]),
  };

  const knightShape = new THREE.Shape();
  knightShape.moveTo(-0.22, 0);
  knightShape.bezierCurveTo(-0.26, 0.28, -0.24, 0.62, -0.08, 0.84);
  knightShape.lineTo(-0.02, 0.96);
  knightShape.lineTo(0.06, 0.84);
  knightShape.bezierCurveTo(0.20, 0.80, 0.31, 0.66, 0.34, 0.50);
  knightShape.lineTo(0.24, 0.42);
  knightShape.bezierCurveTo(0.14, 0.45, 0.08, 0.46, 0.06, 0.38);
  knightShape.bezierCurveTo(0.14, 0.24, 0.20, 0.12, 0.21, 0);
  knightShape.closePath();

  const knightHeadGeom = new THREE.ExtrudeGeometry(knightShape, {
    depth: 0.18, bevelEnabled: true, bevelThickness: 0.065, bevelSize: 0.055, bevelSegments: 4, curveSegments: 14,
  });
  knightHeadGeom.translate(0, 0.28, -0.09);
  knightHeadGeom.computeVertexNormals();

  const crossV = new THREE.BoxGeometry(0.08, 0.30, 0.08);
  const crossH = new THREE.BoxGeometry(0.22, 0.08, 0.08);
  const crownOrb = new THREE.SphereGeometry(0.055, 10, 10);
  const merlon = new THREE.BoxGeometry(0.12, 0.12, 0.09);

  function createPiece(type, mat, scale = 1) {
    const group = new THREE.Group();
    if (type === "p") group.add(new THREE.Mesh(GEOMS.pawn, mat));
    else if (type === "r") {
      group.add(new THREE.Mesh(GEOMS.rookBody, mat));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const m = new THREE.Mesh(merlon, mat);
        m.position.set(Math.cos(a) * 0.23, 1.11, Math.sin(a) * 0.23);
        m.rotation.y = -a + Math.PI / 2;
        group.add(m);
      }
    } else if (type === "b") group.add(new THREE.Mesh(GEOMS.bishop, mat));
    else if (type === "q") {
      group.add(new THREE.Mesh(GEOMS.queenBody, mat));
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const o = new THREE.Mesh(crownOrb, mat);
        o.position.set(Math.cos(a) * 0.26, 1.27, Math.sin(a) * 0.26);
        group.add(o);
      }
      const topOrb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), mat);
      topOrb.position.y = 1.44;
      group.add(topOrb);
    } else if (type === "k") {
      group.add(new THREE.Mesh(GEOMS.kingBody, mat));
      const v = new THREE.Mesh(crossV, mat); v.position.y = 1.56;
      const h = new THREE.Mesh(crossH, mat); h.position.y = 1.60;
      group.add(v, h);
    } else if (type === "n") {
      group.add(new THREE.Mesh(GEOMS.knightBase, mat));
      group.add(new THREE.Mesh(knightHeadGeom, mat));
    }
    group.scale.setScalar(scale);
    return group;
  }

  const world = new THREE.Group();
  world.rotation.set(0.24, -0.58, 0.04);
  world.position.set(0, -0.1, 0);
  scene.add(world);

  const SQ = 0.72;
  const BOARD_W = SQ * 8;
  const boardGroup = new THREE.Group();
  world.add(boardGroup);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(BOARD_W + 0.54, 0.3, BOARD_W + 0.54), matBoardBase);
  plinth.position.y = -0.19;
  boardGroup.add(plinth);

  const edgeLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(BOARD_W + 0.55, 0.31, BOARD_W + 0.55)),
    new THREE.LineBasicMaterial({ color: 0x5f95b6, transparent: true, opacity: 0.45 })
  );
  edgeLines.position.y = -0.19;
  boardGroup.add(edgeLines);

  const tileGeom = new THREE.BoxGeometry(SQ - 0.025, 0.055, SQ - 0.025);
  const sqToPos = (sq) => {
    const file = "abcdefgh".indexOf(sq[0]);
    const rank = parseInt(sq[1], 10) - 1;
    return new THREE.Vector3((file - 3.5) * SQ, 0, (3.5 - rank) * SQ);
  };

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const tile = new THREE.Mesh(tileGeom, (r + c) % 2 ? matSqDark : matSqLight);
      const pos = sqToPos("abcdefgh"[c] + (8 - r));
      tile.position.set(pos.x, -0.02, pos.z);
      boardGroup.add(tile);
    }
  }

  const ringGeom = new THREE.RingGeometry(SQ * 0.28, SQ * 0.43, 32);
  const fromRing = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0x5f95b6, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  fromRing.rotation.x = -Math.PI / 2; fromRing.position.y = 0.025;
  const toRing = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0xa5c9db, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  toRing.rotation.x = -Math.PI / 2; toRing.position.y = 0.025;
  const pulseRing = new THREE.Mesh(new THREE.RingGeometry(SQ * 0.36, SQ * 0.44, 32), new THREE.MeshBasicMaterial({ color: 0xa5c9db, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  pulseRing.rotation.x = -Math.PI / 2; pulseRing.position.y = 0.03;
  const arcMat = new THREE.LineBasicMaterial({ color: 0xa5c9db, transparent: true, opacity: 0 });
  const arcLine = new THREE.Line(new THREE.BufferGeometry(), arcMat);
  boardGroup.add(fromRing, toRing, pulseRing, arcLine);

  const initialPieces = [
    { id: "wk", type: "k", side: "w", sq: "g1", hover: 0.04 },
    { id: "wq", type: "q", side: "w", sq: "d1", hover: 0.16 },
    { id: "wr", type: "r", side: "w", sq: "a1", hover: 0.03 },
    { id: "wb", type: "b", side: "w", sq: "c4", hover: 0.22 },
    { id: "wn", type: "n", side: "ice", sq: "f3", hover: 0.28 },
    { id: "wp1", type: "p", side: "w", sq: "e4", hover: 0.08 },
    { id: "bk", type: "k", side: "b", sq: "e8", hover: 0.05 },
    { id: "bq", type: "q", side: "b", sq: "d8", hover: 0.18 },
    { id: "br", type: "r", side: "b", sq: "h8", hover: 0.06 },
    { id: "bb", type: "b", side: "b", sq: "c5", hover: 0.14 },
    { id: "bn", type: "n", side: "b", sq: "c6", hover: 0.24 },
    { id: "bp1", type: "p", side: "b", sq: "e5", hover: 0.07 },
  ];

  const boardPieces = {};
  initialPieces.forEach((def, idx) => {
    const mat = def.side === "ice" ? matHeroPiece : def.side === "w" ? matLightPiece : matDarkPiece;
    const mesh = createPiece(def.type, mat, 0.72);
    const p = sqToPos(def.sq);
    mesh.position.set(p.x, def.hover, p.z);
    if (def.type === "n") mesh.rotation.y = def.side === "b" ? Math.PI * 0.5 : -Math.PI * 0.5;
    boardGroup.add(mesh);
    boardPieces[def.id] = { mesh, baseX: p.x, baseZ: p.z, hover: def.hover, phase: idx * 0.85 };
  });

  const floaters = [
    { type: "p", mat: matHeroPiece, scale: 0.96, pos: [3.25, 1.35, 1.05], rot: [0.22, 0, -0.18], speed: 0.85, amp: 0.28, spin: 0.35 },
    { type: "n", mat: matLightPiece, scale: 0.8, pos: [-3.25, 1.65, -0.6], rot: [-0.15, 0.8, 0.2], speed: 0.7, amp: 0.32, spin: -0.28 },
    { type: "r", mat: matDarkPiece, scale: 0.76, pos: [1.85, 2.05, -2.55], rot: [0.28, 0.4, 0.14], speed: 0.65, amp: 0.24, spin: 0.22 },
  ].map((cfg, i) => {
    const mesh = createPiece(cfg.type, cfg.mat, cfg.scale);
    mesh.position.set(...cfg.pos);
    mesh.rotation.set(...cfg.rot);
    world.add(mesh);
    return { mesh, base: new THREE.Vector3(...cfg.pos), cfg, phase: i * 2.1 };
  });

  const FLY_SCRIPT = [
    { id: "wn", to: "g5" }, { id: "bn", to: "d4" }, { id: "wb", to: "f7" }, { id: "bq", to: "f6" },
    { id: "wn", to: "f3" }, { id: "bn", to: "c6" }, { id: "wb", to: "c4" }, { id: "bq", to: "d8" },
  ];
  let scriptIdx = 0, activeMove = null, nextMoveAt = 1.2, pulseTime = -1;

  function startNextMove(nowSec) {
    const step = FLY_SCRIPT[scriptIdx];
    scriptIdx = (scriptIdx + 1) % FLY_SCRIPT.length;
    const item = boardPieces[step.id];
    const fromPos = new THREE.Vector3(item.baseX, item.hover, item.baseZ);
    const toPos = sqToPos(step.to); toPos.y = item.hover;
    fromRing.position.set(fromPos.x, 0.025, fromPos.z);
    toRing.position.set(toPos.x, 0.025, toPos.z);
    const mid = fromPos.clone().lerp(toPos, 0.5); mid.y = 1.7;
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(fromPos.x, 0.08, fromPos.z), mid, new THREE.Vector3(toPos.x, 0.08, toPos.z));
    arcLine.geometry.dispose();
    arcLine.geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(28));
    activeMove = { item, from: fromPos, to: toPos, start: nowSec, dur: 1.35 };
  }

  function resize() {
    const w = Math.max(container.clientWidth, 240);
    const h = Math.max(container.clientHeight, 240);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 440 ? 39 : 34;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener("resize", resize);

  let targetRotY = -0.58, targetRotX = 0.24, dragY = 0, dragX = 0, dragging = false, px = 0, py = 0;
  if (!matchMedia("(hover: none)").matches) {
    addEventListener("mousemove", (e) => {
      if (dragging) return;
      targetRotY = -0.58 + (e.clientX / innerWidth - 0.5) * 0.4;
      targetRotX = 0.24 + (e.clientY / innerHeight - 0.5) * 0.2;
    });
  }
  container.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; container.style.cursor = "grabbing"; });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dragY += (e.clientX - px) * 0.007;
    dragX = Math.max(-0.35, Math.min(0.4, dragX + (e.clientY - py) * 0.005));
    px = e.clientX; py = e.clientY;
  });
  addEventListener("pointerup", () => { dragging = false; container.style.cursor = "grab"; });

  let inView = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => { inView = es[0].isIntersecting; }, { threshold: 0.01 }).observe(container);
  }

  const clock = new THREE.Clock();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function animate() {
    requestAnimationFrame(animate);
    if (!inView) return;
    const t = clock.getElapsedTime();
    if (!dragging) { dragY *= 0.985; dragX *= 0.985; }
    world.rotation.y += (targetRotY + dragY + Math.sin(t * 0.28) * 0.1 - world.rotation.y) * 0.06;
    world.rotation.x += (targetRotX + dragX + Math.cos(t * 0.22) * 0.04 - world.rotation.x) * 0.06;
    world.position.y = -0.1 + Math.sin(t * 0.9) * 0.12;

    Object.values(boardPieces).forEach((item) => {
      if (activeMove && activeMove.item === item) return;
      item.mesh.position.set(item.baseX, item.hover + Math.sin(t * 1.6 + item.phase) * 0.06, item.baseZ);
      item.mesh.rotation.x *= 0.9; item.mesh.rotation.z *= 0.9;
    });

    if (!reduceMotion) {
      if (!activeMove && t >= nextMoveAt) startNextMove(t);
      if (activeMove) {
        const raw = (t - activeMove.start) / activeMove.dur;
        if (raw >= 1) {
          const { item, to } = activeMove;
          item.baseX = to.x; item.baseZ = to.z;
          item.mesh.position.set(to.x, item.hover, to.z);
          item.mesh.rotation.x = 0; item.mesh.rotation.z = 0;
          pulseRing.position.set(to.x, 0.03, to.z);
          pulseTime = t; activeMove = null; nextMoveAt = t + 2.2;
          fromRing.material.opacity = 0; toRing.material.opacity = 0; arcMat.opacity = 0;
        } else {
          const p = ease(raw);
          const { item, from, to } = activeMove;
          const x = from.x + (to.x - from.x) * p;
          const z = from.z + (to.z - from.z) * p;
          item.mesh.position.set(x, item.hover + Math.sin(p * Math.PI) * 1.5, z);
          const a = Math.sin(p * Math.PI);
          fromRing.material.opacity = a * 0.65;
          toRing.material.opacity = a * 0.88;
          arcMat.opacity = a * 0.72;
        }
      }
      if (pulseTime >= 0) {
        const dt = t - pulseTime;
        if (dt < 0.85) { const s = 1 + dt * 1.8; pulseRing.scale.set(s, s, 1); pulseRing.material.opacity = (1 - dt / 0.85) * 0.7; }
        else { pulseRing.material.opacity = 0; pulseTime = -1; }
      }
      floaters.forEach(({ mesh, base, cfg, phase }) => {
        mesh.position.y = base.y + Math.sin(t * cfg.speed + phase) * cfg.amp;
        mesh.position.x = base.x + Math.cos(t * cfg.speed * 0.6 + phase) * 0.14;
        mesh.rotation.y += 0.004 * cfg.spin;
      });
    }
    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  animate();
})();
