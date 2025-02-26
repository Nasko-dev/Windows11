import { useState } from "react";
import "./Krunker.css";

interface KrunkerProps {
  onClose: () => void;
}

function Krunker({ onClose }: KrunkerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const minimizeWindow = () => {
    setIsMinimized(true);
  };

  const restoreWindow = () => {
    setIsMinimized(false);
  };

  return (
    <>
      {!isMinimized ? (
        <div className={`Krunker ${isFullScreen ? "fullscreen" : ""}`}>
          {/* Barre de contrôle */}
          <div className="nav-bar">
            <button
              type="button"
              className="btn minimize"
              onClick={minimizeWindow}
            >
              ➖
            </button>
            <button
              type="button"
              className="btn fullscreen"
              onClick={toggleFullScreen}
            >
              ⛶
            </button>
            <button type="button" className="btn close" onClick={onClose}>
              ❌
            </button>
          </div>

          {/* Contenu de la fenêtre */}
          <iframe
            src="https://krunker.io/"
            title="Krunker"
            className="iframe"
          ></iframe>
        </div>
      ) : (
        <div className="minimized" onClick={restoreWindow}>
          🖥 Krunker
        </div>
      )}
    </>
  );
}

export default Krunker;
