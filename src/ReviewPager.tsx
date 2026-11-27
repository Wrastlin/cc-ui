"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Menu, { type MenuEntry } from "./ActionMenu";
import Button from "./Button";
export { nextOpen } from "./review";

// One item from a pile, in the item's own header (gap 3d; Polaris Page pagination on detail pages, GOV.UK complete
// multiple tasks). Aaron 11/06: "review one item, then the next by clicking next ... go back and forth ... jump around".
// Left to right: back to the list, the position ("7 of 21"), Previous and Next named by noun, then one decision with
// the count still open riding on it, the rest in More. Moved from cc-app's RecordPager (Resolutions issues), plus the
// decision slot, J and K on a keyboard and the position in the page title. Never a swipe as the only way.

export type ReviewDecision = {
  label: string;
  onPress: () => void;
  /** Open items left including this one; shown on the decision ("Approve, 13 left") so there is no separate banner. */
  left?: number;
};

function typing(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || !!el.closest?.("[role=dialog],[role=menu]");
}

export default function ReviewPager({
  back,
  at,
  total,
  noun,
  onPrev,
  onNext,
  decision,
  more,
  docTitle,
}: {
  /** The list this item came from, by its name ("Invoices"). A link or a press. */
  back: { label: string; href: string } | { label: string; onBack: () => void };
  /** 1-based position in the list as filtered. */
  at: number;
  total: number;
  /** The item's noun, singular, for the arrow names ("Next invoice"). */
  noun: string;
  /** null at the first item. */
  onPrev: (() => void) | null;
  /** null at the last item. */
  onNext: (() => void) | null;
  decision?: ReviewDecision;
  more?: readonly MenuEntry[];
  /** The item's name: when given, the page title reads "<name>, 7 of 21" so a screen reader hears where it is. */
  docTitle?: string;
}) {
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      if (e.key === "j" && onNext) onNext();
      else if (e.key === "k" && onPrev) onPrev();
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onNext, onPrev]);

  useEffect(() => {
    if (!docTitle) return;
    const was = document.title;
    document.title = `${docTitle}, ${at} of ${total}`;
    return () => {
      document.title = was;
    };
  }, [docTitle, at, total]);

  const backIcon = <ChevronLeft size={18} aria-hidden />;
  const left = decision?.left;
  return (
    <nav className="ui-pager" aria-label={`${noun} pages`}>
      {"href" in back ? (
        <Button variant="text" size="sm" icon={backIcon} href={back.href}>
          {back.label}
        </Button>
      ) : (
        <Button variant="text" size="sm" icon={backIcon} onClick={back.onBack}>
          {back.label}
        </Button>
      )}
      <span className="ui-pager-at">{`${at.toLocaleString("en-US")} of ${total.toLocaleString("en-US")}`}</span>
      <span className="ui-pager-arrows">
        <Button
          variant="secondary"
          size="sm"
          icon={<ChevronLeft size={18} aria-hidden />}
          aria-label={`Previous ${noun}`}
          title={onPrev ? `Previous ${noun} (K)` : `This is the first ${noun}`}
          disabled={!onPrev}
          onClick={() => onPrev?.()}
        />
        <Button
          variant="secondary"
          size="sm"
          icon={<ChevronRight size={18} aria-hidden />}
          aria-label={`Next ${noun}`}
          title={onNext ? `Next ${noun} (J)` : `This is the last ${noun}`}
          disabled={!onNext}
          onClick={() => onNext?.()}
        />
      </span>
      {decision || more?.length ? (
        <span className="ui-pager-decide">
          {decision && (
            <Button variant="primary" size="sm" onClick={decision.onPress}>
              {left != null && left > 0 ? `${decision.label}, ${left.toLocaleString("en-US")} left` : decision.label}
            </Button>
          )}
          {more?.length ? <Menu label="More" items={more} /> : null}
        </span>
      ) : null}
    </nav>
  );
}
