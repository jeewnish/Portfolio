import type { WindowId } from "../types";

// EDIT HERE: Change app labels, icons (files in public/assets) and default window sizes.
export const apps: { id: WindowId; label: string; icon: string; width: number; height: number }[] = [
  { id: "about", label: "About Me", icon: "face.webp", width: 520, height: 420 },
  { id: "projects", label: "Projects", icon: "file.webp", width: 650, height: 460 },
  { id: "browser", label: "Browser", icon: "chrome.webp", width: 680, height: 470 },
  { id: "terminal", label: "Terminal", icon: "terminal.webp", width: 660, height: 660 },
  { id: "arcade", label: "Arcade", icon: "gameplay.webp", width: 520, height: 420 },
];

export const assetUrl = (file: string) => `/assets/${file}`;
