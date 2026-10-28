"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import {
  currentDialog,
  resolveDialog,
  subscribeDialogs,
} from "./dialogs";

// Renders whichever dialog lib/dialogs.ts has open. Mounted once at the root,
// so any component can ask a question without a provider in its tree.
//
// Focus trap, focus return, Escape, a tap on the backdrop as a cancel, the page
// scroll lock and the rest of the page hidden from a screen reader come from
// React Aria (ModalOverlay, Modal, Dialog), the same as Sheet. A dialog asked
// from inside an open Sheet stacks on it: Escape and an outside tap close the
// dialog only, never the sheet under it.
export default function DialogHost() {
  const dialog = useSyncExternalStore(
    subscribeDialogs,
    currentDialog,
    () => null,
  );
  const cardRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const id = dialog?.id;
  const kind = dialog?.kind;
  const isDanger = !!dialog?.danger;

  // Read in render, before React Aria moves focus in, so this is the opener.
  if (dialog && !returnFocusRef.current && typeof document !== "undefined") {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  }

  // The prompt field is uncontrolled and keyed by dialog id, so a new question
  // gets a fresh field without this effect having to push state into it.
  useEffect(() => {
    if (id == null) return;
    // React Aria lands on the dialog itself; a prompt wants the field, and a
    // destructive confirm must never land on its own destructive button
    const t = setTimeout(() => {
      if (kind === "prompt") inputRef.current?.select();
      else if (!isDanger) confirmRef.current?.focus();
      else cardRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const close = useCallback((answer: boolean | string | null) => {
    resolveDialog(answer);
    const back = returnFocusRef.current;
    returnFocusRef.current = null;
    // React Aria restores focus itself; this covers an opener its caller
    // re-rendered away, which leaves focus on the body (the same miss Sheet saw)
    window.requestAnimationFrame(() => {
      const a = document.activeElement;
      if (back?.isConnected && (!a || a === document.body)) back.focus();
    });
  }, []);

  const cancelValue = kind === "prompt" ? null : false;

  if (!dialog) return null;

  const confirmLabel =
    dialog.confirmLabel ?? (dialog.kind === "alert" ? "OK" : "Continue");

  return (
    <ModalOverlay
      className="dlg-scrim"
      isOpen
      isDismissable
      onOpenChange={(next) => {
        if (!next) close(cancelValue);
      }}
    >
      <Modal className="dlg-modal">
        <Dialog
          className="dlg"
          role={dialog.kind === "alert" ? "alertdialog" : "dialog"}
          ref={cardRef}
        >
          <Heading slot="title" level={2} className="dlg-title">
            {dialog.title}
          </Heading>
          {dialog.body && <p className="dlg-body">{dialog.body}</p>}

          {dialog.kind === "prompt" && (
            <input
              className="dlg-input"
              key={dialog.id}
              ref={inputRef}
              type="text"
              defaultValue={dialog.defaultValue ?? ""}
              aria-label={dialog.title}
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
                  dialog.kind === "prompt"
                    ? (inputRef.current?.value ?? "")
                    : true,
                )
              }
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
