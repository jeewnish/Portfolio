import { Rnd } from "react-rnd";
import { assetUrl } from "../../data/apps";
import type { DesktopWindow } from "../../types";
import WindowContent from "./WindowContent";

type Props = {
  windowState: DesktopWindow;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onBoundsChange: (x: number, y: number, width: number, height: number) => void;
  onOpenProject?: (projectId?: string) => void;
};

export default function WindowFrame({
  windowState: w,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onBoundsChange,
  onOpenProject
}: Props) {
  if (!w.isOpen || w.isMinimized) return null;

  // Maximize fills the top down to just above the 74px dock with 10px margin
  const maximizedStyle = w.isMaximized
    ? { position: "absolute" as const, inset: "10px 10px 84px 10px", width: "auto", height: "auto" }
    : {};

  return (
    <Rnd
      bounds="parent"
      dragHandleClassName="window-titlebar"
      cancel="button,a,input,textarea,.terminal-input-container,.project-card"
      position={{ x: w.isMaximized ? 10 : w.x, y: w.isMaximized ? 10 : w.y }}
      size={
        w.isMaximized
          ? { width: "calc(100% - 20px)", height: "calc(100% - 94px)" }
          : { width: w.width, height: w.height }
      }
      minWidth={320}
      minHeight={220}
      disableDragging={w.isMaximized}
      enableResizing={!w.isMaximized}
      style={{ zIndex: w.zIndex, ...maximizedStyle }}
      onDragStart={onFocus}
      onDragStop={(_, d) => onBoundsChange(d.x, d.y, w.width, w.height)}
      onResizeStart={onFocus}
      onResizeStop={(_, __, ref, ___, position) =>
        onBoundsChange(position.x, position.y, ref.offsetWidth, ref.offsetHeight)
      }
    >
      <section className="window-shell" onMouseDown={onFocus}>
        <header className="window-titlebar">
          <div className="window-lights">
            <button aria-label="Close window" className="control close" onClick={onClose}>
              <img src={assetUrl("close.webp")} alt="" draggable={false} />
            </button>
            <button aria-label="Minimize window" className="control minimize" onClick={onMinimize}>
              <img src={assetUrl("minimize.webp")} alt="" draggable={false} />
            </button>
            <button
              aria-label={w.isMaximized ? "Restore window" : "Maximize window"}
              className="control maximize"
              onClick={onMaximize}
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
