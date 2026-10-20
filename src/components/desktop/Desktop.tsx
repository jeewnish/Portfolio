import { useReducer, useEffect } from "react";
import type { DesktopWindow, WindowId } from "../../types";
import { apps, assetUrl } from "../../data/apps";
import Taskbar from "./Taskbar";
import WindowFrame from "../windows/WindowFrame";
import { useViewport } from "../../hooks/useViewport";

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
  const { isMobile, isTablet, width: vpWidth, height: vpHeight } = useViewport();

  // Centralized single-click activation logic:
  // - If closed: open and focus
  // - If minimized: restore and focus
  // - If open but behind: bring to foreground and focus
  // - If already visible and focused: keep focused
  const handleAppActivation = (id: WindowId) => {
    const w = windows.find(item => item.id === id);
    if (!w) return;

    if (!w.isOpen || w.isMinimized) {
      dispatch({ type: "OPEN", id });
    } else {
      dispatch({ type: "FOCUS", id });
    }
  };

  const handleOpenProject = (_projectId?: string) => {
    handleAppActivation("projects");
  };

  // Add a class to body when a mobile window is open to dim/hide desktop shortcuts
  const anyOpenOnMobile = isMobile && windows.some(w => w.isOpen && !w.isMinimized);

  useEffect(() => {
    if (anyOpenOnMobile) {
      document.body.classList.add("mobile-app-open");
    } else {
      document.body.classList.remove("mobile-app-open");
    }
    return () => {
      document.body.classList.remove("mobile-app-open");
    };
  }, [anyOpenOnMobile]);

  return (
    <main className="desktop">
      {/* Wallpaper fills full viewport */}
      <div className="wallpaper" />
      <div className="desktop-vignette" />

      {/* Desktop shortcuts with single-click activation & keyboard support */}
      <div className="desktop-shortcuts" role="toolbar" aria-label="Desktop Applications">
        {apps.map(({ id, label, icon }) => (
          <button
            key={id}
            id={`desktop-shortcut-${id}`}
            className="desktop-shortcut"
            onClick={() => handleAppActivation(id)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAppActivation(id);
              }
            }}
            title={`Open ${label}`}
            aria-label={`Open ${label}`}
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
            isMobile={isMobile}
            isTablet={isTablet}
            viewportWidth={vpWidth}
            viewportHeight={vpHeight}
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
      <Taskbar windows={windows} onAppClick={handleAppActivation} isMobile={isMobile} />
    </main>
  );
}

