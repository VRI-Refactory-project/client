import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, ShieldCheck, X, Check, Upload } from 'lucide-react';
import './PreSessionLobby.css';

interface LobbyProps {
  onJoin: () => void;
  onCancel: () => void;
}

export const PreSessionLobby = ({ onJoin, onCancel }: LobbyProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'bad' | 'checking'>('checking');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [backgroundEffect, setBackgroundEffect] = useState('none');
  const [customImage, setCustomImage] = useState<string | null>(null);

  // 1. Request Camera
  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Failed to get media devices", err);
      }
    };
    startMedia();
    return () => { stream?.getTracks().forEach(track => track.stop()); };
  }, [stream]);

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
      setBackgroundEffect('custom');
    }
  };

  // 5. THE ACTUAL BLUR PROCESSING LOGIC
  useEffect(() => {
    if (!stream || !videoRef.current || !canvasRef.current) return;

    // If 'none' is selected, show the raw video and hide the canvas
    if (backgroundEffect === 'none') {
      videoRef.current.style.display = 'block';
      canvasRef.current.style.display = 'none';
      return;
    }

    // If blur/custom is selected, hide the raw video and show the canvas
    videoRef.current.style.display = 'none';
    canvasRef.current.style.display = 'block';

    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Note: For a real production app, you would use the @mdaemon/video-effects 
    // library here to process the video stream. For this preview, we use a simple 
    // canvas filter to demonstrate that the blur works.
    
    const drawVideo = () => {
      if (videoElement.paused || videoElement.ended) return;
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      // If 'blur' is selected
      if (backgroundEffect === 'blur') {
        ctx.filter = 'blur(15px)'; // Apply the blur here
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      } 
      // If 'custom' image is selected
      else if (backgroundEffect === 'custom' && customImage) {
        const img = new Image();
        img.src = customImage;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        };
      }
      
      requestAnimationFrame(drawVideo);
    };

    drawVideo();

  }, [stream, backgroundEffect, customImage]);

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
            {/* Real Video Feed (Hidden when effect is applied) */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ display: isVideoOn && backgroundEffect === 'none' ? 'block' : 'none' }}
            />

            {/* Canvas for Blurred Video */}
            <canvas 
              ref={canvasRef} 
              style={{ 
                display: isVideoOn && backgroundEffect !== 'none' ? 'block' : 'none', 
                width: '100%', height: '100%', objectFit: 'cover'
              }} 
            />

            {!isVideoOn && (
              <div style={{ color: 'white', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
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
                <button className={`effect-btn ${backgroundEffect === 'none' ? 'active' : ''}`} onClick={() => setBackgroundEffect('none')}>
                  None {backgroundEffect === 'none' && <Check size={16} />}
                </button>
                <button className={`effect-btn ${backgroundEffect === 'blur' ? 'active' : ''}`} onClick={() => setBackgroundEffect('blur')}>
                  Blur Background {backgroundEffect === 'blur' && <Check size={16} />}
                </button>
                
                {/* Custom Image Upload Option - STYLED */}
                <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#1b1533' }}>Upload Custom Background</p>
                  
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    id="bg-upload" 
                    accept="image/png, image/jpeg" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                  />

                  {/* Custom Styled Button */}
                  <label 
                    htmlFor="bg-upload"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      border: '2px dashed #ddd8ec',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: '#fafafd',
                      color: '#6b6785',
                      fontWeight: 600
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