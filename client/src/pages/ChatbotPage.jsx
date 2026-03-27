import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Chat from "../components/Chat";

export default function ChatbotPage({ onLogout, user, onNavigate }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // no data dependency yet; keep for future context hooks
    setLoading(false);
  }, []);

  return (
    <div className="layout">
      <Sidebar
        userName={user?.businessName || user?.name}
        onLogout={onLogout}
        activeView="chatbot"
        onNavigate={onNavigate}
      />

      <main className="main">
        <Topbar onLogout={onLogout} userName={user?.name} />

        {loading ? (
          <div style={{ padding: 20 }}>Loading AI assistant...</div>
        ) : (
          <Chat />
        )}
      </main>
    </div>
  );
}
