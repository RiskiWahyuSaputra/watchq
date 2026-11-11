"use client";

import dynamic from "next/dynamic";
import ScrollRefresher from "./ScrollRefresher";

// Desktop-only enhancement: loaded on the client, after the critical path.
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function ClientChrome() {
  return (
    <>
      <CustomCursor />
      <ScrollRefresher />
    </>
  );
}
