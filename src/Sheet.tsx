"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

// A bottom sheet.
//
// The app has five of these hand-rolled — the pin panel, the review panel, the
// capture review sheet, the gallery bulk bar, the tools launcher — and every
// one of them re-learned the same lessons, mostly the hard way:
//
//   · height in dvh, never vh. On iOS vh is the LARGE viewport, so a sheet
//     pinned to bottom:0 at 82vh is taller than the space it has and the end
//     of its scroll sits under the browser toolbar, unreachable.
//   · ONE scroll region. A list that scrolls inside a sheet that scrolls means
//     a thumb starting on the list never moves the sheet.
//   · the safe-area inset, or the last row sits under the home indicator.
//
// Those live here now. A new sheet gets them by existing.

export default function Sheet({
  open,
  onClose,
  title,
  /** Pinned under the scroll region — actions stay reachable however long the content. */
  footer,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  labelledBy?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const t = setTimeout(() => cardRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      const back = returnFocus.current;
      returnFocus.current = null;
      setTimeout(() => back?.focus?.(), 0);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="ui-sheet-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="ui-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={cardRef}
      >
        <span className="ui-sheet-grab" aria-hidden />
        {title ? <h2 className="ui-sheet-title">{title}</h2> : null}
        {/* the ONLY scroll region in here */}
        <div className="ui-sheet-body">{children}</div>
        {footer ? <div className="ui-sheet-foot">{footer}</div> : null}
      </div>
    </div>
  );
}
