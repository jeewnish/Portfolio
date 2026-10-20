import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useViewport() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      // Small debounce to avoid thrashing
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  const breakpoint: Breakpoint = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
}
