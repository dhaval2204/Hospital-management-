// app/api/symptom-checker/route.js

import { NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

// ── Load JSON (tries src/app path first, then app, then root) ────────────────
function loadDB() {
  const candidates = [
    path.join(process.cwd(), 'src', 'app', 'api', 'symptom-checker', 'symptom-data.json'),
    path.join(process.cwd(), 'app', 'api', 'symptom-checker', 'symptom-data.json'),
    path.join(process.cwd(), 'symptom-data.json'),
  ];
  for (const p of candidates) {
    try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { /* try next */ }
  }
  return [];
}

const symptomDB = loadDB();

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalise(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Split on commas, +, &, "and", "with"  →  individual symptom phrases
function tokenise(raw) {
  return normalise(raw)
    .split(/[,+&]|\band\b|\bwith\b/)
    .map(t => t.trim())
    .filter(t => t.length >= 2);
}

const STOP_WORDS = new Set([
  'i', 'am', 'have', 'having', 'feel', 'feeling', 'also', 'the',
  'a', 'an', 'is', 'are', 'my', 'me', 'some', 'bit', 'little',
  'bit', 'very', 'so', 'too', 'been', 'since', 'get', 'got',
]);

// Does a user phrase match a disease symptom?
// Strategy: substring match in both directions at the word level.
// "fever"       matches "high fever", "mild fever", "fever"
// "cough"       matches "cough", "night cough", "dry cough"  
// "stomach pain" matches "abdominal pain", "stomach cramps" (shares "pain")
function phraseMatchesSymptom(phrase, symptom) {
  const normP = normalise(phrase);
  const normS = normalise(symptom);

  // Direct substring
  if (normS.includes(normP)) return true;
  if (normP.includes(normS)) return true;

  // Word-level overlap
  const pWords = normP.split(/\s+/).filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  const sWords = normS.split(/\s+/).filter(w => w.length >= 3);

  for (const pw of pWords) {
    for (const sw of sWords) {
      if (sw.includes(pw) || pw.includes(sw)) return true;
    }
  }

  return false;
}

// Score one disease
function scoreDisease(disease, tokens) {
  const matchedSymptoms = [];

  for (const tok of tokens) {
    for (const sym of disease.symptoms) {
      if (phraseMatchesSymptom(tok, sym) && !matchedSymptoms.includes(sym)) {
        matchedSymptoms.push(sym);
        break; // each token can only match once
      }
    }
  }

  if (matchedSymptoms.length === 0) return null;

  const coverage  = matchedSymptoms.length / disease.symptoms.length;
  const precision = matchedSymptoms.length / Math.max(tokens.length, 1);
  const score     = coverage * 0.55 + precision * 0.45;

  return { matchedSymptoms, matchedCount: matchedSymptoms.length, score };
}

const SEV_ORDER   = { critical: 4, high: 3, moderate: 2, mild: 1 };
const GREET_WORDS = new Set(['hi','hello','hey','help','who','what','how','are','you','there','medibot','bot']);

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const raw    = message.trim();
    const tokens = tokenise(raw).filter(t => !STOP_WORDS.has(t));

    if (tokens.length === 0) {
      return NextResponse.json({
        type:    'clarify',
        reply:   "I didn't catch any symptoms. Try describing what you're feeling:\n> *fever, headache, cough*",
        results: [],
      });
    }

    // Greeting?
    if (tokens.every(t => GREET_WORDS.has(normalise(t)))) {
      return NextResponse.json({
        type:    'greeting',
        reply:   "Hi! I'm **MediBot** 🤖, your AI symptom checker.\n\nDescribe your symptoms and I'll suggest possible conditions:\n> *fever, cough, and body aches*\n\n⚠️ This is not a substitute for professional medical advice.",
        results: [],
      });
    }

    // Match all diseases
    const scored = symptomDB
      .map(d => {
        const s = scoreDisease(d, tokens);
        return s ? { ...d, ...s } : null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        Math.abs(b.score - a.score) > 0.005
          ? b.score - a.score
          : (SEV_ORDER[b.severity] || 0) - (SEV_ORDER[a.severity] || 0)
      )
      .slice(0, 4);

    if (scored.length === 0) {
      return NextResponse.json({
        type:    'no_match',
        reply:   `I couldn't find a match for **"${raw}"**.\n\nTry being more specific:\n> *high fever, body aches, chills*\n> *stomach pain, nausea, vomiting*`,
        results: [],
      });
    }

    // UX-friendly score (add offset so even 1-symptom match shows meaningful %)
    const fmtScore = (raw) => Math.min(Math.round(raw * 100) + 30, 95);

    const top   = scored[0];
    const reply = scored.length === 1
      ? `Based on **${tokens.join(', ')}**, the most likely condition is **${top.disease}** (${fmtScore(top.score)}% match).`
      : `Based on **${tokens.join(', ')}**, I found **${scored.length} possible conditions** — ranked by match below.`;

    return NextResponse.json({
      type:    'results',
      reply,
      results: scored.map(d => ({
        disease:         d.disease,
        emoji:           d.emoji,
        severity:        d.severity,
        score:           fmtScore(d.score),
        matchedSymptoms: d.matchedSymptoms,
        description:     d.description,
        advice:          d.advice,
        specialist:      d.specialist,
      })),
      inputSymptoms: tokens,
    });

  } catch (err) {
    console.error('[symptom-checker]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}