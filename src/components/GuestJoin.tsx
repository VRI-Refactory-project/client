import React, { useState } from "react";

interface GuestJoinProps {
  onJoin: (roomName: string, participantName: string) => void;
}

export function GuestJoin({ onJoin }: GuestJoinProps) {
  const [roomName, setRoomName] = useState("vri-test-room");
  const [participantName, setParticipantName] = useState("Deaf-User-01");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() && participantName.trim()) {
      onJoin(roomName.trim(), participantName.trim());
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "420px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#1a202c",
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
          }}
        >
          VRI LiveKit Video Call
        </h2>
        <p
          style={{
            color: "#718096",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Enter your room details and identity to join the active session.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#4a5568",
                marginBottom: "0.35rem",
              }}
            >
              Room Name:
            </label>
            <input
              type="text"
              required
              style={{
                width: "100%",
                padding: "0.65rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#4a5568",
                marginBottom: "0.35rem",
              }}
            >
              Participant Identity:
            </label>
            <input
              type="text"
              required
              style={{
                width: "100%",
                padding: "0.65rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e0",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#2b6cb0",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Join Video Call
          </button>
        </form>
      </div>
    </div>
  );
}
