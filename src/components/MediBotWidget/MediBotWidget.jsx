'use client';
import { useState, useRef, useEffect } from 'react';

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Floating Button ── */
.mcw-fab-wrap {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.mcw-fab {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #0891b2 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(99,102,241,0.5), 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  position: relative;
  flex-shrink: 0;
}
.mcw-fab:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 10px 32px rgba(99,102,241,0.6), 0 4px 12px rgba(0,0,0,0.2);
}
.mcw-fab:active { transform: scale(0.96); }

/* Pulse ring */
.mcw-fab::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(99,102,241,0.4);
  animation: mcw-ring 2.5s ease-out infinite;
}
.mcw-fab.open::before { display: none; }
@keyframes mcw-ring {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Unread badge */
.mcw-badge {
  position: absolute;
  top: -3px; right: -3px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
  font-family: 'Plus Jakarta Sans', sans-serif;
  animation: mcw-bounce 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes mcw-bounce {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

/* Tooltip */
.mcw-tooltip {
  background: #1e1b4b;
  color: white;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12px; font-weight: 700;
  padding: 7px 14px;
  border-radius: 10px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  animation: mcw-fadein 0.25s ease;
  pointer-events: none;
}
.mcw-tooltip::after {
  content: '';
  position: absolute;
  right: 18px; bottom: -5px;
  width: 10px; height: 10px;
  background: #1e1b4b;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
@keyframes mcw-fadein {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Icon transition */
.mcw-icon-bot  { transition: all 0.2s; font-size: 24px; }
.mcw-icon-x {
  font-size: 22px; color: white; font-weight: 800;
  line-height: 1;
  transition: all 0.2s;
}

/* ── Backdrop ── */
.mcw-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,10,40,0.35);
  backdrop-filter: blur(3px);
  z-index: 9998;
  animation: mcw-fadein 0.2s ease;
}

/* ── Chat Window ── */
.mcw-window {
  position: fixed;
  bottom: 100px;
  right: 28px;
  width: 400px;
  height: 600px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 24px 64px rgba(99,102,241,0.2),
    0 8px 24px rgba(0,0,0,0.12);
  border: 1px solid rgba(99,102,241,0.15);
  animation: mcw-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes mcw-slide-up {
  from { opacity: 0; transform: translateY(40px) scale(0.92); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.mcw-window.closing {
  animation: mcw-slide-down 0.25s ease forwards;
}
@keyframes mcw-slide-down {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(40px) scale(0.92); }
}

/* ── Header ── */
.mcw-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #0891b2 100%);
  padding: 16px 18px;
  display: flex; align-items: center; gap: 11px;
  flex-shrink: 0; position: relative; overflow: hidden;
}
.mcw-header::after {
  content: '';
  position: absolute; top: -30px; right: -30px;
  width: 100px; height: 100px; border-radius: 50%;
  background: rgba(255,255,255,0.07);
  pointer-events: none;
}
.mcw-h-avatar {
  width: 38px; height: 38px; border-radius: 11px;
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 19px; flex-shrink: 0;
}
.mcw-h-name { font-size: 14px; font-weight: 800; color: white; margin-bottom: 1px; font-family: 'Plus Jakarta Sans', sans-serif; }
.mcw-h-sub  { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.72); display: flex; align-items: center; gap: 5px; font-family: 'Plus Jakarta Sans', sans-serif; }
.mcw-h-dot  { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 5px #4ade80; animation: mcw-pulse 2s ease-in-out infinite; }
@keyframes mcw-pulse { 0%,100%{opacity:1}50%{opacity:0.35} }
.mcw-h-actions { margin-left: auto; display: flex; gap: 6px; }
.mcw-h-btn {
  background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22);
  border-radius: 8px; padding: 5px 10px;
  font-size: 11px; font-weight: 700; color: white;
  cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: background 0.18s;
}
.mcw-h-btn:hover { background: rgba(255,255,255,0.26); }

/* ── Quick chips ── */
.mcw-chips {
  padding: 10px 14px 0;
  display: flex; gap: 5px; flex-wrap: wrap;
  flex-shrink: 0;
  background: white;
}
.mcw-chip {
  padding: 4px 11px; border-radius: 100px;
  font-size: 11px; font-weight: 700;
  background: rgba(99,102,241,0.07);
  border: 1px solid rgba(99,102,241,0.18);
  color: #4f46e5; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.18s; white-space: nowrap;
}
.mcw-chip:hover { background: rgba(99,102,241,0.15); transform: translateY(-1px); }

/* ── Messages ── */
.mcw-msgs {
  flex: 1; overflow-y: auto;
  padding: 14px; display: flex; flex-direction: column; gap: 12px;
  scroll-behavior: smooth;
}
.mcw-msgs::-webkit-scrollbar { width: 3px; }
.mcw-msgs::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 99px; }

.mcw-msg { display: flex; gap: 7px; animation: mcw-msg-in 0.28s ease; }
@keyframes mcw-msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.mcw-msg.user { flex-direction: row-reverse; }

.mcw-avatar {
  width: 28px; height: 28px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; margin-top: 2px;
}
.mcw-msg.bot  .mcw-avatar { background: linear-gradient(135deg,#6366f1,#8b5cf6); box-shadow: 0 2px 7px rgba(99,102,241,0.35); }
.mcw-msg.user .mcw-avatar { background: linear-gradient(135deg,#0891b2,#06b6d4); box-shadow: 0 2px 7px rgba(6,182,212,0.35); }

.mcw-bubble {
  max-width: 80%; padding: 10px 13px;
  border-radius: 15px; font-size: 13px;
  font-weight: 500; line-height: 1.55;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.mcw-msg.bot  .mcw-bubble { background:#fafafe; border:1px solid rgba(99,102,241,0.1); border-bottom-left-radius:4px; color:#1e1b4b; }
.mcw-msg.user .mcw-bubble { background:linear-gradient(135deg,#6366f1,#4f46e5); color:white; border-bottom-right-radius:4px; }
.mcw-bubble strong { font-weight: 800; }
.mcw-bubble em     { font-style: italic; color: #6366f1; }
.mcw-msg.user .mcw-bubble em { color: rgba(255,255,255,0.82); }
.mcw-time { font-size: 9.5px; font-weight: 600; color: #9ca3af; margin-top: 3px; }
.mcw-msg.bot  .mcw-time { text-align: left;  padding-left: 3px; }
.mcw-msg.user .mcw-time { text-align: right; }

/* ── Result cards ── */
.mcw-results { margin-top: 8px; display: flex; flex-direction: column; gap: 7px; width: 100%; }
.mcw-card {
  background: white; border: 1px solid rgba(99,102,241,0.12);
  border-radius: 13px; padding: 12px;
  transition: border-color 0.2s;
}
.mcw-card:hover { border-color: rgba(99,102,241,0.28); }
.mcw-card.top   { border-color: rgba(99,102,241,0.28); background: #fafafe; }

.mcw-card-top { display: flex; align-items: center; gap: 9px; margin-bottom: 7px; }
.mcw-card-emoji {
  width: 32px; height: 32px; border-radius: 9px;
  background: rgba(99,102,241,0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.mcw-card-name { font-size: 13px; font-weight: 800; color: #1e1b4b; margin-bottom: 1px; font-family: 'Plus Jakarta Sans', sans-serif; }
.mcw-card-desc { font-size: 11px; color: #6b7280; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif; }
.mcw-sev {
  margin-left: auto; font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 100px; border: 1px solid; white-space: nowrap;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.mcw-bar-row { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #9ca3af; margin-bottom: 3px; font-family: 'Plus Jakarta Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.mcw-bar-pct { color: #4f46e5; }
.mcw-bar { height: 4px; border-radius: 99px; background: rgba(99,102,241,0.1); overflow: hidden; margin-bottom: 7px; }
.mcw-bar-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#8b5cf6); border-radius: 99px; }

.mcw-tags { display: flex; gap: 3px; flex-wrap: wrap; margin-bottom: 7px; }
.mcw-tag {
  font-size: 10px; font-weight: 700; padding: 2px 7px;
  border-radius: 100px;
  background: rgba(99,102,241,0.07); color: #4f46e5;
  border: 1px solid rgba(99,102,241,0.15);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.mcw-advice {
  background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2);
  border-radius: 9px; padding: 8px 10px;
  font-size: 11.5px; font-weight: 500; color: #065f46; line-height: 1.45;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.mcw-advice b { color: #059669; }
.mcw-spec { margin-top: 6px; font-size: 11px; font-weight: 700; color: #6366f1; font-family: 'Plus Jakarta Sans', sans-serif; }

/* ── Typing ── */
.mcw-typing {
  display: flex; gap: 4px; align-items: center;
  padding: 10px 13px;
  background: #fafafe; border: 1px solid rgba(99,102,241,0.1);
  border-radius: 15px; border-bottom-left-radius: 4px;
  width: fit-content;
}
.mcw-td { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; opacity: 0.4; animation: mcw-t 1.2s ease-in-out infinite; }
.mcw-td:nth-child(2){animation-delay:.2s}
.mcw-td:nth-child(3){animation-delay:.4s}
@keyframes mcw-t { 0%,80%,100%{transform:scale(0.8);opacity:0.3}40%{transform:scale(1.2);opacity:1} }

/* ── Disclaimer ── */
.mcw-disc {
  padding: 7px 14px;
  background: rgba(245,158,11,0.05);
  border-top: 1px solid rgba(245,158,11,0.12);
  font-size: 10px; font-weight: 600; color: #92400e;
  text-align: center; flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Input ── */
.mcw-input-row {
  padding: 10px 12px; border-top: 1px solid rgba(99,102,241,0.08);
  display: flex; gap: 7px; align-items: flex-end;
  flex-shrink: 0; background: white;
}
.mcw-input {
  flex: 1; padding: 9px 13px;
  border: 1.5px solid rgba(99,102,241,0.18); border-radius: 11px;
  font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500; color: #1e1b4b; background: #fafafe;
  outline: none; resize: none; max-height: 80px;
  transition: all 0.2s; line-height: 1.4;
}
.mcw-input:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.mcw-input::placeholder { color: #9ca3af; font-weight: 400; }

.mcw-send {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  background: linear-gradient(135deg,#6366f1,#4f46e5);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(99,102,241,0.35);
  transition: all 0.2s;
}
.mcw-send:hover:not(:disabled) { transform: scale(1.08); }
.mcw-send:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
`;

// ── Severity config ───────────────────────────────────────────────────────────
const SEV = {
  critical: { bg:'rgba(239,68,68,0.1)',  color:'#dc2626', border:'rgba(239,68,68,0.3)',  label:'🔴 Critical' },
  high:     { bg:'rgba(245,158,11,0.1)', color:'#d97706', border:'rgba(245,158,11,0.3)', label:'🟠 High' },
  moderate: { bg:'rgba(99,102,241,0.1)', color:'#4f46e5', border:'rgba(99,102,241,0.25)',label:'🔵 Moderate' },
  mild:     { bg:'rgba(16,185,129,0.1)', color:'#059669', border:'rgba(16,185,129,0.25)',label:'🟢 Mild' },
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*)/gm, '<blockquote style="margin:4px 0;padding:4px 10px;border-left:3px solid #6366f1;color:#4f46e5;font-style:italic">$1</blockquote>')
    .replace(/\n/g, '<br/>');
}

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const CHIPS = ['fever + cough', 'headache + nausea', 'stomach pain + vomiting', 'shortness of breath', 'joint pain + rash', 'fatigue + dizziness'];

const WELCOME_MSG = {
  id: 'w', role: 'bot', time: nowTime(),
  text: "Hi! I'm **MediBot** 🤖 — your AI symptom checker.\n\nDescribe your symptoms and I'll suggest possible conditions:\n> *fever, cough and body aches*\n\n⚠️ Not a substitute for professional medical advice.",
};

// ── Result Card ───────────────────────────────────────────────────────────────
function ResultCard({ r, rank }) {
  const sev = SEV[r.severity] || SEV.mild;
  return (
    <div className={`mcw-card${rank === 1 ? ' top' : ''}`}>
      <div className="mcw-card-top">
        <div className="mcw-card-emoji">{r.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="mcw-card-name">{rank === 1 && <span style={{ color:'#6366f1' }}>★ </span>}{r.disease}</div>
          <div className="mcw-card-desc">{r.description}</div>
        </div>
        <span className="mcw-sev" style={{ background: sev.bg, color: sev.color, borderColor: sev.border }}>{sev.label}</span>
      </div>

      <div className="mcw-bar-row">
        <span>Symptom Match</span>
        <span className="mcw-bar-pct">{r.score}%</span>
      </div>
      <div className="mcw-bar">
        <div className="mcw-bar-fill" style={{ width: `${r.score}%` }} />
      </div>

      {r.matchedSymptoms?.length > 0 && (
        <div className="mcw-tags">
          {r.matchedSymptoms.map(s => <span key={s} className="mcw-tag">✓ {s}</span>)}
        </div>
      )}

      <div className="mcw-advice"><b>💡 </b>{r.advice}</div>
      <div className="mcw-spec">👨‍⚕️ See a: {r.specialist}</div>
    </div>
  );
}

// ── Single Message ────────────────────────────────────────────────────────────
function Msg({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`mcw-msg ${isUser ? 'user' : 'bot'}`}>
      <div className="mcw-avatar">{isUser ? '👤' : '🤖'}</div>
      <div style={{ flex: 1, maxWidth: '80%' }}>
        <div className="mcw-bubble" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
        {msg.results?.length > 0 && (
          <div className="mcw-results">
            {msg.results.map((r, i) => <ResultCard key={r.disease} r={r} rank={i + 1} />)}
          </div>
        )}
        <div className="mcw-time">{msg.time}</div>
      </div>
    </div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────
export default function MediBotWidget() {
  const [open, setOpen]         = useState(false);
  const [closing, setClosing]   = useState(false);
  const [showTip, setShowTip]   = useState(true);
  const [unread, setUnread]     = useState(1);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  // Hide tooltip after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const openChat = () => {
    setOpen(true);
    setClosing(false);
    setUnread(0);
    setShowTip(false);
  };

  const closeChat = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 240);
  };

  const toggleChat = () => open ? closeChat() : openChat();

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: msg, time: nowTime() }]);
    setLoading(true);

    try {
      const res  = await fetch('/api/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id:      Date.now() + 1,
        role:    'bot',
        text:    data.reply || 'Sorry, something went wrong.',
        results: data.results || [],
        time:    nowTime(),
      }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: 'Network error. Please try again.', time: nowTime() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clear = () => setMessages([WELCOME_MSG]);

  return (
    <>
      <style>{CSS}</style>

      {/* Backdrop */}
      {open && !closing && <div className="mcw-backdrop" onClick={closeChat} />}

      {/* Chat window */}
      {open && (
        <div className={`mcw-window${closing ? ' closing' : ''}`}>
          {/* Header */}
          <div className="mcw-header">
            <div className="mcw-h-avatar">🤖</div>
            <div>
              <div className="mcw-h-name">MediBot — AI Symptom Checker</div>
              <div className="mcw-h-sub">
                <span className="mcw-h-dot" />
                Online · 20 conditions
              </div>
            </div>
            <div className="mcw-h-actions">
              <button className="mcw-h-btn" onClick={clear}>Clear ↺</button>
              <button className="mcw-h-btn" onClick={closeChat}>✕</button>
            </div>
          </div>

          {/* Chips */}
          <div className="mcw-chips">
            {CHIPS.map(c => (
              <button key={c} className="mcw-chip" onClick={() => send(c)}>{c}</button>
            ))}
          </div>

          {/* Messages */}
          <div className="mcw-msgs">
            {messages.map(m => <Msg key={m.id} msg={m} />)}
            {loading && (
              <div className="mcw-msg bot">
                <div className="mcw-avatar">🤖</div>
                <div className="mcw-typing">
                  <div className="mcw-td" /><div className="mcw-td" /><div className="mcw-td" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Disclaimer */}
          <div className="mcw-disc">⚠️ MediBot is for informational purposes only — not a substitute for professional medical advice.</div>

          {/* Input */}
          <div className="mcw-input-row">
            <textarea
              className="mcw-input"
              placeholder="e.g. fever, cough, headache…"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="mcw-send" onClick={() => send()} disabled={!input.trim() || loading}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB + tooltip */}
      <div className="mcw-fab-wrap">
        {showTip && !open && (
          <div className="mcw-tooltip" style={{ position: 'relative' }}>
            💊 AI Symptom Checker
          </div>
        )}

        <button className={`mcw-fab${open ? ' open' : ''}`} onClick={toggleChat} title="MediBot Symptom Checker">
          {/* Unread badge */}
          {!open && unread > 0 && <span className="mcw-badge">{unread}</span>}

          {/* Icon: robot when closed, X when open */}
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Robot head */}
              <rect x="14" y="20" width="36" height="28" rx="8" fill="white" opacity="0.95"/>
              {/* Eyes */}
              <circle cx="24" cy="32" r="4" fill="#6366f1"/>
              <circle cx="40" cy="32" r="4" fill="#6366f1"/>
              <circle cx="25.5" cy="30.5" r="1.5" fill="white"/>
              <circle cx="41.5" cy="30.5" r="1.5" fill="white"/>
              {/* Mouth */}
              <rect x="22" y="40" width="20" height="3" rx="1.5" fill="#6366f1" opacity="0.7"/>
              {/* Antenna */}
              <line x1="32" y1="20" x2="32" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="32" cy="10" r="3" fill="white"/>
              {/* Ears */}
              <rect x="8" y="28" width="6" height="10" rx="3" fill="white" opacity="0.8"/>
              <rect x="50" y="28" width="6" height="10" rx="3" fill="white" opacity="0.8"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}