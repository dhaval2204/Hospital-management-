"use client";

import Link from "next/link";
import { Activity, Heart } from "lucide-react";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .hms-footer {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%);
          border-top: 1px solid rgba(99,102,241,0.1);
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 32px 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 36px;
        }
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .footer-logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(99,102,241,0.3);
        }
        .footer-brand-name {
          font-size: 17px;
          font-weight: 800;
          color: #1e1b4b;
          letter-spacing: -0.3px;
        }
        .footer-brand-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
          max-width: 220px;
        }
        .footer-col-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #4f46e5;
          margin-bottom: 14px;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .footer-links a, .footer-links span {
          font-size: 13.5px;
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
        }
        .footer-links a:hover { color: #6366f1; }
        .footer-bottom {
          border-top: 1px solid rgba(99,102,241,0.08);
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-copy {
          font-size: 12px;
          color: #9ca3af;
        }
        .footer-credit {
          font-size: 12px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .footer-credit span { color: #ef4444; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <footer className="hms-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-logo">
                <div className="footer-logo-icon">
                  <Activity size={16} color="white" />
                </div>
                <span className="footer-brand-name">MediCore HMS</span>
              </div>
              <p className="footer-brand-desc">
                A modern, intelligent hospital management system to streamline patients, doctors, and appointments.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-links">
                <Link href="/">Dashboard</Link>
                <Link href="/patients">Patients</Link>
                <Link href="/doctors">Doctors</Link>
                <Link href="/appointments">Appointments</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Company</div>
              <div className="footer-links">
                <span>About</span>
                <span>Careers</span>
                <span>Contact</span>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Support</div>
              <div className="footer-links">
                <span>Help Center</span>
                <span>Terms</span>
                <span>Privacy</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">© {new Date().getFullYear()} MediCore HMS. All rights reserved.</div>
            <div className="footer-credit">
              Built with <span>♥</span> by Beyondata
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}