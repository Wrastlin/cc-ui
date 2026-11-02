"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Disclosure as AriaDisclosure, DisclosurePanel, Heading, type DisclosureProps } from "react-aria-components";
import { cx, focusRingInset, withClass } from "./cx";

/** A part of a page that opens in place: the rarely used fields, the history. Its title says what is inside. */
export function Disclosure({ title, children, ...props }: Omit<DisclosureProps, "children"> & { title: string; children: ReactNode }) {
  return (
    <AriaDisclosure {...props} className={withClass(props.className, "group border-b border-solid border-cc-line")}>
      <Heading className="m-0">
        <Button
          slot="trigger"
          className={cx(
            focusRingInset,
            "flex min-h-14 w-full cursor-default items-center gap-2 border-0 bg-transparent px-4 text-start text-cc-body font-semibold text-cc-text data-hovered:bg-cc-hover data-pressed:bg-cc-selected",
          )}
        >
          <ChevronRight aria-hidden size={20} className="shrink-0 text-cc-muted transition-transform group-data-expanded:rotate-90" />
          {title}
        </Button>
      </Heading>
      <DisclosurePanel className="px-4 text-cc-body text-cc-text">
        <div className="pb-4">{children}</div>
      </DisclosurePanel>
    </AriaDisclosure>
  );
}
