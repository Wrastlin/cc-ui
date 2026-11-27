"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import InlineMessage from "./InlineMessage";

// Saving in place (gap 3d; Primer saving and degraded experiences, web.dev offline UX). Most of receiving and counting is
// a value typed where it sits, so the line under the field says where that value stands, and nothing shows while all
// is well. A form with a Save button never also saves a field on its own (Primer).

export type SaveStatus = "idle" | "saving" | "saved" | "failed" | "waiting";

/** The line under a value saved in place. "saved" shows for 2 s then goes; a tap control (a switch) passes quiet. */
export function SaveState({ status, onRetry, quiet }: { status: SaveStatus; onRetry?: () => void; quiet?: boolean }) {
  const [showSaved, setShowSaved] = useState(false);
  useEffect(() => {
    if (status !== "saved") return;
    setShowSaved(true);
    const t = window.setTimeout(() => setShowSaved(false), 2000);
    return () => window.clearTimeout(t);
  }, [status]);
  if (status === "saving") return <span className="ui-save-line" role="progressbar" aria-label="Saving" />;
  if (status === "saved") return showSaved && !quiet ? <span className="ui-save-word" role="status">Saved</span> : null;
  if (status === "waiting") return <span className="ui-save-word" role="status">Will send</span>;
  if (status === "failed") {
    return (
      <span className="ui-save-failed" role="alert">
        Not sent.{" "}
        {onRetry ? (
          <button type="button" className="ui-save-retry" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </span>
    );
  }
  return null;
}

function subscribe(change: () => void) {
  window.addEventListener("online", change);
  window.addEventListener("offline", change);
  return () => {
    window.removeEventListener("online", change);
    window.removeEventListener("offline", change);
  };
}

/** The browser's word on the connection. */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
}

/**
 * The page's one line when the connection drops: at the top of the page body, never a blank page. Waits `delayMs` so
 * a short drop never flashes it, counts what is waiting, and says "Sent" for 3 s once the queue empties. Never the
 * word "offline".
 */
export function OfflineLine({
  online,
  waiting,
  noun,
  delayMs = 5000,
}: {
  online: boolean;
  waiting: number;
  noun: { one: string; other: string };
  delayMs?: number;
}) {
  const [shown, setShown] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (online) return;
    const t = window.setTimeout(() => setShown(true), delayMs);
    return () => window.clearTimeout(t);
  }, [online, delayMs]);
  useEffect(() => {
    if (!online || !shown || waiting > 0) return;
    setSent(true);
    const t = window.setTimeout(() => {
      setSent(false);
      setShown(false);
    }, 3000);
    return () => window.clearTimeout(t);
  }, [online, shown, waiting]);
  if (!shown) return null;
  if (sent) return <InlineMessage tone="good">Sent.</InlineMessage>;
  const what = waiting === 1 ? `1 ${noun.one} will send` : `${waiting.toLocaleString("en-US")} ${noun.other} will send`;
  return (
    <InlineMessage tone="warn">
      {online ? `Sending. ${what} in a moment.` : waiting > 0 ? `Not connected. ${what} when you are back.` : "Not connected. What you type here will send when you are back."}
    </InlineMessage>
  );
}
