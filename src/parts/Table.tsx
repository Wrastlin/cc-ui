"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.
// The phone layout (each row a stack of label and value) follows Untitled UI's table on small screens: MIT, LICENSES/.

import { ArrowUp } from "lucide-react";
import type { ReactNode } from "react";
import {
  Cell,
  Column,
  GridList,
  GridListItem,
  Row,
  Table as AriaTable,
  TableBody,
  TableHeader,
  type Key,
  type Selection,
  type SortDescriptor,
} from "react-aria-components";
import { cx, focusRingInset } from "./cx";
import { useNarrow } from "./useNarrow";

export interface TableColumn<T> {
  id: string;
  label: string;
  /** The row's name: one per table, first on the phone stack and what a screen reader names the row by. */
  isRowHeader?: boolean;
  /** Numbers and money line up on the right. */
  align?: "start" | "end";
  allowsSorting?: boolean;
  /** Shown as it is; defaults to the row's field of the same id. */
  render?: (row: T) => ReactNode;
  /** Left off the phone stack: a column that repeats what the row header says. */
  hideOnPhone?: boolean;
}

export interface TableProps<T extends { id: Key }> {
  "aria-label": string;
  columns: TableColumn<T>[];
  rows: T[];
  /** A tap on a row opens it. */
  onRowAction?: (id: Key) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (d: SortDescriptor) => void;
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  /** What the table says with no rows. */
  emptyText?: string;
  className?: string;
}

function value<T extends { id: Key }>(col: TableColumn<T>, row: T): ReactNode {
  if (col.render) return col.render(row);
  const v = (row as Record<string, unknown>)[col.id];
  return v == null ? "" : String(v);
}

/**
 * Rows of records with the same fields. A desk gets columns; at 390 each row becomes its name over label and value
 * pairs, the same records, the same tap, so nothing is cut off or scrolled sideways.
 */
export function Table<T extends { id: Key }>(props: TableProps<T>) {
  const narrow = useNarrow();
  const { columns, rows, onRowAction, emptyText = "None", className } = props;
  const head = columns.find((c) => c.isRowHeader) ?? columns[0];

  if (narrow) {
    return (
      <GridList
        aria-label={props["aria-label"]}
        items={rows}
        onAction={onRowAction}
        selectionMode={props.selectionMode === "none" ? undefined : props.selectionMode}
        selectedKeys={props.selectedKeys}
        onSelectionChange={props.onSelectionChange}
        renderEmptyState={() => <p className="m-0 px-4 py-4 text-cc-body text-cc-muted">{emptyText}</p>}
        className={cx("border-y border-solid border-cc-line", className)}
      >
        {(row) => (
          <GridListItem
            id={row.id}
            textValue={String(value(head, row))}
            className={cx(
              focusRingInset,
              "flex cursor-default flex-col gap-1 border-b border-solid border-cc-line px-4 py-3 last:border-b-0 data-hovered:bg-cc-hover data-pressed:bg-cc-selected data-selected:bg-cc-selected",
            )}
          >
            <span className="text-cc-body font-semibold text-cc-text">{value(head, row)}</span>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {columns
                .filter((c) => c !== head && !c.hideOnPhone)
                .map((c) => (
                  <div key={c.id} className="contents">
                    <dt className="text-cc-meta text-cc-muted">{c.label}</dt>
                    <dd className="m-0 text-cc-body text-cc-text tabular-nums">{value(c, row)}</dd>
                  </div>
                ))}
            </dl>
          </GridListItem>
        )}
      </GridList>
    );
  }

  return (
    <div className={cx("w-full overflow-x-auto", className)}>
      <AriaTable
        aria-label={props["aria-label"]}
        onRowAction={onRowAction}
        sortDescriptor={props.sortDescriptor}
        onSortChange={props.onSortChange}
        selectionMode={props.selectionMode}
        selectedKeys={props.selectedKeys}
        onSelectionChange={props.onSelectionChange}
        className="w-full border-separate border-spacing-0"
      >
        <TableHeader columns={columns}>
          {(c) => (
            <Column
              id={c.id}
              isRowHeader={c === head}
              allowsSorting={c.allowsSorting}
              className={cx(
                focusRingInset,
                "group h-10 cursor-default border-b border-solid border-cc-border px-3 text-cc-meta font-semibold text-cc-muted",
                c.align === "end" ? "text-end" : "text-start",
              )}
            >
              {({ allowsSorting, sortDirection }) => (
                <span className={cx("inline-flex items-center gap-1", c.align === "end" && "flex-row-reverse")}>
                  {c.label}
                  {allowsSorting && (
                    <ArrowUp
                      aria-hidden
                      size={14}
                      className={cx(!sortDirection && "invisible", sortDirection === "descending" && "rotate-180")}
                    />
                  )}
                </span>
              )}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows} renderEmptyState={() => <p className="m-0 px-3 py-4 text-cc-body text-cc-muted">{emptyText}</p>}>
          {(row) => (
            <Row
              id={row.id}
              columns={columns}
              className={cx(
                focusRingInset,
                "group/row cursor-default text-cc-body text-cc-text data-hovered:bg-cc-hover data-pressed:bg-cc-selected data-selected:bg-cc-selected",
              )}
            >
              {(c) => (
                <Cell
                  className={cx(
                    focusRingInset,
                    "border-b border-solid border-cc-line px-3 py-3 align-top",
                    c.align === "end" ? "text-end tabular-nums" : "text-start",
                    c === head && "font-semibold",
                  )}
                >
                  {value(c, row)}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </AriaTable>
    </div>
  );
}
