import { useState } from "react";
import "./Navigateur.css";

interface NavigateurProps {
  onClose: () => void;
}

function Navigateur({ onClose }: NavigateurProps) {
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
        <div className={`navigateur ${isFullScreen ? "fullscreen" : ""}`}>
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
            src="https://www.google.fr/"
            title="Navigateur"
            className="iframe"
          ></iframe>
        </div>
      ) : (
        <div className="minimized" onClick={restoreWindow}>
          🖥 Navigateur
        </div>
      )}
    </>
  );
}

export default Navigateur;
