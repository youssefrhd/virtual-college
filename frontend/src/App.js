import Background from "./layout/Background";
import TopNav from "./components/TopNav";

import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import ForgotView from "./views/ForgotView";
import SuccessView from "./views/SuccessView";
import ActivateView from "./views/ActivateView";

import ProfessorDashboard from "./views/ProfessorDashboard";
import StudienfortschrittView from "./views/StudienfortschrittView";
import KurseView from "./views/KurseView";
import PruefungsanmeldungView from "./views/PruefungsanmeldungView";
import { StudentProfile, ProfessorProfile } from "./views/ProfilePage";
import ResetPasswordView from "./views/ResetPasswordView";

import { ROLES } from "./config/roles";
import { useState, useEffect } from "react";
import { useAuth } from "./context/authContext";

function App() {
  const { auth, logout } = useAuth();

  const [role, setRole] = useState("student");
  const [view, setView] = useState("home");
  const [activateEmail, setActivateEmail] = useState("");
  const [appView, setAppView] = useState("dashboard");

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (path === "/reset-password" && token) {
      setView("reset-password");
    }
  }, []);

  const switchRole = (newRole) => {
    setRole(newRole);
    setView("login");
  };

  const enterFromHome = (chosenRole, chosenView) => {
    setRole(chosenRole);
    setView(chosenView);
  };


  if (auth) {
    const isStudent = auth.role?.toUpperCase() === "STUDENT";
    const isProfessor = auth.role?.toUpperCase() === "PROFESSOR";
    const portalRole = isProfessor ? "professor" : "student";

    const user = {
      name: auth.email?.split("@")[0] ?? "Benutzer",
      email: auth.email,
    };

    const handleLogout = () => {
      logout();
      setView("home");
      setAppView("dashboard");
    };

    const handleLogoClick = () => {
      logout();
      setView("home");
      setAppView("dashboard");
    };

    let content = null;

    if (isStudent) {
      if (appView === "progress") {
        content = <StudienfortschrittView user={user} />;
      } else if (appView === "kurse") {
        content = <KurseView user={user} isProfessor={false} />;
      } else if (appView === "anmeldung") {
        content = <PruefungsanmeldungView user={user} onNavigate={setAppView} />;
      } else if (appView === "profile") {
        content = <StudentProfile user={user} onLogout={handleLogout} />;
      } else {
        content = <StudienfortschrittView user={user} />;
      }
    } else {
      if (appView === "kurse") {
        content = <KurseView user={user} isProfessor={true} />;
      } else if (appView === "profile") {
        content = <ProfessorProfile user={user} onLogout={handleLogout} />;
      } else {
        content = <ProfessorDashboard user={user} />;
      }
    }

    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#fff" }}>
        <TopNav
          role={portalRole}
          activeView={appView}
          onNavigate={setAppView}
          user={user}
          onLogoClick={handleLogoClick}
        />
        <div style={{ paddingTop: 0 }}>{content}</div>
      </div>
    );
  }

  

  if (view === "home") {
    return <HomeView onEnter={enterFromHome} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input { caret-color: white; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-30px, 20px) scale(1.05); }
          66% { transform: translate(20px, -15px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: fadeUp 0.35s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Background role={role} />

      <button
        onClick={() => setView("home")}
        style={{
          position: "fixed", top: 20, left: 24, zIndex: 11,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
          padding: "8px 16px", color: "rgba(255,255,255,0.6)",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Zurück
      </button>

      <div style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        display: "flex", gap: 4, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50, padding: "4px 6px",
      }}>
        {["student", "professor"].map((r) => {
          const active = r === role;
          const tk = ROLES[r];
          return (
            <button
              key={r}
              onClick={() => switchRole(r)}
              style={{
                padding: "6px 16px", borderRadius: 50, border: "none", cursor: "pointer",
                background: active ? tk.accent : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "all 0.25s",
                textTransform: "capitalize",
              }}
            >
              {tk.label}
            </button>
          );
        })}
      </div>

      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 20px 40px", position: "relative", zIndex: 1,
      }}>
        <div key={role + view} className="card-enter" style={{ width: "100%", maxWidth: 420 }}>
          {view === "login" && (
            <LoginView
              role={role}
              onSwitch={() => switchRole(ROLES[role].switchRole)}
              onRegister={() => setView("register")}
              onForgot={() => setView("forgot")}
              onSuccess={() => setView("success")}
            />
          )}

          {view === "register" && (
            <RegisterView
              role={role}
              onBack={() => setView("login")}
              onSuccess={(email) => {
                setActivateEmail(email);
                setView("activate");
              }}
            />
          )}

          {view === "activate" && (
            <ActivateView
              role={role}
              email={activateEmail}
              onBack={() => setView("login")}
              onSuccess={() => setView("login")}
            />
          )}

          {view === "forgot" && (
            <ForgotView
              role={role}
              onBack={() => setView("login")}
              onSuccess={() => setView("reset-password")}
            />
          )}

          {view === "success" && (
            <SuccessView role={role} onBack={() => setView("login")} />
          )}

          {view === "reset-password" && (
            <ResetPasswordView
              role={role}
              onBack={() => {
                window.history.replaceState({}, "", "/");
                setView("login");
              }}
            />
          )}
        </div>
      </div>

      <div style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        fontSize: 11, color: "rgba(255,255,255,0.2)", zIndex: 10,
        letterSpacing: "0.06em", whiteSpace: "nowrap",
      }}>
        Virtual College · SWT2
      </div>
    </>
  );
}

export default App;