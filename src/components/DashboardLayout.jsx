import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Gauge,
  FolderLock,
  Users,
  MessagesSquare,
  Download,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo.jsx";
import { exportProfilePdf } from "./exportPdf.js";

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/credit", label: "Credit Health", icon: Gauge },
  { to: "/app/vault", label: "FoundrVault", icon: FolderLock },
  { to: "/app/cohorts", label: "Partner Portal", icon: Users },
  { to: "/app/community", label: "Community", icon: MessagesSquare },
];

const TITLES = {
  "/app": "Overview",
  "/app/credit": "Credit Health",
  "/app/vault": "FoundrVault — Documents",
  "/app/cohorts": "Partner Portal",
  "/app/community": "Community & Advisory",
};

export default function DashboardLayout({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside className={`dash-sidebar${open ? " open" : ""}`}>
        <div style={styles.sidebarTop}>
          <Logo height={30} />
          <button
            className="dash-close"
            style={styles.iconBtnPlain}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={styles.nav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className="dash-nav-item"
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFoot}>
          <div style={styles.userChip}>
            <div style={styles.avatar}>{user.name.charAt(0)}</div>
            <div style={{ minWidth: 0 }}>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userRole}>
                {user.role === "smme" ? "SMME account" : "Partner account"}
              </div>
            </div>
          </div>
          <button style={styles.logout} onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="dash-scrim" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="dash-main">
        <header style={styles.topbar}>
          <div style={styles.topLeft}>
            <button
              className="dash-menu"
              style={styles.menuBtn}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div style={{ minWidth: 0 }}>
              <p className="eyebrow" style={styles.eyebrow}>
                FoundrX Platform
              </p>
              <h2 style={styles.pageTitle}>{TITLES[loc.pathname] || "Overview"}</h2>
            </div>
          </div>
          <button className="btn btn-primary" onClick={exportProfilePdf}>
            <Download size={16} /> Export data (PDF)
          </button>
        </header>

        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebarTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 8px 18px",
  },
  iconBtnPlain: { border: "none", background: "transparent", color: "var(--muted)" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 14px",
    borderRadius: 12,
    color: "var(--muted)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "background 0.15s, color 0.15s",
  },
  navItemActive: { background: "var(--panel-tint)", color: "var(--violet-deep)" },
  sidebarFoot: { borderTop: "1px solid var(--line)", paddingTop: 14 },
  userChip: { display: "flex", gap: 10, alignItems: "center", padding: "4px 8px 12px" },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "var(--grad-brand)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    flex: "0 0 auto",
  },
  userName: {
    fontWeight: 700,
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: { fontSize: "0.72rem", color: "var(--muted)" },
  logout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "10px",
    borderRadius: 12,
    border: "1px solid var(--line-strong)",
    background: "var(--surface)",
    color: "var(--ink)",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 24px",
    paddingRight: 76,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid var(--line)",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  menuBtn: {
    border: "1px solid var(--line-strong)",
    background: "var(--surface)",
    borderRadius: 10,
    padding: 8,
    color: "var(--violet-deep)",
    placeItems: "center",
  },
  eyebrow: {
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "3px 10px",
    borderRadius: 999,
    background: "var(--panel-tint)",
    border: "1px solid var(--line)",
    letterSpacing: "0.14em",
    fontSize: "0.68rem",
  },
  pageTitle: {
    fontSize: "1.5rem",
    lineHeight: 1.15,
    marginTop: 4,
    background: "var(--grad-brand)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    width: "fit-content",
  },
  content: { padding: "24px", maxWidth: 1180, width: "100%", margin: "0 auto" },
};
