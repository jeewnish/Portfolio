import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import type { DesktopWindow, WindowId } from "../../types";
import { apps, assetUrl } from "../../data/apps";
import { getContact } from "../../services/portfolioService";

export default function Taskbar({
  windows,
  onAppClick
}: {
  windows: DesktopWindow[];
  onAppClick: (id: WindowId) => void;
}) {
  const [now, setNow] = useState(new Date());
  const contact = getContact();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const githubUrl = contact.github || "https://github.com";

  return (
    <footer className="taskbar">
      <div className="dock">
        {apps.map(app => {
          const win = windows.find(w => w.id === app.id);
          return (
            <button
              key={app.id}
              className={`dock-app ${win?.isOpen && !win.isMinimized ? "is-running" : ""}`}
              title={app.label}
              aria-label={`Open ${app.label}`}
              onClick={() => onAppClick(app.id)}
            >
              <img src={assetUrl(app.icon)} alt="" draggable={false} />
              {win?.isOpen && <span className="running-dot" />}
            </button>
          );
        })}
      </div>
      <div className="taskbar-right">
        <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
          <Github size={16} />
        </a>
        <span className="clock">
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <small>
            {now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </small>
        </span>
      </div>
    </footer>
  );
}
