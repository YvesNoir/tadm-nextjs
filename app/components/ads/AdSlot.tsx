'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot?: string;
  className?: string;
}

export default function AdSlot({ slot, className = '' }: AdSlotProps) {
  useEffect(() => {
    if (!slot || typeof window === 'undefined') {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense puede fallar silenciosamente en desarrollo o sin inventario listo.
    }
  }, [slot]);

  if (!slot) {
    return null;
  }

  return (
    <div className={`my-10 overflow-hidden rounded-[24px] border border-black/8 bg-[#f8f4ef] px-4 py-4 shadow-[0_18px_40px_rgba(49,31,19,0.06)] ${className}`}>
      <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d5b43]">
        Publicidad
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2816862233382229"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
