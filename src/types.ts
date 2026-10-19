export type WindowId = "about" | "projects" | "browser" | "terminal" | "arcade";

export interface DesktopWindow {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  previousBounds?: { x: number; y: number; width: number; height: number };
}
