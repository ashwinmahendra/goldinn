/**
 * proxy.js — Google Gemini API Proxy Server for GoldInn
 *
 * Keeps your API key server-side and handles CORS
 * so the chatbot widget on your site can call it safely.
 *
 * SETUP:
 *   1. Get a FREE Gemini API key at: https://aistudio.google.com/apikey
 *   2. Replace 'YOUR_GEMINI_API_KEY' below with your actual key
 *   3. npm install express cors
 *   4. node proxy.js   (or: pm2 start proxy.js --name proxy)
 *
 * Runs on port 3001 by default.
 */

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CONFIG ────────────────────────────────────────────────────────────────────
//  ↓  Get your FREE key at https://aistudio.google.com/apikey  ↓
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

const GEMINI_MODEL    = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const ALLOWED_ORIGIN  = 'https://ashwinmahendra.github.io';   // ← your production domain

// ── Storage files ─────────────────────────────────────────────────────────────
const LEADS_FILE     = path.join(__dirname, 'leads.json');
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getKnowledgeBase() {
  const kbDir = path.join(__dirname, 'knowledge');
  if (!fs.existsSync(kbDir)) return '';
  
  let combinedKnowledge = '';
  const files = fs.readdirSync(kbDir);
  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.txt')) {
      const content = fs.readFileSync(path.join(kbDir, file), 'utf8');
      combinedKnowledge += `\n\n--- Start of Document: ${file} ---\n${content}\n--- End of Document: ${file} ---\n`;
    }
  }
  return combinedKnowledge;
}
// ─────────────────────────────────────────────────────────────────────────────

app.use(express.json());

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow file://, all localhost variants, and the configured ALLOWED_ORIGIN
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||                   // curl / Postman / server-side (no Origin header)
      origin === 'null' ||         // file:// pages (browsers send the string "null")
      origin === ALLOWED_ORIGIN ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      console.warn(`[CORS] blocked origin: ${origin}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ── POST /chat ────────────────────────────────────────────────────────────────
app.post('/chat', async (req, res) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] POST /chat — origin: ${req.headers.origin || 'none'}`);

  // ── Guard: placeholder key ──────────────────────────────────────────────────
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.error('[proxy] Gemini API key is still the placeholder!');
    return res.status(500).json({
      error: 'API key not configured',
      detail: 'Replace YOUR_GEMINI_API_KEY in proxy.js with your real Gemini key. Get one free at https://aistudio.google.com/apikey'
    });
  }

  let { systemPrompt, messages, userName, userEmail } = req.body;

  // Prepend knowledge base and user info to system prompt
  const kb = getKnowledgeBase();
  let fullSystemPrompt = '';
  
  if (userName || userEmail) {
    fullSystemPrompt += `Current User Details:\nName: ${userName || 'Unknown'}\nEmail: ${userEmail || 'Unknown'}\n\n`;
  }
  
  if (systemPrompt) {
    fullSystemPrompt += `${systemPrompt}\n\n`;
  }
  
  fullSystemPrompt += `\n\nKNOWLEDGE BASE DOCUMENTS:\n${kb}`;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Bad request', detail: 'messages array is required' });
  }

  // ── Map to Gemini format ────────────────────────────────────────────────────
  // Gemini uses role "model" instead of "assistant"
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const geminiBody = {
    system_instruction: fullSystemPrompt
      ? { parts: [{ text: fullSystemPrompt }] }
      : undefined,
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    }
  };

  // Remove undefined keys
  if (!geminiBody.system_instruction) delete geminiBody.system_instruction;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Gemini API] error ${response.status}:`, errText);
      return res.status(response.status).json({
        error: `Gemini API error (${response.status})`,
        detail: errText
      });
    }

    const data = await response.json();

    // ── Extract reply text ────────────────────────────────────────────────────
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      console.error('[Gemini API] Unexpected response shape:', JSON.stringify(data));
      return res.status(502).json({
        error: 'Empty response from Gemini',
        detail: JSON.stringify(data)
      });
    }

    // ── Log token usage ───────────────────────────────────────────────────────
    const usage = data.usageMetadata || {};
    console.log(
      `[${new Date().toISOString()}] Success — ` +
      `promptTokens: ${usage.promptTokenCount ?? '?'}, ` +
      `candidateTokens: ${usage.candidatesTokenCount ?? '?'}, ` +
      `totalTokens: ${usage.totalTokenCount ?? '?'}`
    );

    return res.json({ text: replyText });

  } catch (err) {
    console.error('[proxy] Fetch error:', err.message);
    return res.status(500).json({ error: 'Proxy request failed', detail: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', model: GEMINI_MODEL }));

// ── POST /leads ──────────────────────────────────────────────────────────
app.post('/leads', (req, res) => {
  const { name, email, timestamp, page } = req.body;
  if (!name && !email) return res.status(400).json({ error: 'name or email required' });

  const leads = readJSON(LEADS_FILE);
  // Update existing lead if same email, otherwise append
  const idx = email ? leads.findIndex(l => l.email === email) : -1;
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], name: name || leads[idx].name, email, timestamp, page };
    console.log(`[leads] Updated lead: ${name || ''} <${email}>`);
  } else {
    leads.push({ name, email, timestamp, page });
    console.log(`[leads] New lead: ${name || ''} <${email || 'no email yet'}>`);
  }
  writeJSON(LEADS_FILE, leads);
  res.json({ ok: true });
});

// ── GET /leads ───────────────────────────────────────────────────────────
app.get('/leads', (_req, res) => {
  res.json(readJSON(LEADS_FILE));
});

// ── POST /questions ──────────────────────────────────────────────────────────
app.post('/questions', (req, res) => {
  const { question, name, email, timestamp, page } = req.body;
  if (!question) return res.status(400).json({ error: 'question required' });

  const questions = readJSON(QUESTIONS_FILE);
  questions.push({ question, name, email, timestamp, page });
  writeJSON(QUESTIONS_FILE, questions);
  console.log(`[questions] Captured from ${name || 'Unknown'}: "${question}"`);
  res.json({ ok: true });
});

// ── GET /questions ──────────────────────────────────────────────────────────
app.get('/questions', (_req, res) => {
  res.json(readJSON(QUESTIONS_FILE));
});

app.listen(PORT, () => {
  console.log(`\n🏨  GoldInn Gemini Proxy running → http://localhost:${PORT}`);
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.warn('⚠️   WARNING: API key is still the placeholder!');
    console.warn('    Get your free key at https://aistudio.google.com/apikey\n');
  }
});
