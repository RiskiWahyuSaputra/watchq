"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

/** next/image with a graceful, clearly labelled placeholder when an asset is missing. */
export default function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={typeof props.alt === "string" ? props.alt : "Image placeholder"}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface text-center text-muted"
      >
        <ImageOff className="h-5 w-5" strokeWidth={1.25} />
        <span className="text-[10px] uppercase tracking-[0.3em]">Image placeholder</span>
        <code className="text-[10px] opacity-70">{String(props.src)}</code>
      </div>
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}
