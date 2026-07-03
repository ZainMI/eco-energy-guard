"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  title: string;
  imageFit?: "cover" | "contain";
};

export default function BeforeAfterSlider({
  before,
  after,
  title,
  imageFit = "cover",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const imageClass =
    imageFit === "contain" ? "object-contain bg-stone-100" : "object-cover";

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);

    setPosition(percentage);
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[4/3] sm:aspect-[5/3] lg:aspect-[16/9] select-none overflow-hidden bg-stone-100"
      onPointerDown={(event) => {
        setIsDragging(true);
        updatePosition(event.clientX);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (isDragging) updatePosition(event.clientX);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerCancel={() => setIsDragging(false)}
      role="slider"
      aria-label={`${title} before and after comparison`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          setPosition((value) => Math.max(value - 5, 0));
        }

        if (event.key === "ArrowRight") {
          setPosition((value) => Math.min(value + 5, 100));
        }
      }}
    >
      <Image
        src={after}
        alt={`${title} after`}
        fill
        priority={false}
        className={imageClass}
        sizes="(max-width: 768px) 100vw, 1200px"
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={before}
          alt={`${title} before`}
          fill
          priority={false}
          className={imageClass}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>

      <div
        className="absolute inset-y-0 z-20 w-1 -translate-x-1/2 bg-white shadow-[0_0_24px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white text-lg font-bold text-primary shadow-xl transition group-hover:scale-110">
          ↔
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-between p-4">
        <span className="rounded-full bg-zinc-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          Before
        </span>

        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
          After
        </span>
      </div>
    </div>
  );
}
