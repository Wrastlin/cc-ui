"use client";

import { X } from "lucide-react";
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";

// Says what just changed, then Undo (gap 8). Undo beats a confirm for anything that can be taken back (Apple, Fluent).
// One at a time (Material 3), about 6 s, never holds a needed action (Fluent). It sits under the top bar at every width,
// never at the bottom (Aaron 11/19 "You can't do bottom buttons", 11/20 "fixed at the top"). React Aria's region is a
// landmark, so F6 reaches Undo from the keyboard without the toast taking focus.

type Note = { text: string; undo?: () => void };

const queue = new ToastQueue<Note>({ maxVisibleToasts: 1 });

/** Show what just changed. Pass `undo` to offer Undo; the toast closes itself after about 6 s. */
export function toast(text: string, opts: { undo?: () => void } = {}) {
  queue.clear();
  return queue.add({ text, undo: opts.undo }, { timeout: 6000 });
}

/** Render once near the root of an app, after the top bar. */
export function ToastHost() {
  return (
    <ToastRegion queue={queue} className="ui-toast-region">
      {({ toast: t }) => (
        <AriaToast toast={t} className="ui-toast">
          <ToastContent className="ui-toast-text">
            <Text slot="title">{t.content.text}</Text>
          </ToastContent>
          {t.content.undo ? (
            <AriaButton
              className="ui-toast-undo"
              onPress={() => {
                t.content.undo?.();
                queue.close(t.key);
              }}
            >
              Undo
            </AriaButton>
          ) : null}
          <AriaButton slot="close" className="ui-toast-close" aria-label="Dismiss">
            <X size={18} aria-hidden="true" />
          </AriaButton>
        </AriaToast>
      )}
    </ToastRegion>
  );
}
