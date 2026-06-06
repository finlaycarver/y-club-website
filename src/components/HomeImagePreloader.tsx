"use client";

import { useEffect, useRef } from "react";

const HOMEPAGE_IMAGE_URLS = [
  "/images/14.webp",
  "/images/mg-7942.webp",
  "/images/club-y-image-5.webp",
  "/images/10.webp",
  "/images/club-y-image-6.webp",
  "/images/img-0961.jpeg",
  "/images/nadine-195.jpg",
  "/images/img-0841.jpeg",
  "/images/tempimage0cgvsr.jpg",
  "/images/tempimagetpo0ye5.webp",
  "/images/img-1907.jpg",
  "/images/13.webp",
  "/images/9.webp",
  "/images/nadine-180.jpg",
  "/images/img-1917.jpg",
  "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp",
  "/images/12.webp",
  "/images/club-y-image-4.webp",
] as const;

type IdleCallback = (
  callback: () => void,
  options?: { timeout?: number }
) => number;

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: IdleCallback;
  cancelIdleCallback?: (handle: number) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

function uniqueUrls(urls: readonly string[]) {
  return Array.from(new Set(urls));
}

export function HomeImagePreloader() {
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;
    if (connection?.saveData) return;

    const urls = uniqueUrls(HOMEPAGE_IMAGE_URLS);
    const win = window as WindowWithIdleCallback;
    let cancelled = false;
    let timeoutId: number | undefined;

    const preloadBatch = (startIndex: number) => {
      if (cancelled) return;

      urls.slice(startIndex, startIndex + 3).forEach((url) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = url;
        imagesRef.current.push(image);
      });

      if (startIndex + 3 < urls.length) {
        timeoutId = window.setTimeout(() => preloadBatch(startIndex + 3), 180);
      }
    };

    const beginPreload = () => preloadBatch(0);
    const idleHandle = win.requestIdleCallback
      ? win.requestIdleCallback(beginPreload, { timeout: 1800 })
      : undefined;

    if (!win.requestIdleCallback) {
      timeoutId = window.setTimeout(beginPreload, 1200);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) win.cancelIdleCallback?.(idleHandle);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
