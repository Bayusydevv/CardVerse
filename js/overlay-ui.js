/**
 * CardVerse — AR Overlay UI Builder
 * Builds Three.js 3D overlay objects anchored to each MindAR target.
 * Called from ar-main.js after MindAR anchors are set up.
 */

/* ─────────────────────────────────────────────
   SOCIAL BUTTON PANEL (HTML overlay)
   Slides up when a marker is detected.
───────────────────────────────────────────── */
function buildSocialPanel(user) {
  const panel = document.createElement('div');
  panel.className = 'ar-social-panel';
  panel.id = `social-panel-${user.index}`;
  panel.setAttribute('data-user', user.index);

  // User info header
  const header = document.createElement('div');
  header.className = 'ar-panel-header';
  header.innerHTML = `
    <div class="ar-panel-avatar" style="background: linear-gradient(135deg, ${user.gradientFrom}, ${user.gradientTo});">
      <span>${user.initial}</span>
    </div>
    <div class="ar-panel-info">
      <strong>${user.name}</strong>
      <span>${user.title}</span>
    </div>
  `;

  // Social buttons
  const buttons = document.createElement('div');
  buttons.className = 'ar-panel-buttons';

  const socialDefs = [
    {
      key: 'instagram',
      label: 'Instagram',
      sublabel: user.socials.instagram?.label || '',
      color: '#E1306C',
      icon: getARSocialIcon('ig'),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      sublabel: user.socials.whatsapp?.label || '',
      color: '#25D366',
      icon: getARSocialIcon('wa'),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      sublabel: user.socials.linkedin?.label || '',
      color: '#0A66C2',
      icon: getARSocialIcon('li'),
    },
  ];

  socialDefs.forEach(({ key, label, sublabel, color, icon }) => {
    const social = user.socials[key];
    if (!social) return;

    const btn = document.createElement('a');
    btn.href = social.url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className = 'ar-social-btn';
    btn.style.setProperty('--btn-color', color);
    btn.innerHTML = `
      <span class="ar-btn-icon" style="color: ${color};">${icon}</span>
      <span class="ar-btn-text">
        <span class="ar-btn-label">${label}</span>
        <span class="ar-btn-sub">${sublabel}</span>
      </span>
      <svg class="ar-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 17L17 7M17 7H7M17 7v10"/>
      </svg>
    `;
    buttons.appendChild(btn);
  });

  panel.appendChild(header);
  panel.appendChild(buttons);

  // Dismiss button
  const dismiss = document.createElement('button');
  dismiss.className = 'ar-panel-dismiss';
  dismiss.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
    Tutup
  `;
  dismiss.addEventListener('click', () => hideSocialPanel(user.index));
  panel.appendChild(dismiss);

  document.getElementById('ar-ui-overlay').appendChild(panel);
  return panel;
}

/* ─────────────────────────────────────────────
   PANEL VISIBILITY
───────────────────────────────────────────── */
function showSocialPanel(userIndex) {
  // Hide all panels first
  document.querySelectorAll('.ar-social-panel').forEach((p) => {
    p.classList.remove('visible');
  });
  const panel = document.getElementById(`social-panel-${userIndex}`);
  if (panel) {
    panel.classList.add('visible');
  }
}

function hideSocialPanel(userIndex) {
  const panel = document.getElementById(`social-panel-${userIndex}`);
  if (panel) {
    panel.classList.remove('visible');
  }
}

function hideAllSocialPanels() {
  document.querySelectorAll('.ar-social-panel').forEach((p) => {
    p.classList.remove('visible');
  });
}

/* ─────────────────────────────────────────────
   THREE.JS CANVAS TEXTURE — Name Card
───────────────────────────────────────────── */
function createNameCardTexture(user) {
  const W = 512;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background — dark glass
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, 'rgba(10,14,26,0.92)');
  bgGrad.addColorStop(1, 'rgba(5,8,16,0.95)');
  roundRect(ctx, 0, 0, W, H, 24, bgGrad);

  // Accent border gradient
  const borderGrad = ctx.createLinearGradient(0, 0, W, 0);
  borderGrad.addColorStop(0, user.gradientFrom);
  borderGrad.addColorStop(1, user.gradientTo);
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  roundRectStroke(ctx, 2, 2, W - 4, H - 4, 22);

  // Top accent bar
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, user.gradientFrom);
  barGrad.addColorStop(1, user.gradientTo);
  roundRect(ctx, 20, 20, W - 40, 6, 3, barGrad);

  // Avatar circle
  const avatarX = 52;
  const avatarY = H / 2;
  const avatarR = 46;
  const avatarGrad = ctx.createLinearGradient(avatarX - avatarR, avatarY - avatarR, avatarX + avatarR, avatarY + avatarR);
  avatarGrad.addColorStop(0, user.gradientFrom);
  avatarGrad.addColorStop(1, user.gradientTo);
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
  ctx.fillStyle = avatarGrad;
  ctx.fill();

  // Avatar initial
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.fillText(user.initial, avatarX, avatarY + 2);
  ctx.shadowBlur = 0;

  // Name text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const nameLines = wrapText(ctx, user.name, W - 130, 26);
  let nameY = H / 2 - (nameLines.length > 1 ? 22 : 10);
  nameLines.forEach((line) => {
    ctx.fillText(line, 115, nameY);
    nameY += 32;
  });

  // Title text
  ctx.fillStyle = 'rgba(203,213,225,0.8)';
  ctx.font = '20px Arial';
  ctx.fillText(user.title, 115, nameY + 4);

  // CardVerse watermark
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('CardVerse AR', W - 20, H - 16);

  return new THREE.CanvasTexture(canvas);
}

/* ─────────────────────────────────────────────
   THREE.JS NAME CARD PLANE
───────────────────────────────────────────── */
function createNameCardMesh(user) {
  const texture = createNameCardTexture(user);
  const geometry = new THREE.PlaneGeometry(1.8, 0.9);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0.55, 0.01);
  mesh.userData.floatOffset = Math.random() * Math.PI * 2;
  mesh.userData.baseY = 0.55;
  return mesh;
}

/* ─────────────────────────────────────────────
   FLOAT ANIMATION
───────────────────────────────────────────── */
function animateFloatMeshes(meshes, time) {
  meshes.forEach((mesh) => {
    if (!mesh || !mesh.userData) return;
    const offset = mesh.userData.floatOffset || 0;
    const baseY = mesh.userData.baseY || 0;
    mesh.position.y = baseY + Math.sin(time * 1.2 + offset) * 0.04;
  });
}

/* ─────────────────────────────────────────────
   CANVAS UTILITY HELPERS
───────────────────────────────────────────── */
function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function roundRectStroke(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.stroke();
}

function wrapText(ctx, text, maxWidth, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

/* ─────────────────────────────────────────────
   AR SOCIAL ICONS (inline SVG strings)
───────────────────────────────────────────── */
function getARSocialIcon(type) {
  const icons = {
    ig: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>`,
    wa: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>`,
    li: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>`,
  };
  return icons[type] || '';
}
