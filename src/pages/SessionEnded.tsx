import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Clock, Wallet } from 'lucide-react';
import './SessionEnded.css';

export function SessionEnded() {
  const navigate = useNavigate();

  // In a real app, these would come from your backend or router state
  const duration = "24";
  const amountCharged = "28.80";

  return (
    <div className="se-page">
      {/* Background decorative shapes */}
      <div className="se-bg-shape se-bg-shape-1"></div>
      <div className="se-bg-shape se-bg-shape-2"></div>

      <div className="se-container">
        {/* Back Button */}
        <Link to="/dashboard" className="se-back-btn">
          <ChevronLeft size={20} />
          Back
        </Link>

        {/* Main Card */}
        <div className="se-card">
          
          {/* Checkmark Icon with sparkles */}
          <div className="se-icon-wrapper">
            <span className="se-sparkle se-sparkle-left" />
            <div className="se-check-circle">
              <Check size={40} strokeWidth={3} />
            </div>
            <span className="se-sparkle se-sparkle-right" />
          </div>

          <h1 className="se-title">Session ended</h1>
          <p className="se-subtitle">Your interpreting session has ended successfully.</p>

          {/* Stats Grid */}
          <div className="se-stats-grid">
            {/* Duration Card */}
            <div className="se-stat-box">
              <div className="se-stat-icon">
                <Clock size={20} />
              </div>
              <div className="se-stat-divider"></div>
              <div className="se-stat-text">
                <span className="se-stat-label">Duration</span>
                <span className="se-stat-value">{duration} min</span>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="se-stat-box">
              <div className="se-stat-icon">
                <Wallet size={20} />
              </div>
              <div className="se-stat-divider"></div>
              <div className="se-stat-text">
                <span className="se-stat-label">Wallet charged</span>
                <span className="se-stat-value">${amountCharged}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="se-rate-btn" 
            onClick={() => navigate('/rate-session')}
          >
            Rate your session <ChevronRight size={18} />
          </button>

        </div>
      </div>
    </div>
  );
}