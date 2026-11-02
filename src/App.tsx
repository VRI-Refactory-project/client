import { useState, useEffect } from "react";
import { GuestJoin } from "./components/GuestJoin";
import { VideoRoom } from "./components/VideoRoom";
import "@livekit/components-styles";

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  // Auto-join if token exists in URL (Sprint 4 V2-012 Ad-hoc guest link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  const handleFetchToken = async (
    roomName: string,
    participantName: string,
  ) => {
    try {
      const res = await fetch("http://localhost:3001/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, participantName }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
      } else {
        alert("Token error: " + (data.error || "Failed to fetch token"));
      }
    } catch (err) {
      console.error("Token server error:", err);
      alert("Could not connect to server on http://localhost:3001");
    }
  };

  if (!token) {
    return <GuestJoin onJoin={handleFetchToken} />;
  }

  return <VideoRoom token={token} onLeave={() => setToken(null)} />;
}
