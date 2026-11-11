"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { Button as AriaButton } from "react-aria-components";
import { MessageSquareWarning } from "lucide-react";
import Sheet from "./Sheet";
import TextArea from "./TextArea";
import Button from "./Button";

/*
 * Report a problem, on every C&C app and page (Aaron, 2026-11-10: "anywhere we go, and on any app and any page ... I
 * click, I can explain an issue, and it's sent to a place where people are able to communicate their issues").
 *
 * The button sits beside the avatar in AccountButton, so every app that draws the account control has it without
 * wiring anything (P15: in the shell, never floating over a canvas). One tap takes the picture of the screen as it is,
 * then opens the sheet; the screenshot, page, app and the trail of the last 40 things that happened go with the words.
 * Speaking is the phone keyboard's microphone.
 *
 * Reports post to the suite's origin (cc-app /api/activity/bug), which every app shares, Bricks and the proxied apps
 * included, so the sign-in cookie goes with them. They are read and answered on /issues.
 *
 * The shell can mount the account control twice (the desk bar and the phone bar, one hidden), so the first button
 * mounted draws the sheet and the rest only open it.
 */

const TRAIL_CAP = 40;
const trail: { at: number; what: string }[] = [];

/** Add a line to what a report says led up to it. WatchActions sends failed requests here. */
export function noteTrail(what: string) {
  trail.push({ at: Date.now(), what: what.slice(0, 120) });
  if (trail.length > TRAIL_CAP) trail.shift();
}

const CONTROL = "a,button,summary,select,label,[role=button],[role=tab],[role=menuitem],[role=option],[role=switch],[role=link]";

function labelOf(el: Element): string {
  const text = el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || el.tagName.toLowerCase();
  return text.replace(/\s+/g, " ").trim().slice(0, 40);
}

let watching = false;
function watch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  let path = location.pathname;
  noteTrail(`open ${path}`);
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as Element | null)?.closest?.(CONTROL);
      if (el && !el.closest(".cc-report-sheet")) noteTrail(`tap ${labelOf(el)} on ${location.pathname}`);
    },
    true,
  );
  window.addEventListener("error", (e) => noteTrail(`error: ${e.message || "error"}`));
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason as { message?: string } | string | undefined;
    noteTrail(`error: ${typeof r === "string" ? r : r?.message || "a promise was rejected"}`);
  });
  setInterval(() => {
    if (location.pathname !== path) noteTrail(`open ${(path = location.pathname)}`);
  }, 1000);
}

type State = { open: boolean; shot: string | null; at: number };
let state: State = { open: false, shot: null, at: 0 };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  for (const l of listeners) l();
};
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const closed: State = { open: false, shot: null, at: 0 };

const OPEN_EVENT = "cc:report-bug";

/** Open Report a problem from anywhere (an account menu item, a keyboard shortcut). */
export function openReport() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

async function capture(): Promise<string | null> {
  // A menu that was just tapped must be gone from the picture.
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  try {
    const { domToJpeg } = await import("modern-screenshot");
    return await domToJpeg(document.documentElement, {
      width: innerWidth,
      height: innerHeight,
      scale: Math.min(devicePixelRatio || 1, 2),
      quality: 0.7,
      style: { transform: `translate(${-scrollX}px, ${-scrollY}px)` },
    });
  } catch {
    return null;
  }
}

let busy = false;
async function start() {
  if (busy || state.open) return;
  busy = true;
  const at = Date.now();
  const shot = await capture();
  busy = false;
  set({ open: true, shot, at });
}

const hosts: string[] = [];

export function ReportButton({ app, endpoint }: { app?: string; endpoint?: string }) {
  const id = useId();
  const [host, setHost] = useState(false);
  useEffect(() => {
    watch();
    hosts.push(id);
    setHost(hosts[0] === id);
    const onOpen = () => {
      if (hosts[0] === id) void start();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      hosts.splice(hosts.indexOf(id), 1);
    };
  }, [id]);

  return (
    <>
      <AriaButton className="cc-report" aria-label="Report a problem" onPress={() => void start()}>
        <MessageSquareWarning size={18} strokeWidth={1.75} aria-hidden />
      </AriaButton>
      {host && <ReportSheet app={app} endpoint={endpoint} />}
    </>
  );
}

function ReportSheet({ app, endpoint }: { app?: string; endpoint?: string }) {
  const s = useSyncExternalStore(subscribe, () => state, () => closed);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (s.open) {
      setNote("");
      setSent(false);
      setError(null);
    }
  }, [s.open, s.at]);

  const close = () => set({ open: false, shot: null });

  async function send() {
    if (!note.trim()) {
      setError("Say what is wrong.");
      return;
    }
    setSending(true);
    setError(null);
    const body = JSON.stringify({
      path: location.pathname,
      search: location.search,
      title: document.title.slice(0, 120),
      app,
      note: note.trim(),
      viewport: { w: innerWidth, h: innerHeight },
      trail: trail.filter((t) => t.at <= s.at).map((t) => ({ ago: Math.round((s.at - t.at) / 1000), what: t.what })),
      shot: s.shot,
    });
    let ok = false;
    try {
      ok = (await fetch(endpoint ?? location.origin + "/api/activity/bug", { method: "POST", body, credentials: "include" })).ok;
    } catch {
      /* the error line below says it */
    }
    setSending(false);
    if (ok) setSent(true);
    else setError("Could not send it. Try again.");
  }

  return (
    <Sheet
      open={s.open}
      onClose={close}
      title={sent ? "Sent" : "Report a problem"}
      className="cc-report-sheet"
      footer={
        sent ? (
          <Button variant="secondary" block onClick={close}>
            Done
          </Button>
        ) : (
          <Button variant="primary" block onClick={() => void send()} disabled={sending}>
            {sending ? "Sending" : "Send"}
          </Button>
        )
      }
    >
      {sent ? (
        <p className="cc-report-sent">
          <a href={`${location.origin}/issues`}>Issues</a>
        </p>
      ) : (
        <div className="cc-report-body">
          <TextArea label="What is wrong?" value={note} onChange={setNote} rows={4} maxLength={600} autoFocus error={error} />
          {s.shot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cc-report-shot" src={s.shot} alt="Screenshot that goes with it" />
          )}
        </div>
      )}
    </Sheet>
  );
}
