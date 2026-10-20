import { Rnd } from "react-rnd";
import { assetUrl } from "../../data/apps";
import type { DesktopWindow } from "../../types";
import WindowContent from "./WindowContent";

type Props = {
  windowState: DesktopWindow;
  isMobile?: boolean;
  isTablet?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onBoundsChange: (x: number, y: number, width: number, height: number) => void;
  onOpenProject?: (projectId?: string) => void;
};

export default function WindowFrame({
  windowState: w,
  isMobile = false,
  isTablet = false,
  viewportWidth = 1200,
  viewportHeight = 800,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onBoundsChange,
  onOpenProject
}: Props) {
  if (!w.isOpen || w.isMinimized) return null;

  // On mobile: window takes near full screen area (inset at top, down to bottom dock)
  if (isMobile) {
    return (
      <section
        id={`window-${w.id}`}
        className="window-shell is-mobile-window"
        style={{
          position: "fixed",
          top: "calc(var(--safe-top) + 6px)",
          left: 0,
          right: 0,
          bottom: "calc(var(--dock-height) + var(--safe-bottom))",
          zIndex: w.zIndex,
          width: "100%",
          height: "auto",
        }}
        onClick={onFocus}
        role="dialog"
        aria-label={w.title}
      >
        <header className="window-titlebar">
          <button
            type="button"
            className="mobile-back-btn"
            onClick={onClose}
            aria-label={`Close ${w.title} and return to desktop`}
          >
            ← Back
          </button>
          <span className="window-title">{w.title}</span>
          <button
            aria-label="Close window"
            className="control close"
            onClick={onClose}
          >
            <img src={assetUrl("close.webp")} alt="" draggable={false} />
          </button>
        </header>
        <div className="window-body">
          <WindowContent id={w.id} onOpenProject={onOpenProject} />
        </div>
      </section>
    );
  }

  // Tablet or Desktop handling:
  // Ensure default position and size fit nicely within current viewport
  const dockHeight = isTablet ? 70 : 74;
  const maxAvailableWidth = Math.max(320, viewportWidth - 20);
  const maxAvailableHeight = Math.max(220, viewportHeight - dockHeight - 20);

  const effectiveWidth = Math.min(w.width, maxAvailableWidth);
  const effectiveHeight = Math.min(w.height, maxAvailableHeight);

  // Keep window within bounds
  const clampedX = Math.max(10, Math.min(w.x, viewportWidth - effectiveWidth - 10));
  const clampedY = Math.max(10, Math.min(w.y, viewportHeight - dockHeight - effectiveHeight - 10));

  const maximizedStyle = w.isMaximized
    ? {
        position: "absolute" as const,
        inset: `10px 10px ${dockHeight + 10}px 10px`,
        width: "auto",
        height: "auto"
      }
    : {};

  return (
    <Rnd
      bounds="parent"
      dragHandleClassName="window-titlebar"
      cancel="button,a,input,textarea,.terminal-input-container,.project-card,.project-filter-btn,.content-actions"
      position={{
        x: w.isMaximized ? 10 : clampedX,
        y: w.isMaximized ? 10 : clampedY
      }}
      size={
        w.isMaximized
          ? { width: "calc(100% - 20px)", height: `calc(100% - ${dockHeight + 20}px)` }
          : { width: effectiveWidth, height: effectiveHeight }
      }
      minWidth={320}
      minHeight={220}
      disableDragging={w.isMaximized}
      enableResizing={!w.isMaximized}
      style={{ zIndex: w.zIndex, ...maximizedStyle }}
      onDragStart={onFocus}
      onDragStop={(_, d) => onBoundsChange(d.x, d.y, effectiveWidth, effectiveHeight)}
      onResizeStart={onFocus}
      onResizeStop={(_, __, ref, ___, position) =>
        onBoundsChange(position.x, position.y, ref.offsetWidth, ref.offsetHeight)
      }
    >
      <section
        id={`window-${w.id}`}
        className="window-shell"
        onMouseDown={onFocus}
        role="dialog"
        aria-label={w.title}
      >
        <header className="window-titlebar">
          <div className="window-lights">
            <button
              aria-label="Close window"
              className="control close"
              onClick={onClose}
              title="Close"
            >
              <img src={assetUrl("close.webp")} alt="" draggable={false} />
            </button>
            <button
              aria-label="Minimize window"
              className="control minimize"
              onClick={onMinimize}
              title="Minimize"
            >
              <img src={assetUrl("minimize.webp")} alt="" draggable={false} />
            </button>
            <button
              aria-label={w.isMaximized ? "Restore window" : "Maximize window"}
              className="control maximize"
              onClick={onMaximize}
              title={w.isMaximized ? "Restore" : "Maximize"}
            >
              <img src={assetUrl("maximize.webp")} alt="" draggable={false} />
            </button>
          </div>
          <span className="window-title">{w.title}</span>
          <span className="title-spacer" />
        </header>
        <div className="window-body">
          <WindowContent id={w.id} onOpenProject={onOpenProject} />
        </div>
      </section>
    </Rnd>
  );
}
