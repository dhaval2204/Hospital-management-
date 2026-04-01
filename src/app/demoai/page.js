'use client';
import { useState } from 'react';

const SYMPTOM_EXAMPLES = [
  { icon:'🤒', label:'Fever + Cough', query:'I have high fever of 102°F with dry cough for 3 days' },
  { icon:'💊', label:'Medicine Check', query:'What are the side effects of Paracetamol?' },
  { icon:'❤️', label:'Chest Pain', query:'I have mild chest pain when I breathe deeply' },
  { icon:'🤕', label:'Headache', query:'I have severe headache on one side with sensitivity to light' },
  { icon:'😴', label:'Fatigue', query:'I feel extremely tired all the time even after sleeping well' },
  { icon:'🦴', label:'Joint Pain', query:'My knee joints hurt especially in the morning' },
];

export default function AIPage() {
  const [activeExample, setActiveExample] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ai-page { font-family: 'Plus Jakarta Sans', sans-serif; padding: 32px; max-width: 900px; margin: 0 auto; }
        .ai-hero { background: linear-gradient(135deg, #4f46e5, #7c3aed, #0891b2); border-radius: 24px; padding: 40px; color: white; margin-bottom: 32px; position: relative; overflow: hidden; }
        .ai-hero::after { content: '🤖'; position: absolute; right: 40px; top: 50%; transform: translateY(-50%); font-size: 80px; opacity: 0.15; }
        .ai-hero-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        .ai-hero-sub { font-size: 15px; opacity: 0.8; max-width: 480px; line-height: 1.6; }
        .ai-hero-badges { display: flex; gap: 8px; margin-top: 20px; flex-wrap: wrap; }
        .ai-badge { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25); border-radius: 100px; padding: 5px 14px; font-size: 12px; font-weight: 700; }
        .ai-section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .ai-examples { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
        .ai-example { background: white; border: 1.5px solid rgba(99,102,241,0.12); border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .ai-example:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.1); }
        .ai-example-icon { font-size: 28px; margin-bottom: 8px; }
        .ai-example-label { font-size: 13px; font-weight: 700; color: #1e1b4b; margin-bottom: 4px; }
        .ai-example-query { font-size: 11.5px; color: #9ca3af; font-weight: 500; line-height: 1.4; }
        .ai-disclaimer { background: rgba(245,158,11,0.08); border: 1.5px solid rgba(245,158,11,0.2); border-radius: 14px; padding: 16px 20px; display: flex; gap: 12px; }
        .ai-disclaimer-icon { font-size: 20px; flex-shrink: 0; }
        .ai-disclaimer-text { font-size: 13px; color: #92400e; line-height: 1.6; }
        .ai-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
        .ai-stat { background: white; border: 1px solid rgba(99,102,241,0.1); border-radius: 14px; padding: 18px; text-align: center; }
        .ai-stat-val { font-size: 26px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; }
        .ai-stat-lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #9ca3af; margin-top: 3px; }
        .ai-open-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.35); transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ai-open-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.4); }
      `}</style>

      <div className="ai-page">
        {/* Hero */}
        <div className="ai-hero">
          <div className="ai-hero-title">🤖 MediBot — AI Medical Assistant</div>
          <div className="ai-hero-sub">
            Powered by advanced AI to help analyze symptoms, answer medical questions, and guide patients to the right care.
          </div>
          <div className="ai-hero-badges">
            <span className="ai-badge">🧠 Symptom Analysis</span>
            <span className="ai-badge">💊 Medicine Info</span>
            <span className="ai-badge">🚨 Urgency Detection</span>
            <span className="ai-badge">🇮🇳 India-Focused</span>
          </div>
        </div>

        {/* Stats */}
        <div className="ai-stats">
          <div className="ai-stat">
            <div className="ai-stat-val">500+</div>
            <div className="ai-stat-lbl">Conditions Covered</div>
          </div>
          <div className="ai-stat">
            <div className="ai-stat-val">24/7</div>
            <div className="ai-stat-lbl">Always Available</div>
          </div>
          <div className="ai-stat">
            <div className="ai-stat-val">Free</div>
            <div className="ai-stat-lbl">No Extra Cost</div>
          </div>
        </div>

        {/* Example queries */}
        <div className="ai-section-title">
          <span>💡</span> Try these examples
        </div>
        <div className="ai-examples">
          {SYMPTOM_EXAMPLES.map((ex, i) => (
            <div key={i} className="ai-example"
              onClick={() => {
                // Trigger the floating MediBot with the example query
                const event = new CustomEvent('medibot-open', { detail: { query: ex.query } });
                window.dispatchEvent(event);
              }}
            >
              <div className="ai-example-icon">{ex.icon}</div>
              <div className="ai-example-label">{ex.label}</div>
              <div className="ai-example-query">{ex.query}</div>
            </div>
          ))}
        </div>

        {/* Open chatbot CTA */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <button className="ai-open-btn"
            onClick={() => {
              const event = new CustomEvent('medibot-open', { detail: {} });
              window.dispatchEvent(event);
            }}
          >
            🏥 Open MediBot Chat
          </button>
        </div>

        {/* Disclaimer */}
        <div className="ai-disclaimer">
          <div className="ai-disclaimer-icon">⚠️</div>
          <div className="ai-disclaimer-text">
            <strong>Medical Disclaimer:</strong> MediBot provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions. In case of emergency, call <strong>108</strong> immediately.
          </div>
        </div>
      </div>
    </>
  );
}