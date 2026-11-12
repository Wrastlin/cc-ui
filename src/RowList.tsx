"use client";

import { Children, useState, type ReactNode } from "react";
import { GridList, GridListItem } from "react-aria-components";
import Button from "./Button";

// A list of rows on React Aria's GridList (HUMAN-UI move 2). Arrow keys move between rows, Tab reaches a link or button
// inside the focused row, and a screen reader hears "row 3 of 12". The caller keeps its own row markup and class: the
// gridcell React Aria wraps around children is display: contents, so a row laid out as a CSS grid keeps its columns.
// Render RowList from a client component. Rows built in a server component stream into React Aria's hidden <template>,
// React cannot reveal them there, and the page loses rows and fails hydration (n64r, /tasks: 24 of 851 rows).
// keyboardNavigationBehavior "tab": React Aria's default "arrow" makes Tab leave the list, so a row's link was unreachable.

// A list says how much it shows (P16, Aaron 11/11: "very, very long lists"). `paging` is required: the caller either
// pages with usePaging (10 to 25 rows a page, a Show more under the list) or states the list is short and stays short.
// The page budget gate (cc-app check-page-budget) catches a "short" list that grows past SHORT.
export const SHORT = 25;

export type Paging = {
  shown: number;
  total: number;
  step: number;
  more: () => void;
  /** Shows at least the first n rows, as a jump to a letter or a found row does. */
  through: (n: number) => void;
};

/** The first pageSize items, then pageSize more per Show more. Starts over when the list changes length (a search). */
export function usePaging<T>(items: readonly T[], pageSize = 20): { page: T[]; paging: Paging } {
  const size = Math.min(25, Math.max(10, pageSize));
  if (process.env.NODE_ENV !== "production" && size !== pageSize) {
    console.error(`usePaging: pageSize ${pageSize} is outside 10 to 25; using ${size}.`);
  }
  const [state, setState] = useState({ n: size, total: items.length });
  const n = state.total === items.length ? state.n : size;
  if (state.total !== items.length) setState({ n: size, total: items.length });
  const shown = Math.min(n, items.length);
  return {
    page: items.slice(0, shown),
    paging: {
      shown,
      total: items.length,
      step: size,
      more: () => setState({ n: n + size, total: items.length }),
      through: (k: number) => setState({ n: Math.max(n, Math.ceil(k / size) * size), total: items.length }),
    },
  };
}

export function RowList({
  label,
  className,
  paging,
  children,
}: {
  label: string;
  className?: string;
  /** usePaging's paging, or "short" for a list that never passes SHORT rows. */
  paging: Paging | "short";
  children: ReactNode;
}) {
  if (process.env.NODE_ENV !== "production" && paging === "short" && Children.count(children) > SHORT) {
    console.error(`RowList "${label}": ${Children.count(children)} rows marked short; page it with usePaging.`);
  }
  const left = paging === "short" ? 0 : paging.total - paging.shown;
  return (
    <>
      <GridList
        aria-label={label}
        className={["ui-rowlist", className].filter(Boolean).join(" ")}
        layout="stack"
        keyboardNavigationBehavior="tab"
      >
        {children}
      </GridList>
      {left > 0 && paging !== "short" ? (
        <div className="ui-rowlist-more">
          <Button variant="secondary" onClick={paging.more}>
            Show {Math.min(left, paging.step)} more of {left.toLocaleString("en-US")}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export function ListRow({
  id,
  textValue,
  className,
  onAction,
  isDisabled,
  children,
}: {
  id: string;
  /** What typeahead matches and a screen reader reads first. */
  textValue: string;
  className?: string;
  /** The whole row is the target (a tap, Enter): no button nested inside it to carry the action. */
  onAction?: () => void;
  isDisabled?: boolean;
  children: ReactNode;
}) {
  return (
    <GridListItem
      id={id}
      textValue={textValue}
      onAction={onAction}
      isDisabled={isDisabled}
      className={["ui-listrow", className].filter(Boolean).join(" ")}
    >
      {children}
    </GridListItem>
  );
}
