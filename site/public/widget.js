/**
 * Coco Samui AI Concierge — Embeddable Widget
 * Usage: <script src="https://coco-samui-ai.com/widget.js" data-hotel="your-hotel-slug"></script>
 * Optional: data-lang="fr" | data-position="left" | data-color="#00b894"
 */
(function () {
  'use strict';

  // ─── Config ───────────────────────────────────────────────────────────────
  const BASE_URL = 'https://coco-samui-ai.com';
  const script   = document.currentScript || (function () {
    const s = document.querySelectorAll('script[src*="widget.js"]');
    return s[s.length - 1];
  })();

  const HOTEL    = (script && script.getAttribute('data-hotel')) || '';
  const LANG     = (script && script.getAttribute('data-lang'))  || 'en';
  const POSITION = (script && script.getAttribute('data-position') === 'left') ? 'left' : 'right';
  const COLOR    = (script && script.getAttribute('data-color'))  || '#00b894';

  // ─── Labels per language ───────────────────────────────────────────────────
  const LABELS = {
    en: { title: 'Coco — Your Samui Guide', greeting: 'Hi! Ask me anything about Koh Samui 🌴', close: 'Close' },
    fr: { title: 'Coco — Votre guide Samui', greeting: 'Bonjour ! Posez-moi n\'importe quelle question sur Koh Samui 🌴', close: 'Fermer' },
    de: { title: 'Coco — Ihr Samui-Guide', greeting: 'Hallo! Fragen Sie mich alles über Koh Samui 🌴', close: 'Schließen' },
    sv: { title: 'Coco — Din Samui-guide', greeting: 'Hej! Fråga mig vad som helst om Koh Samui 🌴', close: 'Stäng' },
    zh: { title: 'Coco — 您的苏梅岛向导', greeting: '您好！有关苏梅岛的任何问题都可以问我 🌴', close: '关闭' },
    th: { title: 'โคโค่ — ไกด์เกาะสมุยของคุณ', greeting: 'สวัสดี! ถามฉันอะไรก็ได้เกี่ยวกับเกาะสมุย 🌴', close: 'ปิด' },
  };
  const L = LABELS[LANG] || LABELS.en;

  // ─── Prevent double-init ───────────────────────────────────────────────────
  if (window.__cocoWidgetLoaded) return;
  window.__cocoWidgetLoaded = true;

  // ─── Styles ────────────────────────────────────────────────────────────────
  const css = `
    #coco-widget-btn {
      position: fixed;
      ${POSITION}: 24px;
      bottom: 24px;
      z-index: 99998;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${COLOR};
      box-shadow: 0 4px 20px rgba(0,0,0,.25);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      transition: transform .2s ease, box-shadow .2s ease;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    #coco-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,0,0,.3);
    }
    #coco-widget-btn .coco-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: #ff4757;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #fff;
      font-family: sans-serif;
      font-weight: 700;
      border: 2px solid #fff;
    }
    #coco-widget-panel {
      position: fixed;
      ${POSITION}: 20px;
      bottom: 98px;
      z-index: 99999;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 580px;
      max-height: calc(100vh - 120px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,.22);
      display: none;
      flex-direction: column;
      background: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      animation: cocoSlideIn .25s ease;
    }
    #coco-widget-panel.coco-open {
      display: flex;
    }
    @keyframes cocoSlideIn {
      from { opacity: 0; transform: translateY(12px) scale(.97); }
      to   { opacity: 1; transform: translateY(0)    scale(1); }
    }
    #coco-panel-header {
      background: ${COLOR};
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #coco-panel-header .coco-title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #coco-panel-header .coco-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    #coco-close-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,.85);
      font-size: 20px;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      line-height: 1;
      transition: background .15s;
    }
    #coco-close-btn:hover { background: rgba(255,255,255,.15); }
    #coco-panel-body {
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    #coco-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
    #coco-greeting {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: #f8fffe;
      padding: 14px 16px;
      font-size: 13px;
      color: #555;
      border-top: 1px solid #e8f5f0;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      transition: opacity .3s;
    }
    #coco-greeting .gr-icon { font-size: 22px; flex-shrink: 0; }
    #coco-greeting .gr-text { line-height: 1.4; }
    #coco-powered {
      background: #fff;
      padding: 5px 10px;
      text-align: center;
      font-size: 10px;
      color: #bbb;
      flex-shrink: 0;
      border-top: 1px solid #f0f0f0;
    }
    #coco-powered a { color: ${COLOR}; text-decoration: none; }
    @media (max-width: 420px) {
      #coco-widget-panel {
        width: 100vw;
        max-width: 100vw;
        ${POSITION}: 0;
        bottom: 80px;
        border-radius: 16px 16px 0 0;
        height: calc(100vh - 88px);
        max-height: calc(100vh - 88px);
      }
    }
  `;

  // ─── Inject styles ─────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ─── Build iframe src ──────────────────────────────────────────────────────
  function buildIframeSrc() {
    const params = new URLSearchParams({ widget: '1', lang: LANG });
    if (HOTEL) params.set('hotel', HOTEL);
    return `${BASE_URL}/?${params.toString()}`;
  }

  // ─── DOM ────────────────────────────────────────────────────────────────────
  // Trigger button
  const btn = document.createElement('button');
  btn.id = 'coco-widget-btn';
  btn.setAttribute('aria-label', L.title);
  btn.innerHTML = '🌴<span class="coco-badge" id="coco-badge">1</span>';

  // Panel
  const panel = document.createElement('div');
  panel.id = 'coco-widget-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', L.title);
  panel.innerHTML = `
    <div id="coco-panel-header">
      <div class="coco-title">
        <div class="coco-avatar">🌴</div>
        ${L.title}
      </div>
      <button id="coco-close-btn" aria-label="${L.close}">✕</button>
    </div>
    <div id="coco-panel-body">
      <iframe id="coco-iframe" src="about:blank" title="${L.title}" loading="lazy" allow="autoplay"></iframe>
      <div id="coco-greeting">
        <span class="gr-icon">🤙</span>
        <span class="gr-text">${L.greeting}</span>
      </div>
    </div>
    <div id="coco-powered">Powered by <a href="${BASE_URL}" target="_blank" rel="noopener">Coco Samui AI</a></div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ─── State ──────────────────────────────────────────────────────────────────
  let isOpen    = false;
  let iframeLoaded = false;
  const badge  = document.getElementById('coco-badge');
  const iframe = document.getElementById('coco-iframe');
  const greeting = document.getElementById('coco-greeting');

  // Show badge after 4 seconds (new visitor nudge)
  setTimeout(() => {
    if (!isOpen) {
      badge.style.display = 'flex';
    }
  }, 4000);

  function openPanel() {
    isOpen = true;
    panel.classList.add('coco-open');
    btn.setAttribute('aria-expanded', 'true');
    badge.style.display = 'none';

    // Lazy-load iframe on first open
    if (!iframeLoaded) {
      iframe.src = buildIframeSrc();
      iframeLoaded = true;

      // Hide greeting card when iframe fully loads
      iframe.addEventListener('load', function () {
        setTimeout(() => {
          if (greeting) greeting.style.opacity = '0';
          setTimeout(() => { if (greeting) greeting.remove(); }, 350);
        }, 800);
      }, { once: true });
    }

    // Trap focus inside panel
    panel.focus && panel.focus();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('coco-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  function togglePanel() {
    isOpen ? closePanel() : openPanel();
  }

  // ─── Events ─────────────────────────────────────────────────────────────────
  btn.addEventListener('click', togglePanel);
  document.getElementById('coco-close-btn').addEventListener('click', closePanel);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  // Close on click outside
  document.addEventListener('click', function (e) {
    if (isOpen && !panel.contains(e.target) && e.target !== btn) {
      closePanel();
    }
  });

  // ─── postMessage bridge (allow hotel page to open widget programmatically) ──
  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'coco:open')  openPanel();
    if (e.data.type === 'coco:close') closePanel();
  });

  // ─── Public API ─────────────────────────────────────────────────────────────
  window.CocoWidget = {
    open:  openPanel,
    close: closePanel,
    toggle: togglePanel,
  };

})();
