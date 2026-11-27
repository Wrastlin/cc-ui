"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { List } from "lucide-react";
import Button from "../Button";
import ReviewPager from "../ReviewPager";
import Sheet from "../Sheet";
import { useNarrow } from "../parts/useNarrow";

// One item in hand from a pile (gap 3c). The paper process (global rule, Aaron 11/04): pick up the one document, match
// its lines, make the mark, and see the original as is. So: the pager and the one decision in the item's header, the
// item's name as the h1, its lines to match, then the original document untouched. The jump list (every item, the
// current one selected) is the left pane on a desk and a Sheet on a phone (Material 3 list-detail: back in one pane,
// selection in two). Deciding moves to the next open item (nextOpen), never a separate "N left" banner.

export default function ReviewPage({
  pager,
  title,
  status,
  list,
  listTitle,
  document,
  children,
}: {
  pager: ComponentProps<typeof ReviewPager>;
  /** The item's name ("Manion's invoice 4480"). The page's only h1. */
  title: string;
  /** One status word beside the name (Open, Approved). */
  status?: ReactNode;
  /** Every item, the current one selected (RowList or NavRows). Desk: the left pane. Phone: a Sheet. */
  list?: ReactNode;
  /** The list's name on the phone's button and Sheet ("All invoices"). */
  listTitle?: string;
  /** The original, shown as is: a PDF frame or the scan. Never marked or cropped. */
  document?: ReactNode;
  /** The item's lines to match and the marks made on them. */
  children: ReactNode;
}) {
  const narrow = useNarrow();
  const [listOpen, setListOpen] = useState(false);
  const jump = listTitle ?? "All items";
  return (
    <main className="ui-tpl ui-tpl-review" data-screen-type="review">
      {list && !narrow && (
        <nav className="ui-tpl-review-list" aria-label={jump}>
          {list}
        </nav>
      )}
      <div className="ui-tpl-review-main">
        <ReviewPager {...pager} docTitle={pager.docTitle ?? title} />
        <header className="ui-tpl-identity">
          <div>
            <h1 className="ui-tpl-title">{title}</h1>
            {status}
          </div>
          {list && narrow && (
            <Button variant="secondary" size="sm" icon={<List size={18} aria-hidden />} onClick={() => setListOpen(true)}>
              {jump}
            </Button>
          )}
        </header>
        <div className="ui-tpl-review-cols">
          <section className="ui-tpl-review-lines" aria-label="Lines">
            {children}
          </section>
          {document && (
            <section className="ui-tpl-review-doc" aria-label="Original">
              {document}
            </section>
          )}
        </div>
      </div>
      {list && narrow && (
        <Sheet open={listOpen} onClose={() => setListOpen(false)} title={jump}>
          <div onClickCapture={() => setListOpen(false)}>{list}</div>
        </Sheet>
      )}
    </main>
  );
}
