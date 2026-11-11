"use client";

type WatchHotspotProps = {
  index: number;
  label: string;
  x: number;
  y: number;
  active: boolean;
  onSelect: () => void;
};

export default function WatchHotspot({ index, label, x, y, active, onSelect }: WatchHotspotProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${String(index + 1).padStart(2, "0")} — ${label}`}
      data-cursor
      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 p-2 focus-visible:outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="relative flex h-7 w-7 items-center justify-center sm:h-9 sm:w-9">
        {!active && <span className="hotspot-pulse absolute inset-0 rounded-full border border-fg/50" />}
        <span
          className={`relative flex h-full w-full items-center justify-center rounded-full border text-[9px] font-medium tracking-[0.05em] backdrop-blur-[2px] transition-all duration-500 sm:text-[10px] ${
            active
              ? "scale-110 border-fg bg-fg text-ink"
              : "border-fg/60 bg-ink/40 text-fg group-hover:border-fg group-hover:bg-ink/70 group-focus-visible:border-fg"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
    </button>
  );
}
