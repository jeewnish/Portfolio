# Sloth OS portfolio starter

A modular React + TypeScript desktop-style portfolio shell with a warm sticker-style sloth theme. The sloths are decorative for now; a full animated companion layer can come later.

## Run

```bash
npm install
npm run dev
```

Dependencies used: `react-rnd`, `lucide-react` (install them if your existing project does not already have them).

## Add your assets and details

- Wallpaper is `public/assets/wallpaper.avif` (your `bg.avif`). Swap the file or change the URL in `src/styles/desktop.css`.
- All artwork lives in `public/assets/` (transparent `.webp` cut-outs from `assets.rar`). App icons are set per app in `src/data/apps.ts`.
- Put your CV at `public/cv.pdf`.
- Update placeholder name, bio, social links and CV details in `src/components/windows/WindowContent.tsx`.
- Update project cards in the same file; later, move the project list into a dedicated `src/data/projects.ts` file.
- Update app names and default window dimensions in `src/data/apps.ts`.
- The sloth companion layer can be added to `src/components/desktop/Desktop.tsx` after the window manager is stable.

## Notes

- Desktop shortcuts are opened with a double-click; dock icons open/focus apps with one click.
- Terminal and Arcade are placeholders, not fully implemented applications yet.
- The browser window is a portfolio link launcher, not a general-purpose web browser.
- Replace `yourusername` in social links before publishing.
