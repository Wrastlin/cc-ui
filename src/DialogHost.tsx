"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  currentDialog,
  resolveDialog,
  subscribeDialogs,
} from "./dialogs";

// Renders whichever dialog lib/dialogs.ts has open. Mounted once at the root,
// so any component can ask a question without a provider in its tree.
//
// A real dialog, not a styled div: it takes focus on open, returns it on close,
// traps Tab inside itself, closes on Escape, and answers as a cancel when you
// tap the backdrop. Those are the four things the native one gave us for free
// and the reason replacing it is worth doing properly.
export default function DialogHost() {
  const dialog = useSyncExternalStore(
    subscribeDialogs,
    currentDialog,
    () => null,
  );
  const cardRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const id = dialog?.id;
  const kind = dialog?.kind;
  const isDanger = !!dialog?.danger;

  // The prompt field is uncontrolled and keyed by dialog id, so a new question
  // gets a fresh field without this effect having to push state into it.
  // Focus is the only thing to synchronize here.
  useEffect(() => {
    if (id == null) return;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    // a prompt wants the field; a destructive confirm must never land on its
    // own destructive button
    const t = setTimeout(() => {
      if (kind === "prompt") inputRef.current?.select();
      else if (!isDanger) confirmRef.current?.focus();
      else cardRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const close = useCallback(
    (answer: boolean | string | null) => {
      resolveDialog(answer);
      const back = returnFocusRef.current;
      returnFocusRef.current = null;
      // hand focus back where it came from, after this render commits
      setTimeout(() => back?.focus?.(), 0);
    },
    [],
  );

  const cancelValue = kind === "prompt" ? null : false;

  useEffect(() => {
    if (id == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(cancelValue);
        return;
      }
      if (e.key !== "Tab") return;
      // keep Tab inside the dialog
      const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === cardRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [id, cancelValue, close]);

  if (!dialog) return null;

  const confirmLabel =
    dialog.confirmLabel ?? (dialog.kind === "alert" ? "OK" : "Continue");

  return (
    <div
      className="dlg-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close(cancelValue);
      }}
    >
      <div
        className="dlg"
        role={dialog.kind === "alert" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={`dlg-title-${dialog.id}`}
        tabIndex={-1}
        ref={cardRef}
      >
        <h2 className="dlg-title" id={`dlg-title-${dialog.id}`}>
          {dialog.title}
        </h2>
        {dialog.body && <p className="dlg-body">{dialog.body}</p>}

        {dialog.kind === "prompt" && (
          <input
            className="dlg-input"
            key={dialog.id}
            ref={inputRef}
            type="text"
            defaultValue={dialog.defaultValue ?? ""}
            placeholder={dialog.placeholder}
            autoComplete="off"
            enterKeyHint="done"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                close(inputRef.current?.value ?? "");
              }
            }}
          />
        )}

        <div className="dlg-actions">
          {dialog.kind !== "alert" && (
            <button
              type="button"
              className="btn ghost"
              onClick={() => close(cancelValue)}
            >
              {dialog.cancelLabel ?? "Cancel"}
            </button>
          )}
          <button
            type="button"
            className={`btn${dialog.danger ? " danger" : ""}`}
            ref={confirmRef}
            onClick={() =>
              close(
                dialog.kind === "prompt" ? (inputRef.current?.value ?? "") : true,
              )
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
