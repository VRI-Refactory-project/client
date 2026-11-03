import { useState } from "react";
import { GuestJoin } from "./components/GuestJoin";
import { VideoRoom } from "./components/VideoRoom";
import { PreSessionLobby } from "./pages/PreSessionLobby"; // IMPORT THE LOBBY
import "@livekit/components-styles";

export default function App() {
  const [token, setToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  });

  // NEW STATE: To track if we are in the Lobby or ready to join
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);
  const [guestDetails, setGuestDetails] = useState({ roomName: "", participantName: "" });

  // Fetch a token for a new guest session
  const handleFetchToken = async (
    roomName: string,
    participantName: string,
  ) => {
    // INSTEAD OF FETCHING DIRECTLY, WE SAVE THE DETAILS AND OPEN THE LOBBY
    setGuestDetails({ roomName, participantName });
    setIsLobbyOpen(true);
  };

  // This function is called when the user clicks "Join Session" inside the Lobby
  const handleJoinFromLobby = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          roomName: guestDetails.roomName, 
          participantName: guestDetails.participantName 
        }),
      });

      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        setIsLobbyOpen(false);
      } else {
        alert("Token error: " + (data.error || "Failed to fetch token"));
      }
    } catch (err) {
      console.error("Token server error:", err);
      alert("Could not connect to server on http://localhost:3001");
    }
  };

  // 1. If we have a token, show the actual Video Room
  if (token) {
    return <VideoRoom token={token} onLeave={() => setToken(null)} />;
  }

  // 2. If the user clicked "Join" on the GuestJoin page, show the Lobby
  if (isLobbyOpen) {
    return (
      <PreSessionLobby 
        onJoin={handleJoinFromLobby} 
        onCancel={() => setIsLobbyOpen(false)} 
      />
    );
  }

  // 3. Otherwise, show the initial Join Page
  return <GuestJoin onJoin={handleFetchToken} />;
}