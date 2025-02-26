import { useState, useEffect } from "react";
import "./Acceil.css";
import img1 from "../assets/ne6ukkej06t71.png";
import searchIcon from "../assets/shearch.png";
// import svg1 from "../assets/bureaux.svg"; // Suppression de l'import inutilisé
import svg2 from "../assets/folder.svg";
import img2 from "../assets/edge.png";
import img3 from "../assets/vscode.png";
import img4 from "../assets/Krunker.png";
import Navigateur from "./Navigateur";
import Krunker from "./Krunker";

interface ISelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface AppData {
  name: string;
  url: string;
}

interface IconType {
  id: number;
  name: string;
  x: number;
  y: number;
  icon: string;
}

function Acceil() {
  const [currentTime, setCurrentTime] = useState({ date: "", time: "" });
  // L'état selectedApp peut être soit une chaîne (pour "Navigateur" ou "Krunker"),
  // soit un objet contenant { name, url }, soit null.
  const [selectedApp, setSelectedApp] = useState<string | AppData | null>(null);
  const [selectionBox, setSelectionBox] = useState<ISelectionBox | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const [icons, setIcons] = useState<IconType[]>([
    { id: 1, name: "Dossier", x: 10, y: 50, icon: svg2 },
    { id: 2, name: "Navigateur", x: 10, y: 150, icon: img2 },
    { id: 3, name: "VS Code", x: 10, y: 250, icon: img3 },
    { id: 4, name: "Krunker", x: 10, y: 350, icon: img4 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const date = now.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime({ date, time });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDoubleClick = (name: string) => {
    if (name === "Navigateur" || name === "Krunker") {
      // Ouvre l'application dans une fenêtre interne
      setSelectedApp(name);
    } else {
      let url = "";
      if (name === "VS Code") {
        url = "https://code.visualstudio.com";
      } else if (name === "Dossier") {
        url = "https://www.github.com";
      }
      // Ouvre dans un nouvel onglet
      setSelectedApp({ name, url });
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    const icon = icons.find((icon) => icon.id === id);
    if (!icon) return;
    e.dataTransfer.setData("iconId", id.toString());
    e.dataTransfer.setData("offsetX", (e.clientX - icon.x).toString());
    e.dataTransfer.setData("offsetY", (e.clientY - icon.y).toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("iconId"), 10);
    const offsetX = parseInt(e.dataTransfer.getData("offsetX"), 10);
    const offsetY = parseInt(e.dataTransfer.getData("offsetY"), 10);

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    setIcons((prev) =>
      prev.map((icon) =>
        icon.id === id
          ? { ...icon, x: Math.max(x, 0), y: Math.max(y, 0) }
          : icon
      )
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setIsSelecting(true);
      const startX = e.clientX;
      const startY = e.clientY;
      setSelectionBox({ startX, startY, endX: startX, endY: startY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isSelecting || !selectionBox) return;
    setSelectionBox({
      ...selectionBox,
      endX: e.clientX,
      endY: e.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionBox(null);
  };

  return (
    <div
      className="desktop"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Barre de navigation */}
      <div className="nav">
        <ul>
          <li>
            <a href="#">
              <img src={img1} alt="Logo" />
            </a>
          </li>
          <li className="search-bar">
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher"
              className="search-input"
            />
          </li>
          {/* Affichage des 3 premières icônes dans la navigation */}
          {icons.slice(0, 3).map((icon) => (
            <li
              key={icon.id}
              className="nav-icon"
              onClick={() => handleDoubleClick(icon.name)}
            >
              <img src={icon.icon} alt={icon.name} />
            </li>
          ))}
        </ul>
        <div className="date-time">
          <div className="time">{currentTime.time}</div>
          <div className="date">{currentTime.date}</div>
        </div>
      </div>

      {/* Icônes du bureau */}
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="desktop-icon"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            position: "absolute",
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, icon.id)}
          onDoubleClick={() => handleDoubleClick(icon.name)}
        >
          {icon.icon && <img src={icon.icon} alt={icon.name} />}
          <p>{icon.name}</p>
        </div>
      ))}

      {/* Rectangle de sélection */}
      {selectionBox && isSelecting && (
        <div
          className="selection-box"
          style={{
            left: `${Math.min(selectionBox.startX, selectionBox.endX)}px`,
            top: `${Math.min(selectionBox.startY, selectionBox.endY)}px`,
            width: `${Math.abs(selectionBox.endX - selectionBox.startX)}px`,
            height: `${Math.abs(selectionBox.endY - selectionBox.startY)}px`,
            backgroundColor: "rgba(0, 0, 255, 0.3)",
            position: "absolute",
            border: "1px solid blue",
          }}
        ></div>
      )}

      {/* Affichage de l'application ouverte */}
      {selectedApp === "Navigateur" && (
        <Navigateur onClose={() => setSelectedApp(null)} />
      )}
      {selectedApp === "Krunker" && (
        <Krunker onClose={() => setSelectedApp(null)} />
      )}
      {/* Si selectedApp est un objet (avec url), redirigez via un lien caché */}
      {selectedApp && typeof selectedApp === "object" && selectedApp.url && (
        <a
          href={selectedApp.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "none" }}
        >
          Open
        </a>
      )}
    </div>
  );
}

export default Acceil;
