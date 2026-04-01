"use client";

import Link from "next/link";
import { LogOut, User, Bell, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .hms-header {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.12);
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: box-shadow 0.3s ease;
        }
        .hms-header.scrolled {
          box-shadow: 0 4px 24px rgba(99,102,241,0.10);
        }
        .header-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }
        .logo-text h1 {
          font-size: 15px;
          font-weight: 700;
          color: #1e1b4b;
          line-height: 1;
          letter-spacing: -0.3px;
        }
        .logo-text p {
          font-size: 10px;
          color: #6366f1;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 1px;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pulse-dot {
          width: 8px; height: 8px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          animation: pulse-green 2s infinite;
          margin-right: 2px;
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px;
          padding: 5px 14px 5px 6px;
        }
        .user-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #3730a3;
        }
        .user-role {
          font-size: 10px;
          font-weight: 500;
          color: #6366f1;
          background: rgba(99,102,241,0.12);
          padding: 1px 6px;
          border-radius: 100px;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 100px;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.25);
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.07);
          border-color: rgba(239,68,68,0.45);
          transform: translateY(-1px);
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 100px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          color: #16a34a;
        }
      `}</style>

      <header className={`hms-header ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="header-logo">
          <div className="logo-icon">
            <Activity size={18} color="white" strokeWidth={2.5} />
          </div>
          <div className="logo-text">
            <h1>MediCore HMS</h1>
            <p>Hospital Management</p>
          </div>
        </Link>

        <div className="header-right">
          <div className="live-badge">
            <span className="pulse-dot" />
            Live
          </div>

          {user && (
            <div className="user-chip">
              <div className="user-avatar">
                <User size={13} color="white" />
              </div>
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          )}

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </header>
    </>
  );
}