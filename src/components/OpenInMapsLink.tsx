"use client";

import { useMemo } from "react";

type Props = {
  address: string;
  className?: string;
  children: React.ReactNode;
};

function toQuery(address: string) {
  return encodeURIComponent(address);
}

function isApplePlatform(userAgent: string) {
  // iPhone/iPad/iPod or macOS Safari/Chrome (not Android/Windows)
  return /iPad|iPhone|iPod|Macintosh/.test(userAgent);
}

export function OpenInMapsLink({ address, className, children }: Props) {
  const urls = useMemo(() => {
    const q = toQuery(address);
    return {
      apple: `https://maps.apple.com/?q=${q}`,
      google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    };
  }, [address]);

  return (
    <a
      href={urls.google}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={(e) => {
        // Still keep the normal href for no-JS / blocked scenarios.
        try {
          const ua = navigator.userAgent || "";
          const url = isApplePlatform(ua) ? urls.apple : urls.google;
          // Open in a new tab/window to match target=_blank.
          window.open(url, "_blank", "noopener,noreferrer");
          e.preventDefault();
        } catch {
          // Fall back to default browser behavior.
        }
      }}
    >
      {children}
    </a>
  );
}
