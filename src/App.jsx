import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./theme.jsx";
import AccessibilityMenu from "./components/AccessibilityMenu.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Overview from "./pages/Overview.jsx";
import CreditHealth from "./pages/CreditHealth.jsx";
import FoundrVault from "./pages/FoundrVault.jsx";
import CohortTracker from "./pages/CohortTracker.jsx";
import Community from "./pages/Community.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider>
      {/* Global accessibility + theme control — available on every screen */}
      <AccessibilityMenu />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<SignUp onSignup={setUser} />} />

        {/* Protected dashboard */}
        <Route
          path="/app"
          element={
            user ? (
              <DashboardLayout user={user} onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Overview user={user} />} />
          <Route path="credit" element={<CreditHealth />} />
          <Route path="vault" element={<FoundrVault />} />
          <Route path="cohorts" element={<CohortTracker />} />
          <Route path="community" element={<Community user={user} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
