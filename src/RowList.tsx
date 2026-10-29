"use client";

import type { ReactNode } from "react";
import { GridList, GridListItem } from "react-aria-components";

// A list of rows on React Aria's GridList (HUMAN-UI move 2). Arrow keys move between rows, Tab reaches a link or button
// inside the focused row, and a screen reader hears "row 3 of 12". The caller keeps its own row markup and class: the
// gridcell React Aria wraps around children is display: contents, so a row laid out as a CSS grid keeps its columns.
// Render RowList from a client component. Rows built in a server component stream into React Aria's hidden <template>,
// React cannot reveal them there, and the page loses rows and fails hydration (n64r, /tasks: 24 of 851 rows).
// keyboardNavigationBehavior "tab": React Aria's default "arrow" makes Tab leave the list, so a row's link was unreachable.

export function RowList({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <GridList
      aria-label={label}
      className={["ui-rowlist", className].filter(Boolean).join(" ")}
      layout="stack"
      keyboardNavigationBehavior="tab"
    >
      {children}
    </GridList>
  );
}

export function ListRow({
  id,
  textValue,
  className,
  children,
}: {
  id: string;
  /** What typeahead matches and a screen reader reads first. */
  textValue: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <GridListItem id={id} textValue={textValue} className={["ui-listrow", className].filter(Boolean).join(" ")}>
      {children}
    </GridListItem>
  );
}
