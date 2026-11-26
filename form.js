// A trefoil tube built from cross-sections perpendicular to its centre line.
(() => {
  const canvas = document.querySelector("#form");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const full = Math.PI * 2;
  const rings = 286,
    sides = 54;
  const unit = (v) => {
    const length = Math.hypot(...v);
    return v.map((c) => c / length);
  };
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  function centre(t) {
    const r = 1.62 + 0.72 * Math.cos(3 * t);
    return [r * Math.cos(2 * t), r * Math.sin(2 * t), 0.94 * Math.sin(3 * t)];
  }
  const mesh = [];
  for (let i = 0; i < rings; i++) {
    const t = (full * i) / rings;
    const c = centre(t),
      next = centre(t + 0.001);
    const tangent = unit(next.map((v, j) => v - c[j]));
    const across = unit(cross(tangent, [0, 0, 1]));
    const up = cross(tangent, across);
    const thickness = 0.51;
    for (let j = 0; j < sides; j++) {
      const angle = (full * j) / sides;
      const normal = across.map(
        (v, k) => v * Math.cos(angle) + up[k] * Math.sin(angle),
      );
      mesh.push({ p: c.map((v, k) => v + thickness * normal[k]), n: normal });
    }
  }
  let yaw = -0.28,
    pitch = 0.63;
  function rotate(p) {
    const x = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw);
    const z = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
    const y = p[1] * Math.cos(pitch) - z * Math.sin(pitch);
    const tilt = 0.83;
    return [
      x * Math.cos(tilt) - y * Math.sin(tilt),
      x * Math.sin(tilt) + y * Math.cos(tilt),
      p[1] * Math.sin(pitch) + z * Math.cos(pitch),
    ];
  }
  let queued = false;
  function draw() {
    queued = false;
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vertices = mesh.map((v) => {
      const [x, y, z] = rotate(v.p),
        n = rotate(v.n);
      const distance = 10 / (10 - z);
      return { x: x * distance, y: -y * distance, z, n };
    });
    const xs = vertices.map((v) => v.x),
      ys = vertices.map((v) => v.y);
    const left = Math.min(...xs),
      right = Math.max(...xs),
      top = Math.min(...ys),
      bottom = Math.max(...ys);
    const scale = Math.min(
      (width * 0.91) / (right - left),
      (height * 0.95) / (bottom - top),
    );
    for (const v of vertices) {
      v.x = width / 2 + (v.x - (left + right) / 2) * scale;
      v.y = height / 2 + (v.y - (top + bottom) / 2) * scale;
    }
    const faces = [];
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < sides; j++) {
        const a = vertices[i * sides + j],
          b = vertices[((i + 1) % rings) * sides + j];
        const c = vertices[((i + 1) % rings) * sides + ((j + 1) % sides)],
          d = vertices[i * sides + ((j + 1) % sides)];
        if ((b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x) < 0) continue;
        const n = a.n;
        const diffuse = Math.max(0, -n[0] * 0.36 + n[1] * 0.65 + n[2] * 0.66);
        const sheen = Math.pow(
          Math.max(0, -n[0] * 0.2 + n[1] * 0.45 + n[2] * 0.87),
          9,
        );
        const rib = i % 2 ? 0.92 : 1;
        const shade = [
          43 + diffuse * 98 + sheen * 111,
          49 + diffuse * 106 + sheen * 96,
          45 + diffuse * 100 + sheen * 87,
        ];
        faces.push({
          a,
          b,
          c,
          d,
          z: (a.z + b.z + c.z + d.z) / 4,
          color: "rgb(" + shade.map((s) => Math.round(s * rib)).join(",") + ")",
        });
      }
    }
    faces.sort((a, b) => a.z - b.z);
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.65;
    for (const f of faces) {
      ctx.beginPath();
      ctx.moveTo(f.a.x, f.a.y);
      ctx.lineTo(f.b.x, f.b.y);
      ctx.lineTo(f.c.x, f.c.y);
      ctx.lineTo(f.d.x, f.d.y);
      ctx.closePath();
      ctx.fillStyle = ctx.strokeStyle = f.color;
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(f.a.x, f.a.y);
      ctx.lineTo(f.d.x, f.d.y);
      ctx.strokeStyle = "rgba(12,17,14,.42)";
      ctx.stroke();
    }
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(draw);
    }
  }
  let drag;
  canvas.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, y: e.clientY, yaw, pitch };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    yaw = drag.yaw + (e.clientX - drag.x) * 0.01;
    pitch = drag.pitch + (e.clientY - drag.y) * 0.01;
    schedule();
  });
  canvas.addEventListener("lostpointercapture", () => {
    drag = null;
  });
  document.querySelector("#rotate").addEventListener("click", () => {
    yaw += Math.PI / 5;
    schedule();
  });
  new ResizeObserver(schedule).observe(canvas);
})();
