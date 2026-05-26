/**
 * chatbot-widget.js — GoldInn Advisor (Glassmorphism Dark Theme)
 *
 * SETUP:
 * 1. Start proxy.js on your server first (node proxy.js)
 * 2. Drop this file on your site and add before </body>:
 *    <script src="chatbot-widget.js"></script>
 */

(function () {
  'use strict';

  // ─── CONFIG ──────────────────────────────────────────────────────────────────
  const CONFIG = {
    PROXY_URL: 'https://goldinn.onrender.com/chat',
    LEADS_URL: 'https://goldinn.onrender.com/leads',
    QUESTIONS_URL: 'https://goldinn.onrender.com/questions',
    WIDGET_TITLE: 'Vonny',
    WIDGET_SUBTITLE: 'Your GoldInn Concierge',
    ESCALATION_EMAIL: 'invest@yourplatform.com',
    QUICK_CHIPS: [
      'What is fractional ownership?',
      'What can I expect to earn?',
      'Which Minnesota properties?',
      'Can I stay there myself?',
      'Is this like a timeshare?',
      'How do I get started?'
    ]
  };
  // ─── END CONFIG ──────────────────────────────────────────────────────────────

  // ── Markdown renderer ──────────────────────────────────────────────────────
  function renderMarkdown(text) {
    if (!text) return '';
    let html = text
      // Escape raw HTML first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text*
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Bullet list lines: "- item" or "• item"
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      // Newlines → <br>
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> items in <ul>
    html = html.replace(/(<li>.*?<\/li>)(<br>)?/gs, (match) => match);
    html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, (block) => `<ul style="margin:6px 0 6px 16px;padding:0;">${block}</ul>`);

    return html;
  }

  // ── Inject Google Font ─────────────────────────────────────────────────────
  if (!document.querySelector('link[data-gi-font]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.setAttribute('data-gi-font', '1');
    document.head.appendChild(link);
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── Reset for widget elements ── */
    #gi-launcher, #gi-panel, #gi-panel * {
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* ── Launcher Button ── */
    #gi-launcher {
      position: fixed;
      bottom: 28px;
      right: 28px;
      height: 60px;
      padding: 0 20px 0 16px;
      border-radius: 30px;
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 0 20px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.4);
      z-index: 999999;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #gi-launcher:hover {
      transform: scale(1.1);
      box-shadow: 0 0 32px rgba(212,175,55,0.6), 0 8px 28px rgba(0,0,0,0.5);
    }
    #gi-launcher svg {
      width: 24px;
      height: 24px;
      fill: #fff;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
    }
    #gi-launcher-text {
      color: #0A0E1A;
      font-weight: 700;
      font-size: 15px;
      font-family: inherit;
    }

    /* ── Unread Badge ── */
    #gi-unread {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #E53E3E;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0A0E1A;
      animation: gi-pulse 2s ease-in-out infinite;
    }
    @keyframes gi-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(229,62,62,0.5); }
      50% { box-shadow: 0 0 0 6px rgba(229,62,62,0); }
    }

    /* ── Chat Panel ── */
    #gi-panel {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 380px;
      height: 600px;
      border-radius: 20px;
      background: rgba(10, 14, 26, 0.92);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1);
      display: flex;
      flex-direction: column;
      z-index: 999998;
      overflow: hidden;
      transition: opacity 0.2s ease-out, transform 0.2s ease-out, width 0.3s ease, height 0.3s ease, bottom 0.3s ease, right 0.3s ease, border-radius 0.3s ease;
      transform-origin: bottom right;
    }
    #gi-panel.gi-fullscreen {
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      border-radius: 0;
      border: none;
    }
    #gi-panel.gi-hidden {
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      pointer-events: none;
    }
    #gi-panel.gi-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* ── Header ── */
    #gi-header {
      background: rgba(15, 20, 40, 0.95);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(212,175,55,0.15);
      border-left: 3px solid #D4AF37;
    }
    .gi-h-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0A0E1A;
      box-shadow: 0 0 12px rgba(212,175,55,0.35);
    }
    .gi-h-info { flex: 1; min-width: 0; }
    .gi-h-title {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }
    .gi-h-sub {
      font-size: 11px;
      color: rgba(212,175,55,0.7);
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 500;
    }
    .gi-online-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #48BB78;
      flex-shrink: 0;
      animation: gi-online-pulse 2.5s ease-in-out infinite;
    }
    @keyframes gi-online-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .gi-header-actions {
      display: flex;
      margin-left: auto;
      gap: 6px;
    }
    .gi-header-actions button {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s, background 0.15s;
    }
    .gi-header-actions button:hover { color: #fff; background: rgba(255,255,255,0.1); }
    .gi-header-actions svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2; fill: none; }
    
    /* ── Quick Chips ── */
    #gi-chips {
      padding: 10px 14px;
      display: flex;
      gap: 7px;
      overflow-x: auto;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(212,175,55,0.08);
      scrollbar-width: none;
    }
    #gi-chips::-webkit-scrollbar { display: none; }
    .gi-chip {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid rgba(212,175,55,0.25);
      background: rgba(212,175,55,0.08);
      color: rgba(212,175,55,0.9);
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
      transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
    }
    .gi-chip:hover {
      background: rgba(212,175,55,0.2);
      border-color: rgba(212,175,55,0.5);
      color: #D4AF37;
      transform: translateY(-1px);
    }
    .gi-chip:active { transform: translateY(0); }

    /* ── Messages Area ── */
    #gi-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: transparent;
      scrollbar-width: thin;
      scrollbar-color: rgba(212,175,55,0.2) transparent;
    }
    #gi-messages::-webkit-scrollbar { width: 4px; }
    #gi-messages::-webkit-scrollbar-track { background: transparent; }
    #gi-messages::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); border-radius: 4px; }

    /* ── Message Row ── */
    .gi-msg {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      animation: gi-msg-in 0.25s ease-out both;
    }
    @keyframes gi-msg-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .gi-msg.gi-user { flex-direction: row-reverse; }

    /* ── Avatars ── */
    .gi-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
      letter-spacing: 0.02em;
    }
    .gi-msg.gi-bot .gi-avatar {
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      color: #0A0E1A;
      box-shadow: 0 0 8px rgba(212,175,55,0.3);
    }
    .gi-msg.gi-user .gi-avatar {
      background: rgba(71, 85, 105, 0.6);
      color: #CBD5E1;
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* ── Bubbles ── */
    .gi-bubble {
      padding: 10px 14px;
      font-size: 13px;
      line-height: 1.6;
      max-width: 80%;
      word-break: break-word;
    }
    .gi-msg.gi-bot .gi-bubble {
      background: rgba(255,255,255,0.06);
      color: #E2E8F0;
      border-radius: 4px 16px 16px 16px;
      border: 1px solid rgba(255,255,255,0.07);
    }
    .gi-msg.gi-user .gi-bubble {
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      color: #0A0E1A;
      border-radius: 16px 4px 16px 16px;
      font-weight: 500;
    }
    .gi-bubble strong { font-weight: 700; }
    .gi-bubble ul { margin: 6px 0 6px 16px; padding: 0; }
    .gi-bubble li { margin-bottom: 3px; }

    /* ── Typing Indicator ── */
    .gi-typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 4px 0;
    }
    .gi-typing-dots span {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #D4AF37;
      animation: gi-bounce 1.3s ease-in-out infinite;
    }
    .gi-typing-dots span:nth-child(2) { animation-delay: 0.18s; }
    .gi-typing-dots span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes gi-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    /* ── Escalation Banner ── */
    #gi-escalate {
      display: none;
      margin: 0 12px 10px;
      padding: 10px 14px;
      background: rgba(212,175,55,0.1);
      border: 1px solid rgba(212,175,55,0.35);
      border-radius: 10px;
      font-size: 12px;
      color: rgba(255,255,255,0.85);
      flex-shrink: 0;
      line-height: 1.5;
      animation: gi-msg-in 0.25s ease-out both;
    }
    #gi-escalate a {
      color: #D4AF37;
      text-decoration: underline;
      font-weight: 600;
    }
    #gi-escalate a:hover { color: #F0CC5A; }

    /* ── Input Area ── */
    #gi-input-row {
      padding: 10px 12px;
      border-top: 1px solid rgba(212,175,55,0.1);
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
      background: rgba(15, 20, 40, 0.6);
    }
    #gi-input {
      flex: 1;
      border: 1px solid rgba(212,175,55,0.15);
      border-radius: 14px;
      padding: 9px 14px;
      font-size: 13px;
      font-family: inherit;
      resize: none;
      min-height: 38px;
      max-height: 90px;
      background: rgba(255,255,255,0.05);
      color: #E2E8F0;
      outline: none;
      line-height: 1.45;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #gi-input::placeholder { color: rgba(255,255,255,0.3); }
    #gi-input:focus {
      border-color: rgba(212,175,55,0.45);
      box-shadow: 0 0 0 2px rgba(212,175,55,0.15);
      background: rgba(255,255,255,0.07);
    }
    #gi-send {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      box-shadow: 0 2px 10px rgba(212,175,55,0.3);
    }
    #gi-send:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 16px rgba(212,175,55,0.45);
    }
    #gi-send:active { transform: scale(0.97); }
    #gi-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    #gi-send svg { width: 16px; height: 16px; fill: #0A0E1A; }

    /* ── Disclaimer ── */
    .gi-disclaimer {
      font-size: 10px;
      color: rgba(255,255,255,0.25);
      text-align: center;
      padding: 4px 12px 8px;
      flex-shrink: 0;
      letter-spacing: 0.01em;
    }

    /* ── Gate Form ── */
    #gi-gate {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 380px;
      border-radius: 20px;
      background: rgba(10, 14, 26, 0.96);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(212, 175, 55, 0.25);
      box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1);
      padding: 28px 24px 24px;
      z-index: 999998;
      transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      transform-origin: bottom right;
    }
    #gi-gate.gi-hidden {
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      pointer-events: none;
    }
    #gi-gate.gi-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .gi-gate-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 800;
      color: #0A0E1A;
      margin: 0 auto 14px;
      box-shadow: 0 0 20px rgba(212,175,55,0.4);
    }
    .gi-gate-title {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      margin-bottom: 4px;
    }
    .gi-gate-sub {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      text-align: center;
      margin-bottom: 22px;
      line-height: 1.5;
    }
    .gi-gate-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(212,175,55,0.8);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
      display: block;
    }
    .gi-gate-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(212,175,55,0.18);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13.5px;
      font-family: inherit;
      color: #E2E8F0;
      outline: none;
      margin-bottom: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .gi-gate-input::placeholder { color: rgba(255,255,255,0.2); }
    .gi-gate-input:focus {
      border-color: rgba(212,175,55,0.5);
      box-shadow: 0 0 0 2px rgba(212,175,55,0.12);
      background: rgba(255,255,255,0.08);
    }
    .gi-gate-input.gi-error {
      border-color: rgba(239,68,68,0.6);
      box-shadow: 0 0 0 2px rgba(239,68,68,0.12);
    }
    .gi-gate-error {
      font-size: 11px;
      color: rgba(239,68,68,0.85);
      margin: -10px 0 12px;
      display: none;
    }
    #gi-gate-submit {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      border: none;
      border-radius: 10px;
      color: #0A0E1A;
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 4px 16px rgba(212,175,55,0.3);
      margin-top: 4px;
      letter-spacing: 0.01em;
    }
    #gi-gate-submit:hover {
      opacity: 0.92;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(212,175,55,0.45);
    }
    #gi-gate-submit:active { transform: translateY(0); }
    #gi-gate-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .gi-gate-privacy {
      font-size: 10px;
      color: rgba(255,255,255,0.2);
      text-align: center;
      margin-top: 12px;
      line-height: 1.4;
    }

    /* ── Mobile full-screen ── */
    @media (max-width: 440px) {
      #gi-panel {
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
      }
      #gi-gate {
        right: 0;
        bottom: 0;
        width: 100vw;
        border-radius: 0;
      }
      #gi-launcher {
        bottom: 20px;
        right: 20px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ───────────────────────────────────────────────────────────────────
  const container = document.createElement('div');
  container.innerHTML = `
    <button id="gi-launcher" aria-label="Open GoldInn investment advisor chat">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
        <circle cx="9" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>
      </svg>
      <span id="gi-launcher-text">Chat with Vonny</span>
      <div id="gi-unread" aria-label="1 unread message">1</div>
    </button>

    <!-- Gate form: shown before chat -->
    <div id="gi-gate" class="gi-hidden" role="dialog" aria-label="Chat access form" aria-modal="true">
      <div class="gi-gate-avatar">V</div>
      <div class="gi-gate-title">Meet Vonny 👋</div>
      <div class="gi-gate-sub">Your personal GoldInn concierge.<br>Quick intro before we chat.</div>

      <label class="gi-gate-label" for="gi-gate-name">Your Name</label>
      <input id="gi-gate-name" class="gi-gate-input" type="text" placeholder="Jane Smith" autocomplete="name" />
      <div class="gi-gate-error" id="gi-gate-name-err">Please enter your name</div>

      <label class="gi-gate-label" for="gi-gate-email">Email Address</label>
      <input id="gi-gate-email" class="gi-gate-input" type="email" placeholder="jane@example.com" autocomplete="email" />
      <div class="gi-gate-error" id="gi-gate-email-err">Please enter a valid email</div>

      <button id="gi-gate-submit">Start Chatting &rarr;</button>
      <div class="gi-gate-privacy">🔒 We’ll never share your info. No spam, ever.</div>
    </div>

    <!-- Chat panel: shown after gate -->
    <div id="gi-panel" class="gi-hidden" role="dialog" aria-label="GoldInn investment advisor chat" aria-modal="true">
      <div id="gi-header">
        <div class="gi-h-avatar">V</div>
        <div class="gi-h-info">
          <div class="gi-h-title">${CONFIG.WIDGET_TITLE}</div>
          <div class="gi-h-sub">
            <span class="gi-online-dot"></span>
            ${CONFIG.WIDGET_SUBTITLE}
          </div>
        </div>
        <div class="gi-header-actions">
          <button id="gi-expand" aria-label="Toggle Fullscreen" title="Toggle Fullscreen">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button id="gi-close" aria-label="Close Chat" title="Close Chat">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div id="gi-chips" role="list" aria-label="Quick questions">
        ${CONFIG.QUICK_CHIPS.map((c, i) =>
          `<button class="gi-chip" role="listitem" id="gi-chip-${i}">${c}</button>`
        ).join('')}
      </div>

      <div id="gi-messages" aria-live="polite" aria-label="Chat messages"></div>

      <div id="gi-escalate" role="alert">
        💬 A member of our team will follow up at
        <a href="mailto:${CONFIG.ESCALATION_EMAIL}">${CONFIG.ESCALATION_EMAIL}</a>
      </div>

      <div id="gi-input-row">
        <textarea
          id="gi-input"
          rows="1"
          placeholder="Ask about GoldInn investments…"
          aria-label="Type your message"
          autocomplete="off"
          spellcheck="true"
        ></textarea>
        <button id="gi-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <div class="gi-disclaimer">For informational purposes only &#8212; not financial advice.</div>
    </div>
  `;
  document.body.appendChild(container);

  // ── State ──────────────────────────────────────────────────────────────────
  let isOpen      = false;
  let gateShown   = false;
  let isLoading   = false;
  let chipsHidden = false;
  let history     = [];
  let leadData    = { name: null, email: null };

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const panel      = document.getElementById('gi-panel');
  const gate       = document.getElementById('gi-gate');
  const launcher   = document.getElementById('gi-launcher');
  const messages   = document.getElementById('gi-messages');
  const input      = document.getElementById('gi-input');
  const sendBtn    = document.getElementById('gi-send');
  const unread     = document.getElementById('gi-unread');
  const escalate   = document.getElementById('gi-escalate');
  const chips      = document.getElementById('gi-chips');
  const gateSubmit = document.getElementById('gi-gate-submit');
  const gateName   = document.getElementById('gi-gate-name');
  const gateEmail  = document.getElementById('gi-gate-email');
  const gateNameErr  = document.getElementById('gi-gate-name-err');
  const gateEmailErr = document.getElementById('gi-gate-email-err');

  function welcomeMessage(name) {
    return `Hey ${name}! 👋 So glad you're here — I'm **Vonny** and I know Minnesota vacation real estate inside and out.\n\nWhat would you like to know about investing with GoldInn?`;
  }

  // ── Gate helpers ───────────────────────────────────────────────────────────
  function showGate() {
    gate.classList.remove('gi-hidden');
    gate.classList.add('gi-visible');
    unread.style.display = 'none';
    setTimeout(() => gateName.focus(), 200);
  }
  function hideGate() {
    gate.classList.remove('gi-visible');
    gate.classList.add('gi-hidden');
  }
  function openChat() {
    panel.classList.remove('gi-hidden');
    panel.classList.add('gi-visible');
    isOpen = true;
    if (messages.children.length === 0) addMessage('bot', welcomeMessage(leadData.name));
    setTimeout(() => input.focus(), 220);
  }
  function closeChat() {
    panel.classList.remove('gi-visible');
    panel.classList.add('gi-hidden');
    isOpen = false;
  }
  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  // ── Gate submit ────────────────────────────────────────────────────────────
  gateSubmit.addEventListener('click', () => {
    let valid = true;
    const nameVal  = gateName.value.trim();
    const emailVal = gateEmail.value.trim();

    if (!nameVal) {
      gateName.classList.add('gi-error');
      gateNameErr.style.display = 'block';
      valid = false;
    } else {
      gateName.classList.remove('gi-error');
      gateNameErr.style.display = 'none';
    }
    if (!emailVal || !validateEmail(emailVal)) {
      gateEmail.classList.add('gi-error');
      gateEmailErr.style.display = 'block';
      valid = false;
    } else {
      gateEmail.classList.remove('gi-error');
      gateEmailErr.style.display = 'none';
    }
    if (!valid) return;

    leadData.name  = nameVal;
    leadData.email = emailVal;
    gateSubmit.disabled = true;
    gateSubmit.textContent = 'Opening chat…';
    saveLead();

    setTimeout(() => { hideGate(); openChat(); }, 300);
  });

  // Enter submits gate form
  [gateName, gateEmail].forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') gateSubmit.click(); });
  });

  // ── Launcher click ─────────────────────────────────────────────────────────
  launcher.addEventListener('click', () => {
    if (isOpen) {
      closeChat();
    } else if (leadData.name) {
      openChat(); // already gated — go straight to chat
    } else if (gateShown) {
      hideGate(); gateShown = false;
    } else {
      showGate(); gateShown = true;
    }
  });

  document.getElementById('gi-close').addEventListener('click', closeChat);
  document.getElementById('gi-expand').addEventListener('click', () => {
    panel.classList.toggle('gi-fullscreen');
    scrollToBottom();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (isOpen) closeChat();
      else if (gateShown) { hideGate(); gateShown = false; }
    }
  });

  // ── Chips ──────────────────────────────────────────────────────────────────
  document.querySelectorAll('.gi-chip').forEach(chip => {
    chip.addEventListener('click', () => { input.value = chip.textContent; send(); });
  });

  // ── Add message ────────────────────────────────────────────────────────────
  function addMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `gi-msg gi-${role}`;

    const av = document.createElement('div');
    av.className = 'gi-avatar';
    av.textContent = role === 'bot' ? 'V' : 'You';
    av.setAttribute('aria-hidden', 'true');

    const bubble = document.createElement('div');
    bubble.className = 'gi-bubble';
    bubble.innerHTML = renderMarkdown(text);

    wrap.appendChild(av);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    scrollToBottom();
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Typing indicator ───────────────────────────────────────────────────────
  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'gi-msg gi-bot';
    wrap.id = 'gi-typing-indicator';
    wrap.innerHTML = `
      <div class="gi-avatar" aria-hidden="true">V</div>
      <div class="gi-bubble">
        <div class="gi-typing-dots" aria-label="GoldInn advisor is typing">
          <span></span><span></span><span></span>
        </div>
      </div>`;
    messages.appendChild(wrap);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('gi-typing-indicator');
    if (el) el.remove();
  }

  // ── Hide chips after first message ────────────────────────────────────────
  function hideChips() {
    if (chipsHidden) return;
    chipsHidden = true;
    chips.style.transition = 'opacity 0.3s, max-height 0.4s';
    chips.style.opacity = '0';
    chips.style.maxHeight = '0';
    chips.style.padding = '0';
    chips.style.overflow = 'hidden';
  }

  // ── Lead & question capture ────────────────────────────────────────────────
  function saveLead() {
    if (!leadData.name && !leadData.email) return;
    fetch(CONFIG.LEADS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:      leadData.name  || null,
        email:     leadData.email || null,
        timestamp: new Date().toISOString(),
        page:      window.location.href
      })
    }).catch(() => {}); // silent — don't interrupt the chat
  }

  function saveQuestion(question, name, email) {
    fetch(CONFIG.QUESTIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        name:      name  || 'Unknown',
        email:     email || 'Unknown',
        timestamp: new Date().toISOString(),
        page:      window.location.href
      })
    }).catch(() => {}); // silent
  }

  // ── Send message ───────────────────────────────────────────────────────────
  async function send() {
    if (isLoading) return;
    const text = input.value.trim();
    if (!text) return;

    // Reset input
    input.value = '';
    input.style.height = 'auto';

    // Hide chips on first send
    hideChips();

    isLoading = true;
    sendBtn.disabled = true;

    addMessage('user', text);
    history.push({ role: 'user', content: text });
    showTyping();

    // Inject name/email into system prompt so Vonny knows who she's talking to
    try {
      const res = await fetch(CONFIG.PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: leadData.name || null,
          userEmail: leadData.email || null,
          messages: history
        })
      });

      const data = await res.json();
      removeTyping();

      if (!res.ok) {
        const errMsg = data?.detail || data?.error || 'An error occurred. Please try again.';
        addMessage('bot', `⚠️ ${errMsg}`);
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
        return;
      }

      let reply = data.text || "I'm sorry, I couldn't process that request. Please try again.";
      let shouldEscalate = false;

      // ── Parse CAPTURE tokens ────────────────────────────────────────────────
      // CAPTURE_NAME
      const nameMatch = reply.match(/CAPTURE_NAME:\s*(.+)/i);
      if (nameMatch) {
        leadData.name = nameMatch[1].trim();
        reply = reply.replace(/CAPTURE_NAME:\s*.+/gi, '').trim();
        saveLead();
      }

      // CAPTURE_EMAIL
      const emailMatch = reply.match(/CAPTURE_EMAIL:\s*(\S+@\S+\.\S+)/i);
      if (emailMatch) {
        leadData.email = emailMatch[1].trim();
        reply = reply.replace(/CAPTURE_EMAIL:\s*\S+/gi, '').trim();
        saveLead();
      }

      // CAPTURE_QUESTION
      const qMatch = reply.match(/CAPTURE_QUESTION:\s*(.+)/i);
      if (qMatch) {
        saveQuestion(qMatch[1].trim(), leadData.name, leadData.email);
        reply = reply.replace(/CAPTURE_QUESTION:\s*.+/gi, '').trim();
      }

      // ESCALATE_TO_HUMAN
      if (reply.includes('ESCALATE_TO_HUMAN')) {
        shouldEscalate = true;
        reply = reply.replace(/ESCALATE_TO_HUMAN/g, '').trim();
      }

      history.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);

      if (shouldEscalate) {
        escalate.style.display = 'block';
        setTimeout(() => { escalate.style.display = 'none'; }, 12000);
      }

    } catch (err) {
      removeTyping();
      addMessage('bot', '⚠️ Connection issue — please check your internet and try again.');
      console.error('[GoldInn Chatbot] Error:', err);
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── Event bindings ─────────────────────────────────────────────────────────
  sendBtn.addEventListener('click', send);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 90) + 'px';
  });



})();
