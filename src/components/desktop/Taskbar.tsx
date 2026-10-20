import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import type { DesktopWindow, WindowId } from "../../types";
import { apps, assetUrl } from "../../data/apps";
import { getContact } from "../../services/portfolioService";

interface TaskbarProps {
  windows: DesktopWindow[];
  onAppClick: (id: WindowId) => void;
  isMobile?: boolean;
}

export default function Taskbar({
  windows,
  onAppClick,
  isMobile = false
}: TaskbarProps) {
  const [now, setNow] = useState(new Date());
  const contact = getContact();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const githubUrl = contact.github || "https://github.com";

  return (
    <footer className="taskbar" role="navigation" aria-label="Application Dock">
      <div className="dock">
        {apps.map(app => {
          const win = windows.find(w => w.id === app.id);
          const isRunning = win?.isOpen && !win.isMinimized;
          return (
            <button
              key={app.id}
              id={`dock-app-${app.id}`}
              className={`dock-app ${isRunning ? "is-running" : ""}`}
              title={app.label}
              aria-label={`Open ${app.label}${isRunning ? " (Active)" : ""}`}
              onClick={() => onAppClick(app.id)}
            >
              <img src={assetUrl(app.icon)} alt="" draggable={false} />
              {win?.isOpen && (
                <span
                  className="running-dot"
                  title={isRunning ? "Running" : "Minimized"}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="taskbar-right">
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub profile"
          title="Visit GitHub profile"
        >
          <Github size={isMobile ? 18 : 16} />
        </a>
        <span className="clock" aria-label={`Current time: ${now.toLocaleTimeString()}`}>
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <small>
            {now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </small>
        </span>
      </div>
    </footer>
  );
}
