"use client";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this?"
}) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 24, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: overlayIn 0.2s ease forwards;
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 24px;
          padding: 32px 28px 26px;
          width: 100%;
          max-width: 380px;
          border: 1px solid rgba(239,68,68,0.15);
          box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
          animation: cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ef4444, #f97316);
        }
        .modal-icon-wrap {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: rgba(239,68,68,0.1);
          border: 1.5px solid rgba(239,68,68,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          font-size: 24px;
          animation: iconShake 0.5s 0.2s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        @keyframes iconShake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(5deg); }
        }
        .modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e1b4b;
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .modal-message {
          font-size: 13.5px;
          color: #6b7280;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 26px;
          font-weight: 500;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
        }
        .modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          border: none;
        }
        .modal-btn-cancel {
          background: rgba(99,102,241,0.08);
          color: #4f46e5;
          border: 1.5px solid rgba(99,102,241,0.18);
        }
        .modal-btn-cancel:hover {
          background: rgba(99,102,241,0.14);
          transform: translateY(-1px);
        }
        .modal-btn-delete {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 14px rgba(239,68,68,0.35);
        }
        .modal-btn-delete:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(239,68,68,0.45);
        }
        .modal-btn-delete:active { transform: scale(0.98); }
@media(max-width:480px){
  .modal-card{padding:24px 20px 20px;border-radius:18px;margin:0 16px;}
  .modal-title{font-size:16px;}
  .modal-message{font-size:13px;}
  .modal-btn{padding:11px 8px;font-size:13px;}
}

      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon-wrap">🗑️</div>
          <div className="modal-title">{title}</div>
          <div className="modal-message">{message}<br />This action <strong>cannot be undone.</strong></div>
          <div className="modal-actions">
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="modal-btn modal-btn-delete" onClick={onConfirm}>Yes, Delete</button>
          </div>
        </div>
      </div>
    </>
  );
}