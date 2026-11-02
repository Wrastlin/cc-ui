"use client";
// Adapted from Untitled UI React (untitleduico/react), MIT: LICENSES/.
// Overlay, focus trap and dismissal are React Aria's Modal and Dialog.

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Heading, Modal as AriaModal, ModalOverlay } from "react-aria-components";
import { cx, focusRing } from "./cx";

export { DialogTrigger as ModalTrigger };

export interface ModalProps {
  title: string;
  children: ReactNode;
  /** The footer: the dialog's one primary last, so it lands on the right on a desk and on top of the stack on a phone. */
  actions?: ReactNode | ((close: () => void) => ReactNode);
  /** Controlled open; leave both out inside a ModalTrigger. */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A tap outside or Escape closes it. Off for a form with unsaved typing. */
  isDismissable?: boolean;
  size?: "md" | "lg";
}

/**
 * A focused task over the screen: centered on a desk, a sheet from the bottom on a phone. For a record a person edits
 * at length, open a page instead (detail is a page).
 */
export function Modal({ title, children, actions, isOpen, onOpenChange, isDismissable = true, size = "md" }: ModalProps) {
  return (
    <ModalOverlay
      data-cc-part
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      className="fixed inset-0 z-50 flex items-end justify-center bg-cc-scrim data-entering:animate-cc-fade-in data-exiting:animate-cc-fade-out desk:items-center desk:p-6"
    >
      <AriaModal
        data-cc-part
        className={cx(
          "flex max-h-[90dvh] w-full flex-col rounded-t-cc-lg bg-cc-bg pb-[env(safe-area-inset-bottom)] text-cc-text shadow-cc-modal outline-none data-entering:animate-cc-sheet-in data-exiting:animate-cc-sheet-out",
          "desk:rounded-cc-lg desk:pb-0 desk:data-entering:animate-cc-in desk:data-exiting:animate-cc-out",
          size === "lg" ? "desk:max-w-3xl" : "desk:max-w-lg",
        )}
      >
        <Dialog className="flex min-h-0 flex-1 flex-col outline-none">
          {({ close }) => (
            <>
              <div className="flex items-start justify-between gap-2 py-2 ps-4 pe-2 desk:ps-6">
                <Heading slot="title" className="m-0 py-2 text-cc-page font-strong text-cc-text">
                  {title}
                </Heading>
                <Button
                  aria-label="Close"
                  onPress={close}
                  className={cx(focusRing, "flex size-12 shrink-0 cursor-default items-center justify-center rounded-cc border-0 bg-transparent text-cc-muted data-hovered:bg-cc-hover data-pressed:bg-cc-selected")}
                >
                  <X aria-hidden size={20} />
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 text-cc-body desk:px-6">{children}</div>
              {actions && (
                <div className="flex flex-col-reverse gap-2 border-t border-solid border-cc-line p-4 desk:flex-row desk:justify-end desk:px-6">
                  {typeof actions === "function" ? actions(close) : actions}
                </div>
              )}
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
}
