"use client";

import { useSyncExternalStore } from "react";

// The phone line in tokens.css (controls grow to 48px under 720px). A part that changes shape on a phone, not only
// size, reads this; a part that only resizes reads the tokens and needs no JavaScript.
const QUERY = "(max-width: 719px)";

function subscribe(change: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", change);
  return () => mq.removeEventListener("change", change);
}

export function useNarrow(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
