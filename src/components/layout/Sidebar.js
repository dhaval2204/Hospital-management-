"use client";

import { useState, useEffect } from "react";
import {
  Home, Users, User, Calendar, Stethoscope, Coins, Menu, ChevronRight, Activity
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .hms-sidebar {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(180deg, #0f0c29 0%, #1a1560 50%, #0f0c29 100%);
          width: ${collapsed ? "72px" : "240px"};
          min-height: 100vh;
          padding: 20px 12px;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sidebar-glow {
          position: absolute;
          top: -60px; left: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .sidebar-glow-2 {
          position: absolute;
          bottom: 60px; right: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? "center" : "space-between"};
          margin-bottom: 28px;
          padding: 0 4px;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .sidebar-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(99,102,241,0.4);
        }
        .sidebar-brand-text {
          font-size: 14px;
          font-weight: 700;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          width: ${collapsed ? 0 : "auto"};
          transition: opacity 0.2s, width 0.3s;
        }
        .collapse-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 5px;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
          display: flex;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }
        .nav-section-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 0 8px;
          margin: 16px 0 6px;
          white-space: nowrap;
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px ${collapsed ? "0" : "12px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.55);
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          white-space: nowrap;
        }
        .sidebar-item:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          transform: translateX(2px);
        }
        .sidebar-item.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.25));
          color: white;
          border: 1px solid rgba(99,102,241,0.35);
          box-shadow: 0 4px 15px rgba(99,102,241,0.2);
        }
        .sidebar-item.active .item-icon {
          color: #a5b4fc;
        }
        .item-label {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          width: ${collapsed ? 0 : "auto"};
          transition: opacity 0.2s, width 0.3s;
        }
        .active-indicator {
          position: absolute;
          right: 10px;
          width: 5px; height: 5px;
          background: #6366f1;
          border-radius: 50%;
          display: ${collapsed ? "none" : "block"};
          box-shadow: 0 0 6px rgba(99,102,241,0.8);
        }
        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 12px 4px;
        }
        .sidebar-footer {
          margin-top: auto;
          padding: 12px 4px 0;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .version-tag {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          text-align: center;
          padding: 8px 0 0;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }

@media(max-width:768px){
  .hms-sidebar{
    position:fixed;
    top:0;left:0;
    z-index:200;
    min-height:100dvh;
    transform:translateX(-100%);
    transition:transform 0.3s cubic-bezier(0.4,0,0.2,1),width 0.3s;
    box-shadow:4px 0 24px rgba(0,0,0,0.35);
  }
  .hms-sidebar.mobile-open{
    transform:translateX(0);
  }
  .collapse-btn{display:flex;}
}
@media(min-width:769px){
  .sidebar-mobile-overlay{display:none!important;}
}
      `}</style>

      <div className={`hms-sidebar${mobileOpen ? " mobile-open" : ""}`}>
        <div className="sidebar-glow" />
        {mobileOpen && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setMobileOpen(false)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:-1}}
          />
        )}
        <div className="sidebar-glow-2" />

        <div className="sidebar-top">
          {!collapsed && (
            <div className="sidebar-brand">
              <div className="sidebar-logo-icon">
                <Activity size={16} color="white" />
              </div>
              <span className="sidebar-brand-text">MediCore</span>
            </div>
          )}
          <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(o => !o); }} className="collapse-btn">
            <Menu size={16} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-label">Main</div>}
          <SidebarItem href="/" icon={<Home size={16} />} label="Dashboard" collapsed={collapsed} active={pathname === "/"} />

          {!collapsed && (
            (user.role === "Admin" || user.role === "Receptionist" || user.role === "Doctor") &&
            <div className="nav-section-label">Management</div>
          )}

          {(user.role === "Admin" || user.role === "Receptionist") && (
            <SidebarItem href="/patients" icon={<Users size={16} />} label="Patients" collapsed={collapsed} active={pathname === "/patients"} />
          )}
          {(user.role === "Admin" || user.role === "Doctor") && (
            <SidebarItem href="/doctors" icon={<User size={16} />} label="Doctors" collapsed={collapsed} active={pathname === "/doctors"} />
          )}
          {(user.role === "Admin" || user.role === "Receptionist") && (
            <SidebarItem href="/appointments" icon={<Calendar size={16} />} label="Appointments" collapsed={collapsed} active={pathname === "/appointments"} />
          )}
          {user.role === "Doctor" && (
            <SidebarItem href="/my-appointments" icon={<Stethoscope size={16} />} label="My Appointments" collapsed={collapsed} active={pathname === "/my-appointments"} />
          )}
          {(user.role === "Admin" || user.role === "Receptionist") && (
            <SidebarItem href="/calendar" icon={<Calendar size={16} />} label="Calendar" collapsed={collapsed} active={pathname === "/calendar"} />
          )}

          <div className="sidebar-divider" />
          <SidebarItem href="/billing" icon={<Coins size={16} />} label="Billing" collapsed={collapsed} active={pathname === "/billing"} />
          
        </nav>

        <div className="sidebar-footer">
          <div className="version-tag">MediCore HMS v2.0</div>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ href, icon, label, collapsed, active }) {
  return (
    <Link href={href} className={`sidebar-item ${active ? "active" : ""}`}>
      <span className="item-icon">{icon}</span>
      <span className="item-label">{label}</span>
      {active && <span className="active-indicator" />}
    </Link>
  );
}