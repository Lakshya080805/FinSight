import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [view, setView] = useState("dashboard");

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    }
    setToken(newToken);
    setUser(newUser || null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (view === "transactions") {
    return (
      <TransactionsPage
        onLogout={handleLogout}
        user={user}
        onNavigate={setView}
      />
    );
  }

  return (
    <Dashboard onLogout={handleLogout} user={user} onNavigate={setView} />
  );
}

export default App;
