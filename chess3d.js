/* =========================================================
   SKT Launcher — 3D WebGL Floating Chess Scene (Three.js)
   Sculpted Staunton 3D pieces, glass/obsidian board,
   parabolic flying moves, orbiting zero-gravity pieces,
   cursor parallax & drag interaction.
   ========================================================= */

(function initChess3D() {
  const container = document.getElementById("chess3dWrap");
  if (!container || typeof THREE === "undefined") return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = window.innerWidth < 768;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "chess3d__canvas";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 6.9, 13.0);
  camera.lookAt(0, 0.05, 0);

  /* ---------- Studio Lighting ---------- */
  const hemi = new THREE.HemisphereLight(0xcdd6ff, 0x100e1f, 0.72);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(6, 12, 8);
  scene.add(keyLight);

  const limeRim = new THREE.PointLight(0xc6ff3d, 2.8, 22, 1.4);
  limeRim.position.set(-6.5, 4.2, 4.5);
  scene.add(limeRim);

  const violetRim = new THREE.PointLight(0x8b5cf6, 3.8, 24, 1.3);
  violetRim.position.set(6.5, 5.2, -4.0);
  scene.add(violetRim);

  const underGlow = new THREE.PointLight(0x6d28d9, 1.9, 14, 1.5);
  underGlow.position.set(0, -3.5, 1.5);
  scene.add(underGlow);

  /* ---------- Materials ---------- */
  const matLightPiece = new THREE.MeshPhysicalMaterial({
    color: 0xdce2f5,
    metalness: 0.24,
    roughness: 0.28,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
  });

  const matDarkPiece = new THREE.MeshPhysicalMaterial({
    color: 0x3b2d6b,
    emissive: 0x1d1140,
    emissiveIntensity: 0.42,
    metalness: 0.65,
    roughness: 0.24,
    clearcoat: 1.0,
    clearcoatRoughness: 0.14,
  });

  const matLimePiece = new THREE.MeshPhysicalMaterial({
    color: 0x9eff1a,
    emissive: 0x386600,
    emissiveIntensity: 0.32,
    metalness: 0.2,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const matBoardBase = new THREE.MeshPhysicalMaterial({
    color: 0x0b0c13,
    metalness: 0.55,
    roughness: 0.28,
    clearcoat: 0.7,
  });

  const matSqLight = new THREE.MeshStandardMaterial({
    color: 0x202336,
    metalness: 0.35,
    roughness: 0.34,
  });

  const matSqDark = new THREE.MeshStandardMaterial({
    color: 0x0e1019,
    metalness: 0.45,
    roughness: 0.28,
  });

  /* ---------- Lathe & Sculpted 3D Chess Piece Factories ---------- */
  const SEG = isSmall ? 20 : 28;

  function makeLathe(pts) {
    const vecs = pts.map(([r, y]) => new THREE.Vector2(r, y));
    const g = new THREE.LatheGeometry(vecs, SEG);
    g.computeVertexNormals();
    return g;
  }

  const GEOMS = {
    pawn: makeLathe([
      [0.0, 0.0], [0.34, 0.0], [0.35, 0.06], [0.31, 0.12],
      [0.25, 0.17], [0.17, 0.36], [0.13, 0.58], [0.20, 0.64],
      [0.14, 0.69], [0.22, 0.80], [0.21, 0.92], [0.13, 1.01], [0.0, 1.04],
    ]),
    rookBody: makeLathe([
      [0.0, 0.0], [0.38, 0.0], [0.39, 0.07], [0.34, 0.14],
      [0.27, 0.22], [0.21, 0.62], [0.20, 0.84], [0.29, 0.92],
      [0.29, 1.06], [0.21, 1.06], [0.21, 0.98], [0.0, 0.98],
    ]),
    bishop: makeLathe([
      [0.0, 0.0], [0.37, 0.0], [0.38, 0.07], [0.33, 0.14],
      [0.26, 0.22], [0.16, 0.62], [0.23, 0.72], [0.15, 0.78],
      [0.23, 0.96], [0.19, 1.12], [0.09, 1.24], [0.10, 1.31], [0.0, 1.35],
    ]),
    queenBody: makeLathe([
      [0.0, 0.0], [0.40, 0.0], [0.41, 0.08], [0.35, 0.16],
      [0.27, 0.25], [0.16, 0.76], [0.25, 0.88], [0.17, 0.95],
      [0.29, 1.20], [0.24, 1.26], [0.12, 1.32], [0.0, 1.38],
    ]),
    kingBody: makeLathe([
      [0.0, 0.0], [0.42, 0.0], [0.43, 0.08], [0.37, 0.17],
      [0.29, 0.26], [0.18, 0.82], [0.27, 0.94], [0.19, 1.02],
      [0.31, 1.28], [0.26, 1.36], [0.14, 1.42], [0.0, 1.44],
    ]),
    knightBase: makeLathe([
      [0.0, 0.0], [0.37, 0.0], [0.38, 0.07], [0.33, 0.14],
      [0.27, 0.22], [0.24, 0.34], [0.0, 0.34],
    ]),
  };

  // Sculpted 3D Knight Head (beveled extrude)
  const knightShape = new THREE.Shape();
  knightShape.moveTo(-0.22, 0.0);
  knightShape.bezierCurveTo(-0.26, 0.28, -0.24, 0.62, -0.08, 0.84);
  knightShape.lineTo(-0.02, 0.96); // ear tip
  knightShape.lineTo(0.06, 0.84);
  knightShape.bezierCurveTo(0.20, 0.80, 0.31, 0.66, 0.34, 0.50); // forehead -> nose
  knightShape.lineTo(0.24, 0.42); // muzzle
  knightShape.bezierCurveTo(0.14, 0.45, 0.08, 0.46, 0.06, 0.38); // jaw
  knightShape.bezierCurveTo(0.14, 0.24, 0.20, 0.12, 0.21, 0.0); // chest
  knightShape.closePath();

  const knightHeadGeom = new THREE.ExtrudeGeometry(knightShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.065,
    bevelSize: 0.055,
    bevelSegments: 4,
    curveSegments: 14,
  });
  knightHeadGeom.translate(0, 0.28, -0.09);
  knightHeadGeom.computeVertexNormals();

  const crossV = new THREE.BoxGeometry(0.08, 0.30, 0.08);
  const crossH = new THREE.BoxGeometry(0.22, 0.08, 0.08);
  const crownOrb = new THREE.SphereGeometry(0.055, 10, 10);
  const merlon = new THREE.BoxGeometry(0.12, 0.12, 0.09);

  function createPiece(type, mat, scale = 1) {
    const group = new THREE.Group();
    if (type === "p") {
      group.add(new THREE.Mesh(GEOMS.pawn, mat));
    } else if (type === "r") {
      group.add(new THREE.Mesh(GEOMS.rookBody, mat));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const m = new THREE.Mesh(merlon, mat);
        m.position.set(Math.cos(a) * 0.23, 1.11, Math.sin(a) * 0.23);
        m.rotation.y = -a + Math.PI / 2;
        group.add(m);
      }
    } else if (type === "b") {
      group.add(new THREE.Mesh(GEOMS.bishop, mat));
    } else if (type === "q") {
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
      const v = new THREE.Mesh(crossV, mat);
      v.position.y = 1.56;
      const h = new THREE.Mesh(crossH, mat);
      h.position.y = 1.60;
      group.add(v, h);
    } else if (type === "n") {
      group.add(new THREE.Mesh(GEOMS.knightBase, mat));
      const head = new THREE.Mesh(knightHeadGeom, mat);
      group.add(head);
    }
    group.scale.setScalar(scale);
    return group;
  }

  /* ---------- Root Group (Tilted Board + Pieces) ---------- */
  const world = new THREE.Group();
  world.rotation.set(0.24, -0.58, 0.05);
  world.position.set(0, -0.12, 0);
  scene.add(world);

  /* ---------- 3D Board ---------- */
  const SQ = 0.72;
  const BOARD_W = SQ * 8;
  const boardGroup = new THREE.Group();
  world.add(boardGroup);

  // Outer sleek obsidian plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(BOARD_W + 0.56, 0.32, BOARD_W + 0.56),
    matBoardBase
  );
  plinth.position.y = -0.2;
  boardGroup.add(plinth);

  // Subtle glowing lime/violet frame edge
  const edgeGeom = new THREE.EdgesGeometry(
    new THREE.BoxGeometry(BOARD_W + 0.57, 0.33, BOARD_W + 0.57)
  );
  const edgeLines = new THREE.LineSegments(
    edgeGeom,
    new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.45 })
  );
  edgeLines.position.y = -0.2;
  boardGroup.add(edgeLines);

  // 64 individual tiles
  const tileGeom = new THREE.BoxGeometry(SQ - 0.025, 0.06, SQ - 0.025);
  const tileMap = {};
  function sqToPos(sq) {
    const file = "abcdefgh".indexOf(sq[0]);
    const rank = parseInt(sq[1], 10) - 1; // 0..7
    const x = (file - 3.5) * SQ;
    const z = (3.5 - rank) * SQ;
    return new THREE.Vector3(x, 0, z);
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isDark = (r + c) % 2 === 1;
      const tile = new THREE.Mesh(tileGeom, isDark ? matSqDark : matSqLight);
      const name = "abcdefgh"[c] + (8 - r);
      const pos = sqToPos(name);
      tile.position.set(pos.x, -0.02, pos.z);
      boardGroup.add(tile);
      tileMap[name] = tile;
    }
  }

  // Highlight rings on board for flying moves
  const ringGeom = new THREE.RingGeometry(SQ * 0.28, SQ * 0.43, 32);
  const fromRing = new THREE.Mesh(
    ringGeom,
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
  );
  fromRing.rotation.x = -Math.PI / 2;
  fromRing.position.y = 0.025;
  boardGroup.add(fromRing);

  const toRing = new THREE.Mesh(
    ringGeom,
    new THREE.MeshBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
  );
  toRing.rotation.x = -Math.PI / 2;
  toRing.position.y = 0.025;
  boardGroup.add(toRing);

  // Expanding landing pulse ring
  const pulseRing = new THREE.Mesh(
    new THREE.RingGeometry(SQ * 0.36, SQ * 0.44, 32),
    new THREE.MeshBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  pulseRing.rotation.x = -Math.PI / 2;
  pulseRing.position.y = 0.03;
  boardGroup.add(pulseRing);

  // Glowing flight arc curve
  const arcMat = new THREE.LineBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0 });
  const arcLine = new THREE.Line(new THREE.BufferGeometry(), arcMat);
  boardGroup.add(arcLine);

  /* ---------- Board Pieces ---------- */
  const PIECE_SCALE = 0.72;
  const initialPieces = [
    { id: "wk", type: "k", side: "w", sq: "g1", hover: 0.04 },
    { id: "wq", type: "q", side: "w", sq: "d1", hover: 0.16 },
    { id: "wr", type: "r", side: "w", sq: "a1", hover: 0.03 },
    { id: "wb", type: "b", side: "w", sq: "c4", hover: 0.22 },
    { id: "wn", type: "n", side: "lime", sq: "f3", hover: 0.28 }, // featured flying hero knight!
    { id: "wp1", type: "p", side: "w", sq: "e4", hover: 0.08 },
    { id: "wp2", type: "p", side: "w", sq: "d4", hover: 0.05 },

    { id: "bk", type: "k", side: "b", sq: "e8", hover: 0.05 },
    { id: "bq", type: "q", side: "b", sq: "d8", hover: 0.18 },
    { id: "br", type: "r", side: "b", sq: "h8", hover: 0.06 },
    { id: "bb", type: "b", side: "b", sq: "c5", hover: 0.14 },
    { id: "bn", type: "n", side: "b", sq: "c6", hover: 0.24 },
    { id: "bp1", type: "p", side: "b", sq: "e5", hover: 0.07 },
  ];

  const boardPieces = {};
  initialPieces.forEach((def, idx) => {
    const mat =
      def.side === "lime" ? matLimePiece : def.side === "w" ? matLightPiece : matDarkPiece;
    const mesh = createPiece(def.type, mat, PIECE_SCALE);
    const p = sqToPos(def.sq);
    mesh.position.set(p.x, def.hover, p.z);
    if (def.type === "n") {
      mesh.rotation.y = def.side === "b" ? Math.PI * 0.5 : -Math.PI * 0.5;
    }
    boardGroup.add(mesh);
    boardPieces[def.id] = {
      mesh,
      sq: def.sq,
      baseX: p.x,
      baseZ: p.z,
      hover: def.hover,
      phase: idx * 0.85,
      baseRotY: mesh.rotation.y,
    };
  });

  /* ---------- Outer Orbiting 3D Floating Pieces (Zero-Gravity Depth!) ---------- */
  const floaters = [
    { type: "p", mat: matLimePiece, scale: 0.98, pos: [3.25, 1.35, 1.05], rot: [0.22, 0, -0.18], speed: 0.9, amp: 0.28, spin: 0.35 },
    { type: "n", mat: matLightPiece, scale: 0.8, pos: [-3.25, 1.65, -0.6], rot: [-0.15, 0.8, 0.2], speed: 0.72, amp: 0.32, spin: -0.28 },
    { type: "r", mat: matDarkPiece, scale: 0.76, pos: [1.85, 2.05, -2.55], rot: [0.28, 0.4, 0.14], speed: 0.65, amp: 0.24, spin: 0.22 },
  ].map((cfg, i) => {
    const mesh = createPiece(cfg.type, cfg.mat, cfg.scale);
    mesh.position.set(...cfg.pos);
    mesh.rotation.set(...cfg.rot);
    world.add(mesh);
    return { mesh, base: new THREE.Vector3(...cfg.pos), cfg, phase: i * 2.1 };
  });

  /* ---------- Subtle Floating Dust Motes in 3D Space ---------- */
  const moteCount = isSmall ? 32 : 64;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePos[i * 3] = (Math.random() - 0.5) * 11;
    motePos[i * 3 + 1] = Math.random() * 5.2 - 1.2;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * 11;
  }
  const moteGeom = new THREE.BufferGeometry();
  moteGeom.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(
    moteGeom,
    new THREE.PointsMaterial({ color: 0xc6ff3d, size: 0.065, transparent: true, opacity: 0.55 })
  );
  world.add(motes);

  /* ---------- Choreographed Flying Move Loop ---------- */
  const FLY_SCRIPT = [
    { id: "wn", to: "g5", label: "Ng5!", eval: "+1.48", depth: "20 ply", ms: "410 ms" },
    { id: "bn", to: "d4", label: "Nd4", eval: "+0.85", depth: "19 ply", ms: "480 ms" },
    { id: "wb", to: "f7", label: "Bxf7+", eval: "+2.64", depth: "22 ply", ms: "390 ms" },
    { id: "bq", to: "f6", label: "Qf6", eval: "+1.92", depth: "21 ply", ms: "510 ms" },
    { id: "wn", to: "f3", label: "Nf3", eval: "+1.24", depth: "18 ply", ms: "440 ms" },
    { id: "bn", to: "c6", label: "Nc6", eval: "+0.94", depth: "19 ply", ms: "470 ms" },
    { id: "wb", to: "c4", label: "Bc4", eval: "+1.18", depth: "20 ply", ms: "420 ms" },
    { id: "bq", to: "d8", label: "Qd8", eval: "+1.06", depth: "18 ply", ms: "460 ms" },
  ];

  let scriptIdx = 0;
  let activeMove = null;
  let nextMoveAt = 1.4;
  let pulseTime = -1;

  function startNextMove(nowSec) {
    const step = FLY_SCRIPT[scriptIdx];
    scriptIdx = (scriptIdx + 1) % FLY_SCRIPT.length;
    const item = boardPieces[step.id];
    const fromPos = new THREE.Vector3(item.baseX, item.hover, item.baseZ);
    const toPos = sqToPos(step.to);
    toPos.y = item.hover;

    fromRing.position.x = fromPos.x;
    fromRing.position.z = fromPos.z;
    toRing.position.x = toPos.x;
    toRing.position.z = toPos.z;

    // Build parabolic trajectory line
    const mid = fromPos.clone().lerp(toPos, 0.5);
    mid.y = 1.75;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(fromPos.x, 0.08, fromPos.z),
      mid,
      new THREE.Vector3(toPos.x, 0.08, toPos.z)
    );
    arcLine.geometry.dispose();
    arcLine.geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(28));

    activeMove = {
      item,
      step,
      from: fromPos,
      to: toPos,
      start: nowSec,
      dur: 1.35,
    };

    if (typeof window.onChess3DMove === "function") {
      window.onChess3DMove(step);
    }
  }

  /* ---------- Resize ---------- */
  function resize() {
    const w = Math.max(container.clientWidth, 260);
    const h = Math.max(container.clientHeight, 260);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 420 ? 39 : 34;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener("resize", resize);

  /* ---------- Interactive Mouse Parallax + Drag Orbit ---------- */
  let targetRotY = -0.58;
  let targetRotX = 0.24;
  let dragOffsetY = 0;
  let dragOffsetX = 0;
  let dragging = false;
  let prevX = 0;
  let prevY = 0;

  if (!matchMedia("(hover: none)").matches) {
    addEventListener("mousemove", (e) => {
      if (dragging) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetRotY = -0.58 + nx * 0.42;
      targetRotX = 0.24 + ny * 0.22;
    });
  }

  container.addEventListener("pointerdown", (e) => {
    dragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    container.style.cursor = "grabbing";
  });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dragOffsetY += (e.clientX - prevX) * 0.007;
    dragOffsetX = Math.max(-0.35, Math.min(0.4, dragOffsetX + (e.clientY - prevY) * 0.005));
    prevX = e.clientX;
    prevY = e.clientY;
  });
  addEventListener("pointerup", () => {
    dragging = false;
    container.style.cursor = "grab";
  });

  /* ---------- Pause When Offscreen ---------- */
  let inView = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
      },
      { threshold: 0.01 }
    ).observe(container);
  }

  /* ---------- Animation Loop ---------- */
  const clock = new THREE.Clock();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!inView) return;

    const t = clock.getElapsedTime();
    const scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2);

    // Gentle decay of drag offset back toward equilibrium
    if (!dragging) {
      dragOffsetY *= 0.985;
      dragOffsetX *= 0.985;
    }

    // Smooth spring rotation + scroll choreography
    const desiredY = targetRotY + dragOffsetY + Math.sin(t * 0.28) * 0.1 + scrollProgress * 0.35;
    const desiredX = targetRotX + dragOffsetX + Math.cos(t * 0.22) * 0.04 + scrollProgress * 0.12;
    world.rotation.y += (desiredY - world.rotation.y) * 0.06;
    world.rotation.x += (desiredX - world.rotation.x) * 0.06;
    world.position.y = -0.12 + Math.sin(t * 0.9) * 0.13;

    // Gentle hover on all board pieces
    Object.values(boardPieces).forEach((item) => {
      if (activeMove && activeMove.item === item) return;
      item.mesh.position.x = item.baseX;
      item.mesh.position.z = item.baseZ;
      item.mesh.position.y = item.hover + Math.sin(t * 1.6 + item.phase) * 0.065;
      item.mesh.rotation.x *= 0.9;
      item.mesh.rotation.z *= 0.9;
    });

    // Flying piece choreography
    if (!reduceMotion) {
      if (!activeMove && t >= nextMoveAt) {
        startNextMove(t);
      }
      if (activeMove) {
        const raw = (t - activeMove.start) / activeMove.dur;
        if (raw >= 1) {
          const { item, to } = activeMove;
          item.baseX = to.x;
          item.baseZ = to.z;
          item.sq = activeMove.step.to;
          item.mesh.position.set(to.x, item.hover, to.z);
          item.mesh.rotation.x = 0;
          item.mesh.rotation.z = 0;
          pulseRing.position.x = to.x;
          pulseRing.position.z = to.z;
          pulseTime = t;
          activeMove = null;
          nextMoveAt = t + 2.3;
          fromRing.material.opacity = 0;
          toRing.material.opacity = 0;
          arcMat.opacity = 0;
        } else {
          const p = easeInOutCubic(raw);
          const { item, from, to } = activeMove;
          const x = from.x + (to.x - from.x) * p;
          const z = from.z + (to.z - from.z) * p;
          const arcLift = Math.sin(p * Math.PI) * 1.55;
          item.mesh.position.set(x, item.hover + arcLift, z);
          // Dynamic tilt into flight direction
          const tilt = Math.sin(p * Math.PI) * 0.24;
          const dx = to.x - from.x;
          const dz = to.z - from.z;
          const len = Math.hypot(dx, dz) || 1;
          item.mesh.rotation.z = -(dx / len) * tilt;
          item.mesh.rotation.x = (dz / len) * tilt;
          // Rings & trajectory fade in and out
          const glowAlpha = Math.sin(p * Math.PI);
          fromRing.material.opacity = glowAlpha * 0.65;
          toRing.material.opacity = glowAlpha * 0.85;
          arcMat.opacity = glowAlpha * 0.72;
        }
      }

      // Landing ripple ring
      if (pulseTime >= 0) {
        const dt = t - pulseTime;
        if (dt < 0.85) {
          const s = 1 + dt * 1.9;
          pulseRing.scale.set(s, s, 1);
          pulseRing.material.opacity = (1 - dt / 0.85) * 0.75;
        } else {
          pulseRing.material.opacity = 0;
          pulseTime = -1;
        }
      }

      // Outer zero-gravity flying pieces
      floaters.forEach(({ mesh, base, cfg, phase }) => {
        mesh.position.y = base.y + Math.sin(t * cfg.speed + phase) * cfg.amp;
        mesh.position.x = base.x + Math.cos(t * cfg.speed * 0.6 + phase) * 0.14;
        mesh.rotation.y += 0.004 * cfg.spin;
      });

      // Gentle drift on dust motes
      motes.rotation.y = t * 0.04;
    }

    renderer.render(scene, camera);
  }

  // Render an immediate first frame before loop so screenshots & first paint look sharp
  renderer.render(scene, camera);
  animate();
})();
