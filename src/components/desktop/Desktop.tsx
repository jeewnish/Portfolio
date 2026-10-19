import { useReducer } from "react";
import type { DesktopWindow, WindowId } from "../../types";
import { apps, assetUrl } from "../../data/apps";
import Taskbar from "./Taskbar";
import WindowFrame from "../windows/WindowFrame";

const initialWindows: DesktopWindow[] = apps.map((app, i) => ({
  id: app.id,
  title: app.label,
  x: 140 + i * 40,
  y: 30 + i * 26,
  width: app.width,
  height: app.height,
  zIndex: i + 1,
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
}));

type Action =
  | { type: "OPEN"; id: WindowId }
  | { type: "CLOSE"; id: WindowId }
  | { type: "MINIMIZE"; id: WindowId }
  | { type: "MAXIMIZE"; id: WindowId }
  | { type: "FOCUS"; id: WindowId }
  | { type: "BOUNDS"; id: WindowId; x: number; y: number; width: number; height: number };

function reducer(state: DesktopWindow[], action: Action): DesktopWindow[] {
  const top = Math.max(0, ...state.map(w => w.zIndex)) + 1;
  switch (action.type) {
    case "OPEN":
      return state.map(w =>
        w.id === action.id ? { ...w, isOpen: true, isMinimized: false, zIndex: top } : w
      );
    case "CLOSE":
      return state.map(w =>
        w.id === action.id
          ? { ...w, isOpen: false, isMinimized: false, isMaximized: false }
          : w
      );
    case "MINIMIZE":
      return state.map(w => (w.id === action.id ? { ...w, isMinimized: true } : w));
    case "MAXIMIZE":
      return state.map(w =>
        w.id === action.id
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              previousBounds: w.isMaximized
                ? undefined
                : { x: w.x, y: w.y, width: w.width, height: w.height },
              ...(w.isMaximized && w.previousBounds ? w.previousBounds : {}),
              zIndex: top
            }
          : w
      );
    case "FOCUS":
      return state.map(w => (w.id === action.id ? { ...w, zIndex: top } : w));
    case "BOUNDS":
      return state.map(w =>
        w.id === action.id
          ? { ...w, x: action.x, y: action.y, width: action.width, height: action.height }
          : w
      );
  }
}

export default function Desktop() {
  const [windows, dispatch] = useReducer(reducer, initialWindows);

  const appClick = (id: WindowId) => {
    const w = windows.find(item => item.id === id);
    if (!w?.isOpen) dispatch({ type: "OPEN", id });
    else if (w.isMinimized) dispatch({ type: "OPEN", id });
    else dispatch({ type: "FOCUS", id });
  };

  const handleOpenProject = (_projectId?: string) => {
    appClick("projects");
  };

  return (
    <main className="desktop">
      {/* Wallpaper fills full viewport */}
      <div className="wallpaper" />
      <div className="desktop-vignette" />

      {/* Desktop shortcuts starting from top-left */}
      <div className="desktop-shortcuts">
        {apps.map(({ id, label, icon }) => (
          <button
            key={id}
            className="desktop-shortcut"
            onDoubleClick={() => appClick(id)}
            onClick={() => dispatch({ type: "FOCUS", id })}
            title={`Double-click to open ${label}`}
          >
            <img className="shortcut-icon" src={assetUrl(icon)} alt="" draggable={false} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Window manager layer */}
      <div className="window-layer">
        {windows.map(w => (
          <WindowFrame
            key={w.id}
            windowState={w}
            onFocus={() => dispatch({ type: "FOCUS", id: w.id })}
            onClose={() => dispatch({ type: "CLOSE", id: w.id })}
            onMinimize={() => dispatch({ type: "MINIMIZE", id: w.id })}
            onMaximize={() => dispatch({ type: "MAXIMIZE", id: w.id })}
            onBoundsChange={(x, y, width, height) =>
              dispatch({ type: "BOUNDS", id: w.id, x, y, width, height })
            }
            onOpenProject={handleOpenProject}
          />
        ))}
      </div>

      {/* Sloth companions */}
      <img className="sloth sloth-hanging" src={assetUrl("hanging_sloth.webp")} alt="" draggable={false} />
      <img className="sloth sloth-reclining" src={assetUrl("reclining_sloth.webp")} alt="" draggable={false} />

      {/* Bottom taskbar dock */}
      <Taskbar windows={windows} onAppClick={appClick} />
    </main>
  );
}
