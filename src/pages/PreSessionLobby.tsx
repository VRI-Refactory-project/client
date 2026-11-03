import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, ShieldCheck, X, Upload } from 'lucide-react';
import './PreSessionLobby.css';

interface LobbyProps {
  onJoin: () => void;
  onCancel: () => void;
}

export const PreSessionLobby = ({ onJoin, onCancel }: LobbyProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'bad' | 'checking'>('checking');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  // 1. Request Camera ONLY ONCE
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startMedia = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(activeStream);
        if (videoRef.current) videoRef.current.srcObject = activeStream;
      } catch (err) {
        console.error("Failed to get media devices", err);
      }
    };
    startMedia();
    return () => { if (activeStream) activeStream.getTracks().forEach(track => track.stop()); };
  }, []); // Empty dependency array

  // 2. Toggles
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => { track.enabled = !isVideoOn; });
      setIsVideoOn(!isVideoOn);
    }
  };
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => { track.enabled = !isMicOn; });
      setIsMicOn(!isMicOn);
    }
  };

  // 3. Connection Quality (Mocked)
  useEffect(() => {
    const timer = setTimeout(() => setConnectionQuality('good'), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 4. Handle Custom Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
    }
  };

  return (
    <div className="lobby-container">
      <header className="lobby-header">
        <h1 style={{ color: '#382c77', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>SignConnect</h1>
        <div className="lobby-user">
          <span>user@example.com</span>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd' }} />
        </div>
      </header>

      <main className="lobby-main">
        <div className="lobby-video-section">
          <div className="lobby-video-wrapper">
            {/* Video is always mounted, we just hide it with CSS */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ visibility: isVideoOn ? 'visible' : 'hidden' }}
            />

            {!isVideoOn && (
              <div style={{ position: 'absolute', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                Camera is off
              </div>
            )}
            
            <div className="lobby-controls">
              <button onClick={toggleAudio} className={`control-btn ${!isMicOn ? 'off' : ''}`}>
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button onClick={toggleVideo} className={`control-btn ${!isVideoOn ? 'off' : ''}`}>
                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <button className="control-btn" onClick={() => setIsSettingsOpen(true)}>
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="lobby-sidebar">
          <h1>Ready to connect?</h1>
          <p className="lobby-subtitle">You're about to join a session with</p>

          <div className="lobby-profile">
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#ddd' }} />
            <div>
              <h3>Micheal</h3>
              <p>Hard of hearing</p>
              <span className="badge-verified"><ShieldCheck size={14}/> Verified Interpreter</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px', fontWeight: 600 }}>
            {connectionQuality === 'checking' && <p style={{ color: '#6b6785' }}>Checking connection...</p>}
            {connectionQuality === 'good' && <p style={{ color: '#10b981' }}>✓ Connection is stable</p>}
          </div>

          <button className="btn-join" onClick={onJoin}>Join Session</button>
          <button className="btn-cancel" onClick={onCancel}><X size={16} /> Cancel</button>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Video Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="close-btn"><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <h3>Background Effects</h3>
              <p className="modal-hint">Choose how you want to appear on the call.</p>
              
              <div className="effect-options">
                {/* Note: These buttons are placeholders for now */}
                <button className="effect-btn active">
                  None
                </button>
                <button className="effect-btn">
                  Blur Background (Coming Soon)
                </button>
                
                <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#1b1533' }}>Upload Custom Background</p>
                  
                  <input 
                    type="file" 
                    id="bg-upload" 
                    accept="image/png, image/jpeg" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                  />

                  <label 
                    htmlFor="bg-upload"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '2px dashed #ddd8ec', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fafafd', color: '#6b6785', fontWeight: 600
                    }}
                  >
                    <Upload size={18} />
                    {customImage ? 'Image uploaded successfully' : 'Choose an image from your device'}
                  </label>

                  {customImage && <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', textAlign: 'center' }}>✓ Custom background ready</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};