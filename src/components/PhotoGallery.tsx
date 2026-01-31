"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type GalleryPhoto = {
  src: string;
  alt: string;
};

type Props = {
  photos: GalleryPhoto[];
  className?: string;
  variant?: "strip" | "grid";
  showHint?: boolean;
};

export function PhotoGallery({
  photos,
  className,
  variant = "strip",
  showHint = true,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activePhoto = useMemo(() => {
    if (activeIndex === null) return null;
    return photos[activeIndex] ?? null;
  }, [activeIndex, photos]);

  const count = photos.length;

  function openAt(index: number) {
    if (index < 0 || index >= count) return;
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
  }

  function goNext() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % count);
  }

  function goPrev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + count) % count);
  }

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  return (
    <div className={className}>
      {variant === "grid" ? (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => openAt(idx)}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-black/20 transition hover:border-white/25"
              aria-label={`Open photo ${idx + 1} of ${count}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex w-full min-w-0 gap-3 overflow-x-auto pb-2 pr-2 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory">
          {photos.map((photo, idx) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => openAt(idx)}
              className="group relative h-[172px] w-[128px] flex-none snap-start overflow-hidden rounded-xl border border-white/10 bg-black/20 outline-none ring-0 transition hover:border-white/25 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label={`Open photo ${idx + 1} of ${count}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="128px"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-2 left-2 rounded-md bg-black/45 px-2 py-1 text-[11px] font-medium text-white/90 opacity-0 backdrop-blur transition group-hover:opacity-100">
                {idx + 1}/{count}
              </div>
            </button>
          ))}
        </div>
      )}

      {showHint ? (
        <p className="mt-2 text-xs text-white/55">
          Tap a photo to open. Use ←/→ to flip through.
        </p>
      ) : null}

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm text-white/85">
                {activeIndex! + 1} of {count}
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white/90 transition hover:border-white/25 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="relative h-[72vh] w-full">
                {/* Preload all images */}
                {photos.map((photo, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <Image
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="100vw"
                      className={`object-contain ${isActive ? "opacity-100" : "opacity-0 absolute"}`}
                      priority
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-black/45"
                aria-label="Previous photo"
              >
                <span aria-hidden>←</span>
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-black/45"
                aria-label="Next photo"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
