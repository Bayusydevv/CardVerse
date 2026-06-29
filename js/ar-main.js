/**
 * CardVerse — AR Main
 * Initializes MindAR + Three.js, manages 5 UI states, drives the AR experience.
 *
 * UI States:
 *   LOADING          → Waiting for resources / targets.mind
 *   PERMISSION_DENIED → Camera denied
 *   SCANNING         → Camera active, looking for markers
 *   DETECTED         → Marker found, overlay active
 *   LOST             → Marker lost after detection
 */

/* ─────────────────────────────────────────────
   GLOBALS
───────────────────────────────────────────── */
let mindARStarted = false;
let arSystem = null; // MindARThree instance
let renderer = null;
let scene = null;
let camera = null;
let animFrameId = null;

const floatMeshes = []; // All floating Three.js name card meshes
const anchors = [];     // MindAR anchors per user

/* ─────────────────────────────────────────────
   STATE MACHINE
───────────────────────────────────────────── */
const AR_STATE = {
  LOADING: 'LOADING',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  SCANNING: 'SCANNING',
  DETECTED: 'DETECTED',
  LOST: 'LOST',
};

let currentState = AR_STATE.LOADING;

function setState(newState) {
  currentState = newState;
  updateUIForState(newState);
}

function updateUIForState(state) {
  // Hide all state layers
  document.querySelectorAll('.ar-state-layer').forEach((el) => {
    el.classList.remove('active');
  });

  // Show the matching layer
  const layer = document.getElementById(`state-${state.toLowerCase()}`);
  if (layer) layer.classList.add('active');

  // Scanning frame visibility
  const scanFrame = document.getElementById('scan-frame');
  if (scanFrame) {
    scanFrame.style.display = state === AR_STATE.SCANNING || state === AR_STATE.LOST ? 'flex' : 'none';
  }
}

/* ─────────────────────────────────────────────
   BOOT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  setState(AR_STATE.LOADING);

  // Build social panels for all users
  CARDVERSE_CONFIG.users.forEach((user) => buildSocialPanel(user));

  // Wire back button
  const backBtn = document.getElementById('btn-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      stopAR();
      window.location.href = 'index.html';
    });
  }

  // Wire retry button
  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      setState(AR_STATE.LOADING);
      setTimeout(initAR, 400);
    });
  }

  // Slight delay so loading UI renders before heavy init
  setTimeout(initAR, 600);
});

/* ─────────────────────────────────────────────
   INIT MindAR
───────────────────────────────────────────── */
async function initAR() {
  // Verify targets file is reachable before starting MindAR
  try {
    const probe = await fetch(CARDVERSE_CONFIG.targetsPath, { method: 'GET' });
    if (!probe.ok) throw new Error('targets.mind HTTP status: ' + probe.status);
  } catch (err) {
    alert("Fetch Error: " + err.message);
    showTargetsMissingUI();
    return;
  }

  try {
    arSystem = new window.MINDAR.IMAGE.MindARThree({
      container: document.getElementById('ar-container'),
      imageTargetSrc: CARDVERSE_CONFIG.targetsPath,
      maxTrack: 4,
      uiLoading: 'no',   // We handle our own UI
      uiScanning: 'no',
      uiError: 'no',
    });

    ({ renderer, scene, camera } = arSystem);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(0, 1, 1);
    scene.add(dirLight);

    // Create anchor + mesh for each user
    CARDVERSE_CONFIG.users.forEach((user) => {
      const anchor = arSystem.addAnchor(user.index);
      const nameMesh = createNameCardMesh(user);
      anchor.group.add(nameMesh);
      floatMeshes.push(nameMesh);
      anchors.push(anchor);

      // Detected event
      anchor.onTargetFound = () => {
        setState(AR_STATE.DETECTED);
        showSocialPanel(user.index);
      };

      // Lost event
      anchor.onTargetLost = () => {
        hideSocialPanel(user.index);
        // Only go to LOST if no other anchor is currently tracked
        const anyFound = anchors.some((a) => a.visible);
        if (!anyFound) setState(AR_STATE.LOST);
      };
    });

    // Start
    await arSystem.start();
    mindARStarted = true;
    setState(AR_STATE.SCANNING);
    startRenderLoop();
  } catch (err) {
    console.error('[CardVerse AR] Init error:', err);
    if (
      err.name === 'NotAllowedError' ||
      (err.message && err.message.toLowerCase().includes('permission'))
    ) {
      setState(AR_STATE.PERMISSION_DENIED);
    } else {
      alert("AR Init Error: " + err.message + "\\n" + err.stack);
      showTargetsMissingUI();
    }
  }
}

/* ─────────────────────────────────────────────
   TARGETS.MIND MISSING UI
───────────────────────────────────────────── */
function showTargetsMissingUI() {
  setState(AR_STATE.LOADING); // reuse loading layer with custom message
  const loadingLayer = document.getElementById('state-loading');
  if (!loadingLayer) return;

  loadingLayer.innerHTML = `
    <div class="ar-loading-card ar-missing-card">
      <div class="ar-missing-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          <path d="M11 8v4M11 14h.01"/>
        </svg>
      </div>
      <h2>File Target Belum Ada</h2>
      <p class="ar-missing-desc">
        File <code>assets/targets.mind</code> belum digenerate.<br>
        Buat file tersebut terlebih dahulu agar AR dapat berjalan.
      </p>
      <div class="ar-missing-steps">
        <div class="ar-missing-step">
          <span class="step-num">1</span>
          <span>Buka <a href="https://hiukim.github.io/mind-ar-js-doc/tools/compile" target="_blank" rel="noopener">MindAR Image Compiler</a></span>
        </div>
        <div class="ar-missing-step">
          <span class="step-num">2</span>
          <span>Upload 4 foto kartu nama Anda</span>
        </div>
        <div class="ar-missing-step">
          <span class="step-num">3</span>
          <span>Download file <code>.mind</code> yang dihasilkan</span>
        </div>
        <div class="ar-missing-step">
          <span class="step-num">4</span>
          <span>Simpan sebagai <code>assets/targets.mind</code></span>
        </div>
      </div>
      <div class="ar-missing-actions">
        <a href="https://hiukim.github.io/mind-ar-js-doc/tools/compile" target="_blank" rel="noopener" class="btn-ar-primary">
          Buka MindAR Compiler
        </a>
        <a href="index.html" class="btn-ar-secondary">Kembali ke Landing</a>
      </div>
    </div>
  `;
  loadingLayer.classList.add('active');
}

/* ─────────────────────────────────────────────
   RENDER LOOP
───────────────────────────────────────────── */
function startRenderLoop() {
  const clock = new THREE.Clock();

  function render() {
    animFrameId = requestAnimationFrame(render);
    const elapsed = clock.getElapsedTime();

    // Float animation
    animateFloatMeshes(floatMeshes, elapsed);

    renderer.render(scene, camera);
  }
  render();
}

/* ─────────────────────────────────────────────
   STOP AR
───────────────────────────────────────────── */
function stopAR() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (arSystem && mindARStarted) {
    try {
      arSystem.stop();
    } catch (_) {}
  }
  mindARStarted = false;
}

// Cleanup on page hide
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAR();
});
