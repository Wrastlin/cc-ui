"use client";

import { useCallback, type ReactNode } from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

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
//
// Focus trap, focus return, Escape, outside press and the page scroll lock come
// from React Aria (ModalOverlay, Modal, Dialog), which handles the iOS cases the
// hand-rolled version did not: a scroll lock that holds on Safari, and the rest
// of the page hidden from a screen reader while the sheet is open.

// Drag to dismiss, the way an iOS sheet does it: the grab bar and the title
// follow the finger down (and resist going up), and letting go past a third of
// the sheet's height, or flicking down fast, slides it off and closes it.
// Anything less springs back. Only the grab and the title (not a button in it)
// start a drag, so the body scroll and every control keep their own gestures.
const FLICK = 0.5; // px per ms, about the speed iOS treats as a throw
const DRAG_FROM = ".ui-sheet-grab, .ui-sheet-title";
const PRESSABLE = "button, a, input, select, textarea, [role=button]";

function dragToClose(sheet: HTMLElement, close: () => void) {
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const down = (e: PointerEvent) => {
    const t = e.target as Element;
    if (e.button !== 0 || !t.closest?.(DRAG_FROM) || t.closest(PRESSABLE)) return;
    const from = e.target as HTMLElement;
    const startY = e.clientY;
    let dy = 0;
    let lastY = startY;
    let lastT = e.timeStamp;
    let v = 0;
    from.setPointerCapture?.(e.pointerId);
    sheet.style.transition = "none";
    const move = (m: PointerEvent) => {
      if (m.pointerId !== e.pointerId) return;
      const raw = m.clientY - startY;
      dy = raw > 0 ? raw : -Math.sqrt(-raw) * 2;
      const dt = m.timeStamp - lastT;
      if (dt > 0) v = (m.clientY - lastY) / dt;
      lastY = m.clientY;
      lastT = m.timeStamp;
      sheet.style.transform = `translateY(${dy}px)`;
    };
    const end = (u: PointerEvent) => {
      if (u.pointerId !== e.pointerId) return;
      from.removeEventListener("pointermove", move);
      from.removeEventListener("pointerup", end);
      from.removeEventListener("pointercancel", end);
      // a finger held still before lifting is not a flick
      if (u.timeStamp - lastT > 100) v = 0;
      const h = sheet.getBoundingClientRect().height;
      const dismiss = u.type === "pointerup" && dy > 0 && (dy > h / 3 || v > FLICK);
      if (dismiss) {
        sheet.style.transition = reduce() ? "none" : "transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15)";
        sheet.style.transform = `translateY(${h + 40}px)`;
        window.setTimeout(close, reduce() ? 0 : 200);
        // a caller that keeps it open gets it back
        window.setTimeout(() => {
          if (sheet.isConnected) {
            sheet.style.transition = "";
            sheet.style.transform = "";
          }
        }, 260);
      } else {
        sheet.style.transition = reduce() ? "none" : "transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1.15)";
        sheet.style.transform = "";
      }
    };
    from.addEventListener("pointermove", move);
    from.addEventListener("pointerup", end);
    from.addEventListener("pointercancel", end);
  };
  sheet.addEventListener("pointerdown", down);
  return () => sheet.removeEventListener("pointerdown", down);
}

// A confirm or prompt from DialogHost sits outside the sheet's DOM; a tap on it
// must not count as a tap outside the sheet.
function dismissesSheet(el: Element) {
  return !el.closest(".dlg-scrim");
}

export default function Sheet({
  open,
  onClose,
  title,
  /** Pinned under the scroll region — actions stay reachable however long the content. */
  footer,
  children,
  labelledBy,
  placement = "bottom",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  labelledBy?: string;
  /** "center" opens mid-screen on a computer; a phone keeps the bottom. */
  placement?: "bottom" | "center";
  /** On the scrim. The sheet renders in a portal, so a caller's styles hang off this, not off a wrapper around it. */
  className?: string;
}) {
  const drag = useCallback(
    (el: HTMLElement | null) => (el ? dragToClose(el, onClose) : undefined),
    [onClose],
  );
  return (
    <ModalOverlay
      className={["ui-sheet-scrim", placement === "center" && "ui-sheet-scrim-center", className]
        .filter(Boolean)
        .join(" ")}
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      isDismissable
      shouldCloseOnInteractOutside={dismissesSheet}
    >
      <Modal className="ui-sheet-modal">
        <Dialog ref={drag} className="ui-sheet" aria-labelledby={labelledBy}>
          <span className="ui-sheet-grab" aria-hidden />
          {title ? (
            <Heading slot="title" level={2} className="ui-sheet-title">
              {title}
            </Heading>
          ) : null}
          {/* the ONLY scroll region in here */}
          <div className="ui-sheet-body">{children}</div>
          {footer ? <div className="ui-sheet-foot">{footer}</div> : null}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
