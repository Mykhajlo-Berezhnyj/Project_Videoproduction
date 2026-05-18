const EFFECT_COLOR = { r: 230, g: 193, b: 70 };

const COLOR_CACHE = new Map();
function getColor(alpha) {
  const key = alpha.toFixed(2);
  if (!COLOR_CACHE.has(key)) {
    COLOR_CACHE.set(
      key,
      `rgba(${EFFECT_COLOR.r},${EFFECT_COLOR.g},${EFFECT_COLOR.b},${alpha})`,
    );
  }
  return COLOR_CACHE.get(key);
}

const isMobileDevice =
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  window.innerWidth < 768;

const PERF = {
  shadowBlur: isMobileDevice ? 0 : 14,
  sparkCount: isMobileDevice ? 80 : 180,
  starCount: isMobileDevice ? 0 : 8,
  glowCount: isMobileDevice ? 8 : 14,
  beamLineWidth: isMobileDevice ? 2 : 3,
};

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function getDomRefs() {
  return {
    canvas: document.getElementById("beamsCanvas"),
    section: document.querySelector(".xora-prezentationps"),
    socialContainer: document.getElementById("socialContainer"),
    container: document.querySelector(".xmpr-container"),
    videoContainers: ["videoLeft", "videoCenter", "videoRight"],
    icons: ["iconTop", "iconLeft", "iconRight"],
  };
}

export function loadSvgSafely() {
  const { socialContainer } = getDomRefs();
  if (socialContainer) {
    socialContainer.innerHTML = `
    <li class="social-icon" id="iconTop">
      <a href="https://www.youtube.com/@Xoramedia" class="icon-link" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ytGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#FF3D00"/><stop offset="100%" stop-color="#C60000"/>
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19" fill="url(#ytGradient)"/>
          <path d="M16 13l11 7-11 7V13z" fill="#FFFFFF"/>
        </svg>
      </a>
    </li>
    <li class="social-icon" id="iconLeft">
      <a class="icon-link" href="https://www.instagram.com/xora_media/" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <radialGradient id="igA" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fd5"/><stop offset=".328" stop-color="#ff543f"/>
            <stop offset=".348" stop-color="#fc5245"/><stop offset=".504" stop-color="#e64771"/>
            <stop offset=".643" stop-color="#d53e91"/><stop offset=".761" stop-color="#cc39a4"/>
            <stop offset=".841" stop-color="#c837ab"/>
          </radialGradient>
          <path fill="url(#igA)" d="M34.02 4H13.98A9.97 9.97 0 0 0 4 13.98v20.04A9.97 9.97 0 0 0 13.98 44h20.04A9.97 9.97 0 0 0 44 34.02V13.98A9.97 9.97 0 0 0 34.02 4z"/>
          <radialGradient id="igB" cx="11.786" cy="5.54" r="29.813" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#4168c9"/><stop offset=".999" stop-color="#4168c9" stop-opacity="0"/>
          </radialGradient>
          <path fill="url(#igB)" d="M34.02 4H13.98A9.97 9.97 0 0 0 4 13.98v20.04A9.97 9.97 0 0 0 13.98 44h20.04A9.97 9.97 0 0 0 44 34.02V13.98A9.97 9.97 0 0 0 34.02 4z"/>
          <path fill="#fff" d="M24 15.5A8.5 8.5 0 1 0 32.5 24 8.51 8.51 0 0 0 24 15.5zm0 14A5.5 5.5 0 1 1 29.5 24 5.51 5.51 0 0 1 24 29.5zM33.5 14.5A2.5 2.5 0 1 0 36 17a2.5 2.5 0 0 0-2.5-2.5zM31 9H17a8 8 0 0 0-8 8v14a8 8 0 0 0 8 8h14a8 8 0 0 0 8-8V17a8 8 0 0 0-8-8zM37 31a6 6 0 0 1-6 6H17a6 6 0 0 1-6-6V17a6 6 0 0 1 6-6h14a6 6 0 0 1 6 6z"/>
        </svg>
      </a>
    </li>
    <li class="social-icon" id="iconRight">
      <a class="icon-link" href="https://www.linkedin.com/in/dmytro-zhulyk-716545365" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="LinkedIn">
          <title>LinkedIn</title>
          <circle cx="12" cy="12" r="12" fill="#0A66C2"/>
          <path fill="#ffffff" d="M7.051 17.999H4.5V9h2.551v8.999zM5.776 7.5a1.276 1.276 0 1 1 0-2.552 1.276 1.276 0 0 1 0 2.552zM19.5 18h-2.55v-4.357c0-1.04-.02-2.377-1.448-2.377-1.45 0-1.672 1.132-1.672 2.3V18h-2.55V9h2.448v1.229h.035c.341-.646 1.174-1.326 2.417-1.326 2.583 0 3.05 1.7 3.05 3.91V18z"/>
        </svg>
      </a>
    </li>
  `;
  }

  initAnimation();
}

let animationId = null;
let isAnimationInitialized = false;
let intersectionObs = null;

export function initAnimation() {
  if (isAnimationInitialized) cleanup();
  isAnimationInitialized = true;

  const {
    canvas,
    section,
    socialContainer,
    container,
    videoContainers,
    icons,
  } = getDomRefs();

  const ctx = canvas.getContext("2d", { alpha: true });

  // canvas.style.willChange    = "transform";
  canvas.style.pointerEvents = "none";

  const iconHalfSize = 40;
  let iconAngles = [270, 150, 30];
  const radiusOuter = 110;
  let beams = [];
  let wave = null;
  let waveRadius = radiusOuter;
  let animationPhase = "idle";
  let phaseStartTime = 0;
  let isPaused = false;
  let isVisible = false;
  let lastTimestamp = 0;
  let sparkParticles = [];

  const iconEls = icons.map((id) => document.getElementById(id));

  let iconCosCache = iconAngles.map((a) => Math.cos((a * Math.PI) / 180));
  let iconSinCache = iconAngles.map((a) => Math.sin((a * Math.PI) / 180));

  function rebuildIconCache() {
    iconCosCache = iconAngles.map((a) => Math.cos((a * Math.PI) / 180));
    iconSinCache = iconAngles.map((a) => Math.sin((a * Math.PI) / 180));
  }

  intersectionObs = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        isVisible = true;
        if (!animationId) {
          lastTimestamp = 0;
          animationId = requestAnimationFrame(animate);
        }
      } else {
        isVisible = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    },
    { threshold: 0.2 },
  );
  intersectionObs.observe(section);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();

  function getOffsetLeft(el, ancestor) {
    let x = 0;
    while (el && el !== ancestor) {
      x += el.offsetLeft;
      el = el.offsetParent;
    }
    return x;
  }
  function getOffsetTop(el, ancestor) {
    let y = 0;
    while (el && el !== ancestor) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  }

  let socialCenterX = 0;
  let socialCenterY = 0;
  let beamStartCache = {};

  function updateSocialCenter() {
    socialCenterX =
      getOffsetLeft(socialContainer, container) +
      socialContainer.offsetWidth / 2;
    socialCenterY =
      getOffsetTop(socialContainer, container) +
      socialContainer.offsetHeight / 2;
  }
  updateSocialCenter();

  function buildBeamStartCache() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
    const videoIds = ["videoLeft", "videoCenter", "videoRight"];

    if (isMobile) {
      const listEl = document.querySelector(".xmpr-list");
      const partWidth = listEl.offsetWidth / 3;
      const baseY = getOffsetTop(listEl, container) + listEl.offsetHeight + 60;
      const baseX = getOffsetLeft(listEl, container);
      videoIds.forEach((id, idx) => {
        beamStartCache[id] = {
          x: baseX + idx * partWidth + partWidth / 2,
          y: baseY,
        };
      });
    } else {
      videoIds.forEach((id) => {
        const el = document.getElementById(id);
        const h4 = el.querySelector(".xmpr-titl-h4");
        beamStartCache[id] = {
          x: getOffsetLeft(el, container) + el.offsetWidth / 2,
          y: h4
            ? getOffsetTop(h4, container) + h4.offsetHeight + 20
            : getOffsetTop(el, container) +
              el.offsetHeight +
              (isTablet ? 65 : 50),
        };
      });
    }
  }
  buildBeamStartCache();

  const handleResize = debounce(() => {
    resizeCanvas();
    updateSocialCenter();
    buildBeamStartCache();
    positionIcons();
    syncWaveEl();
  }, 150);
  window.addEventListener("resize", handleResize);

  socialContainer.addEventListener("mouseenter", () => {
    isPaused = true;
  });
  socialContainer.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  function setIconPos(el, x, y) {
    el.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
  }

  function positionIcons() {
    const cx = socialContainer.offsetWidth / 2;
    const cy = socialContainer.offsetHeight / 2;
    for (let i = 0; i < iconEls.length; i++) {
      if (!iconEls[i]) continue;
      iconEls[i].style.left = "0";
      iconEls[i].style.top = "0";
      setIconPos(
        iconEls[i],
        cx + radiusOuter * iconCosCache[i],
        cy + radiusOuter * iconSinCache[i],
      );
    }
  }

  function moveIconsWithCircle(r) {
    const cx = socialContainer.offsetWidth / 2;
    const cy = socialContainer.offsetHeight / 2;
    for (let i = 0; i < iconEls.length; i++) {
      if (!iconEls[i]) continue;
      setIconPos(
        iconEls[i],
        cx + r * iconCosCache[i],
        cy + r * iconSinCache[i],
      );
    }
  }

  function syncWaveEl() {
    if (!wave) return;
    const size = (waveRadius + iconHalfSize) * 2;
    wave.style.left = `${socialCenterX}px`;
    wave.style.top = `${socialCenterY}px`;
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
  }

  function createBeam(fromVideo, targetAngleDeg) {
    const cached = beamStartCache[fromVideo] || { x: 0, y: 0 };
    return { startPos: { ...cached }, targetAngleDeg, progress: 1 };
  }

  function drawBeamToCircle(beam, r, alpha) {
    const rad = (beam.targetAngleDeg * Math.PI) / 180;
    const endX = socialCenterX + r * Math.cos(rad);
    const endY = socialCenterY + r * Math.sin(rad);
    const curX = beam.startPos.x + (endX - beam.startPos.x) * beam.progress;
    const curY = beam.startPos.y + (endY - beam.startPos.y) * beam.progress;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(
      socialCenterX,
      socialCenterY,
      Math.max(r - 1, 0),
      0,
      Math.PI * 2,
      true,
    );
    ctx.clip("evenodd");

    ctx.lineWidth = PERF.beamLineWidth;
    ctx.lineCap = "round";
    if (PERF.shadowBlur > 0) {
      ctx.shadowBlur = PERF.shadowBlur;
      ctx.shadowColor = getColor(alpha);
    }
    ctx.strokeStyle = getColor(alpha);
    ctx.beginPath();
    ctx.moveTo(beam.startPos.x, beam.startPos.y);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    if (PERF.shadowBlur > 0) ctx.shadowBlur = 0;

    ctx.lineWidth = PERF.beamLineWidth * 0.5;
    ctx.strokeStyle = getColor(alpha * 0.5);
    ctx.beginPath();
    ctx.moveTo(beam.startPos.x, beam.startPos.y);
    ctx.lineTo(curX, curY);
    ctx.stroke();

    ctx.restore();
  }

  const sparkPool = [];

  function spawnCanvasExplosion(cx, cy, radius) {
    const r = Math.max(radius, 5);
    const { sparkCount, starCount, glowCount } = PERF;

    for (let i = 0; i < sparkCount; i++) {
      const angle =
        (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.15;
      const speed = 300 + Math.random() * 700;
      const isTail = Math.random() > 0.4;
      const s = sparkPool.pop() || {};
      s.type = isTail ? "tail" : "dot";
      s.x = cx + Math.cos(angle) * r;
      s.y = cy + Math.sin(angle) * r;
      s.vx = Math.cos(angle) * speed;
      s.vy = Math.sin(angle) * speed;
      s.life = 1;
      s.decay = 0.008 + Math.random() * 0.018;
      s.size = isTail ? 1.5 + Math.random() * 2 : 2 + Math.random() * 2.5;
      s.len = 10 + Math.random() * 20;
      sparkParticles.push(s);
    }

    for (let i = 0; i < starCount; i++) {
      const angle = (Math.PI * 2 * i) / starCount;
      const s = sparkPool.pop() || {};
      s.type = "star";
      s.x = cx + Math.cos(angle) * r * 1.2;
      s.y = cy + Math.sin(angle) * r * 1.2;
      s.vx = Math.cos(angle) * 180;
      s.vy = Math.sin(angle) * 180;
      s.life = 1;
      s.decay = 0.02;
      s.size = 3 + Math.random() * 3;
      sparkParticles.push(s);
    }

    for (let i = 0; i < glowCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 150;
      const s = sparkPool.pop() || {};
      s.type = "glow";
      s.x = cx + Math.cos(angle) * r * 0.5;
      s.y = cy + Math.sin(angle) * r * 0.5;
      s.vx = Math.cos(angle) * speed;
      s.vy = Math.sin(angle) * speed;
      s.life = 1;
      s.decay = 0.005 + Math.random() * 0.01;
      s.size = 2 + Math.random() * 2;
      sparkParticles.push(s);
    }
  }

  function updateAndDrawSparks(dt) {
    let writeIdx = 0;
    for (let i = 0; i < sparkParticles.length; i++) {
      const s = sparkParticles[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 120 * dt;
      s.vx *= 0.995;
      s.life -= s.decay;

      if (s.life <= 0) {
        if (sparkPool.length < 300) sparkPool.push(s);
        continue;
      }

      sparkParticles[writeIdx++] = s;
      const alpha = Math.pow(s.life, 0.7);

      if (s.type === "tail") {
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (speed < 0.01) continue;
        const nx = s.vx / speed;
        const ny = s.vy / speed;
        const tLen = Math.min(s.len * s.life, speed * dt * 8);
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - nx * tLen,
          s.y - ny * tLen,
        );
        grad.addColorStop(0, getColor(alpha));
        grad.addColorStop(1, getColor(0));
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.size * s.life;
        ctx.lineCap = "round";
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - nx * tLen, s.y - ny * tLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,120,${alpha})`;
        ctx.fill();
      } else if (s.type === "dot") {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = getColor(alpha);
        ctx.fill();
      } else if (s.type === "star") {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.life * Math.PI);
        const r1 = s.size * s.life;
        const r2 = r1 * 0.35;
        ctx.beginPath();
        for (let p = 0; p < 8; p++) {
          const a = (p * Math.PI) / 4;
          const rv = p % 2 === 0 ? r1 : r2;
          p === 0
            ? ctx.moveTo(Math.cos(a) * rv, Math.sin(a) * rv)
            : ctx.lineTo(Math.cos(a) * rv, Math.sin(a) * rv);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(255,240,160,${alpha})`;
        if (PERF.shadowBlur > 0) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = getColor(alpha);
        }
        ctx.fill();
        if (PERF.shadowBlur > 0) ctx.shadowBlur = 0;
        ctx.restore();
      } else if (s.type === "glow") {
        const grad = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.size * s.life,
        );
        grad.addColorStop(0, `rgba(255,220,80,${alpha * 0.9})`);
        grad.addColorStop(0.4, getColor(alpha * 0.5));
        grad.addColorStop(1, getColor(0));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }
    sparkParticles.length = writeIdx;
  }

  function makeAbsoluteEl(cx, cy, size, className) {
    const el = document.createElement("div");
    el.className = className;
    Object.assign(el.style, {
      position: "absolute",
      left: `${cx}px`,
      top: `${cy}px`,
      width: `${size}px`,
      height: `${size}px`,
      transform: "translate(-50%, -50%)",
      transition: "none",
      zIndex: "100",
      opacity: "1",
      pointerEvents: "none",
    });
    container.appendChild(el);
    return el;
  }

  function createReverseWave(cx, cy, callback) {
    const videosRow = document.getElementById("videosRow");
    const rowBottom =
      getOffsetTop(videosRow, container) + videosRow.offsetHeight;
    const targetSize = Math.abs(cy - rowBottom) * 2 + 300;
    const waveEl = makeAbsoluteEl(cx, cy, 130, "reverse-wave");
    requestAnimationFrame(() => {
      waveEl.style.transition = "width 1.2s ease-out, height 1.2s ease-out";
      waveEl.style.opacity = "1";
      waveEl.style.width = `${targetSize}px`;
      waveEl.style.height = `${targetSize}px`;
    });
    setTimeout(() => {
      videoContainers.forEach((id) =>
        document.getElementById(id)?.classList.add("energized"),
      );
    }, 800);
    setTimeout(() => {
      waveEl.style.transition = "opacity 0.4s";
      waveEl.style.opacity = "0";
      setTimeout(() => {
        videoContainers.forEach((id) =>
          document.getElementById(id)?.classList.remove("energized"),
        );
        waveEl.remove();
        if (callback) callback();
      }, 400);
    }, 800);
  }

  function animate(timestamp) {
    if (!isVisible) {
      animationId = null;
      return;
    }

    const dt = Math.min(
      (timestamp - (lastTimestamp || timestamp)) / 1000,
      0.05,
    );
    lastTimestamp = timestamp;

    if (isPaused) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (sparkParticles.length > 0) updateAndDrawSparks(dt);

    if (animationPhase === "idle") {
      phaseStartTime = timestamp;
      animationPhase = "growing";
      updateSocialCenter();
      buildBeamStartCache();
      waveRadius = radiusOuter;
      beams = [
        createBeam("videoLeft", 160),
        createBeam("videoCenter", 270),
        createBeam("videoRight", 30),
      ];
      if (wave) {
        wave.remove();
        wave = null;
      }
    } else if (animationPhase === "growing") {
      const progress = Math.min((timestamp - phaseStartTime) / 1000, 1);
      waveRadius = radiusOuter;
      for (const b of beams) {
        b.progress = progress;
        drawBeamToCircle(b, waveRadius, 1);
      }
      if (progress >= 1) {
        animationPhase = "compressing";
        phaseStartTime = timestamp;
        wave = makeAbsoluteEl(
          socialCenterX,
          socialCenterY,
          (waveRadius + iconHalfSize) * 2,
          "energy-wave",
        );
      }
    } else if (animationPhase === "compressing") {
      const progress = Math.min((timestamp - phaseStartTime) / 1200, 1);
      waveRadius = radiusOuter - (radiusOuter - 1) * progress;

      if (wave) {
        const size = (waveRadius + iconHalfSize) * 2;
        wave.style.width = `${size}px`;
        wave.style.height = `${size}px`;
      }

      moveIconsWithCircle(waveRadius);

      for (const b of beams) {
        b.progress = 1;
        drawBeamToCircle(b, waveRadius, 1);
      }

      if (progress >= 1) {
        if (wave) {
          wave.remove();
          wave = null;
        }
        beams = [];
        spawnCanvasExplosion(socialCenterX, socialCenterY, 1);
        iconAngles = iconAngles.map((a) => (a + 120) % 360);
        rebuildIconCache();
        createReverseWave(socialCenterX, socialCenterY, () => {});
        animationPhase = "exploding";
        phaseStartTime = timestamp + 500;
      }
    } else if (animationPhase === "exploding") {
      const elapsed = timestamp - phaseStartTime;
      if (elapsed < 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min(elapsed / 850, 1);
      moveIconsWithCircle(radiusOuter * progress);
      if (progress >= 1) {
        animationPhase = "waiting";
        phaseStartTime = timestamp;
      }
    } else if (animationPhase === "waiting") {
      if (timestamp - phaseStartTime > 500) animationPhase = "idle";
    }

    animationId = requestAnimationFrame(animate);
  }

  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (intersectionObs) {
      intersectionObs.disconnect();
      intersectionObs = null;
    }
    isAnimationInitialized = false;
    window.removeEventListener("resize", handleResize);
    if (wave) {
      wave.remove();
      wave = null;
    }
    beams.length = 0;
    sparkParticles.length = 0;
    sparkPool.length = 0;
    COLOR_CACHE.clear();
  }

  positionIcons();
  return cleanup;
}
