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
const mammoth = require('mammoth');
const crypto  = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CONFIG ────────────────────────────────────────────────────────────────────
//  ↓  Get your FREE key at https://aistudio.google.com/apikey  ↓
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

const GEMINI_MODEL    = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
const EMBEDDING_MODEL = 'embedding-001';
const EMBEDDING_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`;

const ALLOWED_ORIGIN  = 'https://ashwinmahendra.github.io';   // ← your production domain

// ── Storage files ─────────────────────────────────────────────────────────────
const LEADS_FILE     = path.join(__dirname, 'leads.json');
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');
const VECTOR_STORE_FILE = path.join(__dirname, 'vector_store.json');

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── RAG System Utilities ──────────────────────────────────────────────────────

let lastEmbeddingError = null;

// Chunk text into smaller segments for better retrieval precision
// Increased chunk size to reduce API calls
function chunkText(text, maxChars = 2000, overlap = 300) {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = currentChunk.slice(-overlap) + '\n\n' + p;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + p;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

// Generate an embedding array from the Gemini API
async function getEmbedding(text) {
  const response = await fetch(EMBEDDING_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] }
    })
  });
  if (!response.ok) {
    const err = await response.text();
    console.error("[RAG] Embedding error:", err);
    lastEmbeddingError = err;
    throw new Error(`Embedding API failed: ${response.status}`);
  }
  const data = await response.json();
  if (!data || !data.embedding || !data.embedding.values) {
    console.error("[RAG] Unexpected embedding response format:", data);
    lastEmbeddingError = "Unexpected embedding format: " + JSON.stringify(data);
    throw new Error(`Embedding API failed: Missing embedding values`);
  }
  return data.embedding.values;
}

// Calculate similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Delay to prevent rate limiting
const delay = ms => new Promise(r => setTimeout(r, ms));

// Build or update the vector store on startup
async function buildOrUpdateVectorStore() {
  const kbDir = path.join(__dirname, 'knowledge');
  if (!fs.existsSync(kbDir)) {
    console.log(`[RAG] Knowledge directory not found at ${kbDir}.`);
    return;
  }

  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.warn('[RAG] API Key is missing. Skipping vector generation.');
    return;
  }

  let store = { files: {}, chunks: [] };
  if (fs.existsSync(VECTOR_STORE_FILE)) {
    try {
      store = JSON.parse(fs.readFileSync(VECTOR_STORE_FILE, 'utf8'));
    } catch (e) {
      console.warn("[RAG] Could not parse existing vector_store.json. Creating new one.");
    }
  }
  if (!store.files) store.files = {};
  if (!store.chunks) store.chunks = [];

  const files = fs.readdirSync(kbDir);
  let changed = false;

  for (const file of files) {
    const filePath = path.join(kbDir, file);
    const stat = fs.statSync(filePath);
    
    if (!file.endsWith('.md') && !file.endsWith('.txt') && !file.endsWith('.docx')) continue;

    const mtime = stat.mtimeMs;
    // Skip if file hasn't been modified
    if (store.files[file] && store.files[file].mtime === mtime) {
      continue;
    }

    console.log(`[RAG] Processing document: ${file}`);
    let content = '';
    if (file.endsWith('.md') || file.endsWith('.txt')) {
      content = fs.readFileSync(filePath, 'utf8');
    } else if (file.endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        content = result.value;
      } catch (err) {
        console.error(`[RAG] Failed to read docx ${file}:`, err);
        continue;
      }
    }

    // Remove old chunks for this file
    store.chunks = store.chunks.filter(c => c.file !== file);

    // Chunk and embed
    const chunks = chunkText(content, 2000, 300);
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        const embedding = await getEmbedding(chunks[i]);
        store.chunks.push({
          file,
          text: chunks[i],
          embedding
        });
        // Delay 1s to respect potential rate limits
        await delay(1000);
      } catch (err) {
        console.error(`[RAG] Failed to embed chunk ${i} in ${file}:`, err);
      }
    }

    store.files[file] = { mtime };
    changed = true;
  }

  // Handle deleted files
  for (const storedFile of Object.keys(store.files)) {
    if (!files.includes(storedFile)) {
      console.log(`[RAG] Removing deleted document: ${storedFile}`);
      store.chunks = store.chunks.filter(c => c.file !== storedFile);
      delete store.files[storedFile];
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(VECTOR_STORE_FILE, JSON.stringify(store));
    console.log(`[RAG] Vector store updated. Total chunks: ${store.chunks.length}`);
  } else {
    console.log(`[RAG] Vector store is up to date. Total chunks: ${store.chunks.length}`);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

app.use(express.json());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin === 'null' ||
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

  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    return res.status(500).json({
      error: 'API key not configured',
      detail: 'Replace YOUR_GEMINI_API_KEY in proxy.js'
    });
  }

  let { systemPrompt, messages, userName, userEmail } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Bad request', detail: 'messages array is required' });
  }

  // 1. RAG Retrieval
  const userMessage = messages[messages.length - 1].content;
  let contextSnippet = "";
  
  try {
    if (fs.existsSync(VECTOR_STORE_FILE)) {
      const storeRaw = fs.readFileSync(VECTOR_STORE_FILE, 'utf8');
      const store = JSON.parse(storeRaw);
      
      if (store.chunks && store.chunks.length > 0) {
        const queryEmbedding = await getEmbedding(userMessage);
        
        if (queryEmbedding && queryEmbedding.length > 0) {
          const scoredChunks = store.chunks.map(chunk => ({
            text: chunk.text,
            file: chunk.file,
            score: cosineSimilarity(queryEmbedding, chunk.embedding)
          }));
          
          // Sort highest similarity first
          scoredChunks.sort((a, b) => b.score - a.score);
          
          // Take top 4 relevant chunks
          const topChunks = scoredChunks.slice(0, 4);
          contextSnippet = topChunks.map(c => `[Snippet from ${c.file}]:\n${c.text}`).join("\n\n---\n\n");
        }
      }
    }
  } catch (e) {
    console.error("[RAG] Search error during /chat:", e);
  }

  // 2. Build precision system prompt
  let fullSystemPrompt = '';
  
  if (userName || userEmail) {
    fullSystemPrompt += `Current User Details:\nName: ${userName || 'Unknown'}\nEmail: ${userEmail || 'Unknown'}\n\n`;
  }
  
  if (systemPrompt) {
    fullSystemPrompt += `${systemPrompt}\n\n`;
  }
  
  fullSystemPrompt += `=== RELEVANT KNOWLEDGE BASE SNIPPETS ===\n${contextSnippet || '(No specific documents matched)'}\n========================================\n\n`;
  fullSystemPrompt += `CRITICAL INSTRUCTIONS:\nYou are a highly accurate, professional assistant. You MUST use the provided knowledge base snippets to answer the user's question directly. Provide precise, accurate answers. If the answer is not contained within the provided snippets, politely state that you do not have that exact information rather than making up an answer. Keep your tone helpful and reassuring.`;

  // 3. Map to Gemini format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const geminiBody = {
    system_instruction: { parts: [{ text: fullSystemPrompt }] },
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.2, // Lower temperature for more factual, less creative responses
    }
  };

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
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return res.status(502).json({
        error: 'Empty response from Gemini',
        detail: JSON.stringify(data)
      });
    }

    // Log token usage
    const usage = data.usageMetadata || {};
    console.log(
      `[${ts}] Success — ` +
      `promptTokens: ${usage.promptTokenCount ?? '?'}, ` +
      `totalTokens: ${usage.totalTokenCount ?? '?'}`
    );

    return res.json({ text: replyText });

  } catch (err) {
    console.error('[proxy] Fetch error:', err.message);
    return res.status(500).json({ error: 'Proxy request failed', detail: err.message });
  }
});

// ── Debug endpoint ────────────────────────────────────────────────────────
app.get('/debug-rag', (req, res) => {
  let count = 0;
  if (fs.existsSync(VECTOR_STORE_FILE)) {
    try {
      const storeRaw = fs.readFileSync(VECTOR_STORE_FILE, 'utf8');
      const store = JSON.parse(storeRaw);
      count = store.chunks ? store.chunks.length : 0;
    } catch (e) {}
  }
  res.json({
    chunksCount: count,
    lastEmbeddingError
  });
});

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', model: GEMINI_MODEL }));

// ── POST /leads ──────────────────────────────────────────────────────────
app.post('/leads', (req, res) => {
  const { name, email, timestamp, page } = req.body;
  if (!name && !email) return res.status(400).json({ error: 'name or email required' });

  const leads = readJSON(LEADS_FILE);
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

// Start Server and Initialize Vector DB
app.listen(PORT, async () => {
  console.log(`\n🏨  GoldInn Gemini Proxy running → http://localhost:${PORT}`);
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.warn('⚠️   WARNING: API key is still the placeholder!');
    console.warn('    Get your free key at https://aistudio.google.com/apikey\n');
  } else {
    console.log(`[RAG] Initializing Vector Store...`);
    // Run asynchronously without blocking startup
    buildOrUpdateVectorStore().catch(console.error);
  }
});
