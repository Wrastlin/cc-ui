"use client";

import type { ReactNode } from "react";
import { BackButton } from "../BackButton";
import { Segmented } from "../parts/Tabs";

// The shrinking list (gap 3c). Aaron 11/25 on receiving: "marking something as received marks it off the list ... a
// 2-tab feature where it's like open and received ... we're operating in the open category, and we can move over to
// received and just see kind of history". Two views of one list: Open holds only what is left, Done is the history.
// An item leaves Open the moment it is done; the caller shows toast(..., { undo }) so a slip is one tap back. Rows keep
// the source document's order inside each view (a PO's lines in Zoho's order); Done reads newest first. Polaris index
// filters' saved views are the precedent for views as named subsets; GOV.UK "complete multiple tasks" for few statuses.

export type WorklistView = "open" | "done";

export default function WorklistPage({
  back,
  title,
  view,
  onView,
  counts,
  labels = { open: "Open", done: "Done" },
  action,
  search,
  children,
}: {
  back?: { label: string; href: string };
  /** The pile, by its name ("Manion's, open lines"). The page's only h1. */
  title: string;
  view: WorklistView;
  onView: (v: WorklistView) => void;
  counts: { open: number; done: number };
  /** The second view by the work's own word: Received, Paid, Approved. */
  labels?: { open: string; done: string };
  /** One command for the pile (Print the PO), beside the title. */
  action?: ReactNode;
  /** A search box over both views, one row under the views. */
  search?: ReactNode;
  /** The rows of the current view. When Open is empty the caller says so in one line ("Everything is received"). */
  children: ReactNode;
}) {
  const n = (x: number) => x.toLocaleString("en-US");
  return (
    <main className="ui-tpl ui-tpl-worklist" data-screen-type="worklist">
      {back && <BackButton label={back.label} href={back.href} />}
      <header className="ui-tpl-identity">
        <h1 className="ui-tpl-title">{title}</h1>
        {action && <div className="ui-tpl-actions">{action}</div>}
      </header>
      <Segmented
        label="Which items"
        className="ui-tpl-views"
        value={view}
        onChange={(k) => onView(k as WorklistView)}
        options={[
          { id: "open", label: `${labels.open} ${n(counts.open)}` },
          { id: "done", label: `${labels.done} ${n(counts.done)}` },
        ]}
      />
      {search && <div className="ui-tpl-toolbar">{search}</div>}
      <div className="ui-tpl-body" aria-live="polite">
        {children}
      </div>
    </main>
  );
}
