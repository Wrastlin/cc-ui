"use client";

import type { ReactNode } from "react";
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
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <ModalOverlay
      className="ui-sheet-scrim"
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      isDismissable
      shouldCloseOnInteractOutside={dismissesSheet}
    >
      <Modal className="ui-sheet-modal">
        <Dialog className="ui-sheet" aria-labelledby={labelledBy}>
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
