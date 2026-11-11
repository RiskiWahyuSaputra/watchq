"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";

export type ImageSequenceHandle = {
  /** Set playback position (0–1). Rendering is batched to the next animation frame. */
  setProgress: (progress: number) => void;
};

type ImageSequenceProps = {
  frameCount: number;
  desktopPath: string;
  mobilePath: string;
  prefix: string;
  extension: string;
  pad: number;
  fallbackSrc: string;
  fallbackAlt: string;
  /** Initial position before any scroll input (0–1). */
  initialProgress?: number;
  /** Focal point for cover-cropping (0–1). */
  focusX?: number;
  focusY?: number;
  className?: string;
  onReady?: () => void;
};

const EAGER_FRAMES = 10;
const EAGER_CONCURRENCY = 6;
const LAZY_CONCURRENCY = 3;
const BACKGROUND = "#080808";
/** Crossfade resolution between neighbouring frames. */
const BLEND_STEPS = 12;
const MAX_BACKING_DESKTOP = 1600;
const MAX_BACKING_MOBILE = 900;
/** On portrait screens the frame is drawn this many viewport-widths wide. */
const PORTRAIT_WIDTH_RATIO = 1.55;
const PORTRAIT_FOCUS_Y = 0.4;
/** The film opens with the watch right of centre; bias portrait crops slightly right. */
const PORTRAIT_FOCUS_X = 0.6;

/** Load order: the opening frames first, then a coarse pass, then the gaps. */
function loadOrder(count: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  for (let i = 0; i < Math.min(EAGER_FRAMES, count); i++) push(i);
  for (let i = 0; i < count; i += 6) push(i);
  push(count - 1);
  for (let i = 0; i < count; i += 3) push(i);
  for (let i = 0; i < count; i++) push(i);
  return order;
}

const ImageSequence = forwardRef<ImageSequenceHandle, ImageSequenceProps>(function ImageSequence(
  {
    frameCount,
    desktopPath,
    mobilePath,
    prefix,
    extension,
    pad,
    fallbackSrc,
    fallbackAlt,
    initialProgress = 0,
    focusX = 0.5,
    focusY = 0.5,
    className = "",
    onReady,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  /** Fractional frame position, e.g. 12.4 = 60% frame 12 + 40% frame 13. */
  const target = useRef(initialProgress * (frameCount - 1));
  const drawn = useRef(-1);
  const raf = useRef(0);
  const readyFired = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);

  /** Nearest loaded frame to the requested one — prevents blank frames while loading. */
  const nearestLoaded = useCallback((index: number) => {
    const list = frames.current;
    if (list[index]) return index;
    for (let d = 1; d < list.length; d++) {
      if (list[index - d]) return index - d;
      if (list[index + d]) return index + d;
    }
    return -1;
  }, []);

  const draw = useCallback(
    (force = false) => {
      raf.current = 0;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: false });
      if (!canvas || !ctx) return;

      const pos = target.current;
      const i0 = Math.floor(pos);
      const i1 = Math.min(i0 + 1, frameCount - 1);
      // Blend amount, quantised so tiny scroll deltas don't trigger redundant draws.
      let mix = Math.round((pos - i0) * BLEND_STEPS) / BLEND_STEPS;
      let base = frames.current[i0] ? i0 : -1;
      const next = frames.current[i1] ?? null;
      if (base < 0 || !next || i1 === i0) {
        // Missing neighbours (still loading): show the nearest frame without blending.
        base = nearestLoaded(Math.round(pos));
        mix = 0;
      }
      if (base < 0) return;
      const key = base + mix;
      if (!force && key === drawn.current) return;
      const img = frames.current[base]!;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      let scale = Math.max(cw / iw, ch / ih);
      // Portrait screens: a full "cover" crop of a landscape film loses the watch,
      // so cap the zoom and let the frame dissolve into the background instead.
      const portrait = ch > cw * 1.1;
      if (portrait) scale = Math.min(scale, (cw * PORTRAIT_WIDTH_RATIO) / iw);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) * (portrait ? PORTRAIT_FOCUS_X : focusX);
      const dy = (ch - dh) * (portrait ? PORTRAIT_FOCUS_Y : focusY);
      if (dh < ch) {
        ctx.fillStyle = BACKGROUND;
        ctx.fillRect(0, 0, cw, ch);
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(img, dx, dy, dw, dh);
      if (mix > 0 && next) {
        ctx.globalAlpha = mix;
        ctx.drawImage(next, dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }
      if (dh < ch) {
        const fade = dh * 0.32;
        const top = ctx.createLinearGradient(0, dy, 0, dy + fade);
        top.addColorStop(0, BACKGROUND);
        top.addColorStop(0.45, "rgba(8,8,8,0.55)");
        top.addColorStop(1, "rgba(8,8,8,0)");
        ctx.fillStyle = top;
        ctx.fillRect(0, dy - 1, cw, fade + 1);
        const bottom = ctx.createLinearGradient(0, dy + dh - fade, 0, dy + dh);
        bottom.addColorStop(0, "rgba(8,8,8,0)");
        bottom.addColorStop(0.55, "rgba(8,8,8,0.55)");
        bottom.addColorStop(1, BACKGROUND);
        ctx.fillStyle = bottom;
        ctx.fillRect(0, dy + dh - fade, cw, fade + 1);
      }
      drawn.current = key;

      if (!readyFired.current) {
        readyFired.current = true;
        setVisible(true);
        onReadyRef.current?.();
      }
    },
    [focusX, focusY, frameCount, nearestLoaded],
  );

  const schedule = useCallback(
    (force = false) => {
      if (force) drawn.current = -1;
      if (!raf.current) raf.current = requestAnimationFrame(() => draw());
    },
    [draw],
  );

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress: number) {
        const p = Math.min(1, Math.max(0, progress));
        const next = p * (frameCount - 1);
        if (next !== target.current) {
          target.current = next;
          schedule();
        }
      },
    }),
    [frameCount, schedule],
  );

  // Canvas sizing — match the element size × device pixel ratio (capped).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Never render more pixels than the frames contain — upscaling a 1280px
      // frame onto a 2880px backing store costs a lot and adds no detail.
      const maxWidth = rect.width < 768 ? MAX_BACKING_MOBILE : MAX_BACKING_DESKTOP;
      const dpr = Math.min(window.devicePixelRatio || 1, 2, maxWidth / Math.max(1, rect.width));
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "medium";
        }
        schedule(true);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [schedule]);

  // Progressive frame loading.
  useEffect(() => {
    let cancelled = false;
    const base = window.innerWidth < 768 ? mobilePath : desktopPath;
    const src = (i: number) => `${base}/${prefix}${String(i + 1).padStart(pad, "0")}.${extension}`;
    frames.current = new Array(frameCount).fill(null);
    const pending = new Set<HTMLImageElement>();
    let errors = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        pending.add(img);
        const done = (ok: boolean) => {
          pending.delete(img);
          if (cancelled) return resolve();
          if (ok) {
            frames.current[i] = img;
            // Redraw only when this frame is closer to the target than what is on screen.
            const t = target.current;
            if (drawn.current < 0 || Math.abs(i - t) <= 1.5 || Math.abs(i - t) < Math.abs(drawn.current - t)) schedule(true);
          } else if (++errors >= 3 && !frames.current.some(Boolean)) {
            setFailed(true);
          }
          resolve();
        };
        img.onload = () => img.decode().then(() => done(true), () => done(true));
        img.onerror = () => done(false);
        img.src = src(i);
      });

    const runQueue = async (queue: number[], concurrency: number) => {
      const workers = Array.from({ length: concurrency }, async () => {
        while (queue.length && !cancelled) await load(queue.shift()!);
      });
      await Promise.all(workers);
    };

    const order = loadOrder(frameCount);
    // Make sure the frame we start on is requested first.
    const start = target.current;
    const eager = [start, ...order.slice(0, EAGER_FRAMES).filter((i) => i !== start)];
    const lazy = order.filter((i) => !eager.includes(i));

    runQueue(eager, EAGER_CONCURRENCY).then(() => {
      if (cancelled) return;
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
      idle(() => runQueue(lazy, LAZY_CONCURRENCY));
    });

    return () => {
      cancelled = true;
      pending.forEach((img) => {
        img.onload = img.onerror = null;
        img.src = "";
      });
      frames.current = [];
      drawn.current = -1;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [frameCount, desktopPath, mobilePath, prefix, extension, pad, schedule]);

  if (failed) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <Image src={fallbackSrc} alt={fallbackAlt} fill priority sizes="100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={fallbackAlt}
      className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
});

export default ImageSequence;
