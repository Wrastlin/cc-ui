"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button as AriaButton } from "react-aria-components";
import { MessageCircleQuestion, MessageSquareWarning, X } from "lucide-react";
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
 *
 * Since 11/23 it is the Helper (Aaron: "a more responsive debug tool ... so he can interact live while he's working
 * ... always present with us. Like clippy used to be"). Decided: a round button floats in the lower right of every
 * page, over P15's "never floating", because Aaron asked for it always present; the glyph beside the avatar stays.
 * Either opens a panel docked in the corner that leaves the page usable, so the person keeps working while they talk.
 * The first message carries the screen and the trail; each later one is a reply on the same thread (cc-app
 * /api/app/helper, the Report a problem row and its replies, what /issues shows). Answers arrive in the panel every
 * few seconds while it is open, and as a speech bubble by the button when it is closed.
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
      <AriaButton className="cc-report" aria-label="Helper" onPress={() => void start()}>
        <MessageSquareWarning size={18} strokeWidth={1.75} aria-hidden />
      </AriaButton>
      {host && <Helper app={app} endpoint={endpoint} />}
    </>
  );
}

type Message = { mine: boolean; name: string; text: string; at: string };
type Thread = { thread: string | null; status: string; messages: Message[] };

const KEY = "cc-helper-thread";
const SEEN = "cc-helper-seen";

function Helper({ app, endpoint }: { app?: string; endpoint?: string }) {
  const s = useSyncExternalStore(subscribe, () => state, () => closed);
  const origin = endpoint ? new URL(endpoint, location.href).origin : location.origin;
  const [t, setT] = useState<Thread>({ thread: null, status: "open", messages: [] });
  const [unseen, setUnseen] = useState<Message | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const fresh = !t.thread || t.status !== "open";

  const refresh = async () => {
    const id = localStorage.getItem(KEY);
    try {
      const r = await fetch(`${origin}/api/app/helper${id ? `?id=${encodeURIComponent(id)}` : ""}`, { credentials: "include" });
      if (!r.ok) return;
      const j = (await r.json()) as Thread;
      if (j.thread) localStorage.setItem(KEY, j.thread);
      else localStorage.removeItem(KEY);
      setT(j);
      const last = j.messages[j.messages.length - 1];
      if (last && !last.mine && last.at > (localStorage.getItem(SEEN) ?? "")) {
        if (state.open) localStorage.setItem(SEEN, last.at);
        else setUnseen(last);
      }
    } catch {
      /* the next tick tries again */
    }
  };

  useEffect(() => {
    setMounted(true);
    void refresh();
  }, []);
  // While open, every 3 seconds so an answer reads as live; closed, every 20 for the speech bubble.
  useEffect(() => {
    const every = s.open ? 3000 : 20000;
    const h = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, every);
    return () => clearInterval(h);
  }, [s.open]);
  useEffect(() => {
    if (!s.open) return;
    setUnseen(null);
    setError(null);
    const last = t.messages[t.messages.length - 1];
    if (last) localStorage.setItem(SEEN, last.at);
    void refresh();
  }, [s.open, s.at]);
  useEffect(() => {
    list.current?.lastElementChild?.scrollIntoView({ block: "end" });
  }, [t.messages.length, s.open]);

  const close = () => set({ open: false, shot: null });
  const startOver = () => {
    localStorage.removeItem(KEY);
    setT({ thread: null, status: "open", messages: [] });
  };

  async function send() {
    const words = text.trim();
    if (!words) return setError("Write a message.");
    setSending(true);
    setError(null);
    let ok = false;
    try {
      if (!fresh && t.thread) {
        ok = (await fetch(`${origin}/api/app/helper`, { method: "POST", credentials: "include", body: JSON.stringify({ id: t.thread, text: words }) })).ok;
      } else {
        const body = JSON.stringify({
          path: location.pathname,
          search: location.search,
          title: document.title.slice(0, 120),
          app,
          note: words,
          viewport: { w: innerWidth, h: innerHeight },
          trail: trail.filter((x) => x.at <= s.at).map((x) => ({ ago: Math.round((s.at - x.at) / 1000), what: x.what })),
          shot: s.shot,
        });
        const r = await fetch(endpoint ?? origin + "/api/activity/bug", { method: "POST", body, credentials: "include" });
        ok = r.ok;
        const j = (await r.json().catch(() => ({}))) as { id?: string | null };
        if (j.id) localStorage.setItem(KEY, j.id);
      }
    } catch {
      /* the error line below says it */
    }
    setSending(false);
    if (!ok) return setError("Could not send it. Try again.");
    setText("");
    await refresh();
  }

  if (!mounted) return null;
  return createPortal(
    <>
      {!s.open && (
        <div className="cc-helper-float">
          {unseen && (
            <button type="button" className="cc-helper-say" onClick={() => void start()}>
              {unseen.text}
            </button>
          )}
          <AriaButton className="cc-helper-fab" aria-label="Helper" onPress={() => void start()}>
            <MessageCircleQuestion size={24} strokeWidth={2} aria-hidden />
            {unseen && <span className="cc-helper-dot" aria-hidden />}
          </AriaButton>
        </div>
      )}
      {s.open && (
        <section className="cc-helper cc-report-sheet" role="dialog" aria-label="Helper">
          <header className="cc-helper-head">
            <h2>Helper</h2>
            {!fresh && (
              <Button variant="text" onClick={startOver}>
                New
              </Button>
            )}
            <Button variant="text" aria-label="Close" icon={<X size={18} />} onClick={close} />
          </header>
          <div className="cc-helper-body">
            {fresh && s.shot && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cc-report-shot" src={s.shot} alt="Screenshot that goes with it" />
            )}
            {!fresh && (
              <ol className="cc-helper-msgs" ref={list}>
                {t.messages.map((m, k) => (
                  <li key={k} className={m.mine ? "mine" : "theirs"}>
                    {!m.mine && <span className="cc-helper-who">{m.name}</span>}
                    <p>{m.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <footer className="cc-helper-foot">
            <TextArea
              label={fresh ? "What's going on?" : "Reply"}
              value={text}
              onChange={setText}
              rows={2}
              maxLength={2000}
              autoFocus
              error={error}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <Button variant="primary" block onClick={() => void send()} disabled={sending}>
              {sending ? "Sending" : "Send"}
            </Button>
          </footer>
        </section>
      )}
    </>,
    document.body,
  );
}
